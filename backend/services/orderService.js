import Order from "../models/Order.js";
import User from "../models/User.js";
import eventBus from "../events/eventBus.js";

export const confirmOrderService = async (orderId, chefId) => {
  const order = await Order.findById(orderId);

  if (!order) throw new Error("Order not found");

  if (order.status !== "assigned_to_kitchen") {
    throw new Error("Invalid order status");
  }

  order.status = "confirmed";
  order.actualPrepStartTime = new Date();

  await order.save();

  await User.updateOne(
    { _id: chefId },
    { $inc: { currentCapacity: 1 } }
  );

  eventBus.emit("ORDER_CONFIRMED", {
    orderId,
    chefId,
    customerId: order.customerId,
  });

  return order;
};