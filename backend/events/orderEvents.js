import eventBus from "./eventBus.js";
import { emailQueue } from "../queues/emailQueue.js";
import { emitOrderStatusChange } from "../sockets/socketEvents.js";

eventBus.on("ORDER_PREPARED", async (data) => {
  const { orderId, customerEmail, customerId } = data;

  await emailQueue.add("orderPreparedEmail", {
    email: customerEmail,
    orderId,
  });

  emitOrderStatusChange(customerId, {
    orderId,
    status: "prepared",
  });
});