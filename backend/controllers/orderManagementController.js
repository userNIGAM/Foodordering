// backend/controllers/orderManagementController.js
import Order from "../models/Order.js";
import Kitchen from "../models/Kitchen.js";
import User from "../models/User.js";
import ChefAssignment from "../models/ChefAssignment.js";
import DeliveryAssignment from "../models/DeliveryAssignment.js";
import OrderTimeline from "../models/OrderTimeline.js";
import { sendEmail } from "../utils/mailer.js";
import {
  emitOrderStatusChange,
  emitOrderAssignedToChef,
  emitOrderAssignedToDelivery,
} from "../utils/socketEvents.js";
import { notifyUser, notifyAdmins } from "../socket.js";

/**
 * Get pending orders (awaiting verification)
 */
export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get Pending Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Verify order (Admin approves order)
 */
export const verifyOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const adminId = req.user._id;
    const { verificationNotes, estimatedPrepTime } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Order must be in pending status",
      });
    }

    // Update order
    order.status = "verified";
    order.verificationStatus = "verified";
    order.verifiedBy = adminId;
    order.verificationNotes = verificationNotes || "";
    order.estimatedPrepTime = estimatedPrepTime || 30;
    order.timeline.push({
      event: "order_verified",
      changedBy: adminId,
      changedByRole: "admin",
      timestamp: new Date(),
      notes: verificationNotes || "Order verified",
      previousStatus: "pending",
    });
    await order.save();

    // Create timeline
    await OrderTimeline.create({
      orderId: order._id,
      events: [
        {
          event: "order_created",
          status: "pending",
          changedBy: {
            userId: adminId,
            name: "System",
            role: "admin",
          },
          timestamp: order.createdAt,
        },
        {
          event: "order_verified",
          status: "verified",
          changedBy: {
            userId: adminId,
            role: "admin",
          },
          timestamp: new Date(),
          notes: verificationNotes || "",
        },
      ],
      verifiedBy: adminId,
    });

    // Send email to customer
    await sendEmail({
      to: order.customer.email,
      subject: `Order ${order.orderId} Verified`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Order Verified</h2>
          <p>Hi ${order.customer.name},</p>
          <p>Your order <strong>${order.orderId}</strong> has been verified.</p>
          <p>Estimated preparation time: ${estimatedPrepTime || 30} minutes</p>
          <p>We will notify you once the order is being prepared.</p>
        </div>
      `,
    });

    // 📡 Emit socket event
    emitOrderStatusChange(orderId, {
      orderId: order._id,
      status: "verified",
      adminId,
      customerId: order.customer.email,
      estimatedPrepTime: estimatedPrepTime || 30,
      message: "Your order has been verified. Preparation will start soon.",
    });

    return res.status(200).json({
      success: true,
      message: "Order verified successfully",
      data: order,
    });
  } catch (error) {
    console.error("Verify Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Reject order (Admin rejects order)
 */
export const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const adminId = req.user._id;
    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be rejected",
      });
    }

    // Update order
    order.status = "cancelled";
    order.verificationStatus = "rejected";
    order.verifiedBy = adminId;
    order.verificationNotes = reason || "Rejected by admin";
    order.timeline.push({
      event: "order_rejected",
      changedBy: adminId,
      changedByRole: "admin",
      timestamp: new Date(),
      notes: reason || "Order rejected",
      previousStatus: "pending",
    });
    await order.save();

    // Send rejection email to customer
    await sendEmail({
      to: order.customer.email,
      subject: `Order ${order.orderId} Could Not Be Processed`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Order Status Update</h2>
          <p>Hi ${order.customer.name},</p>
          <p>Unfortunately, we couldn't process your order <strong>${order.orderId}</strong>.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
          <p>Your payment has been refunded.</p>
          <p>Please try again or contact support.</p>
        </div>
      `,
    });

    // 📡 Emit socket event
    emitOrderStatusChange(orderId, {
      orderId: order._id,
      status: "cancelled",
      adminId,
      customerId: order.customer.email,
      reason,
      message: "Your order could not be processed",
    });

    return res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      data: order,
    });
  } catch (error) {
    console.error("Reject Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Assign order to kitchen
 */
export const assignToKitchen = async (req, res) => {
  try {
    const { orderId } = req.params;
    const adminId = req.user._id;
    const { kitchenId, chefId } = req.body;

    if (!kitchenId || !chefId) {
      return res.status(400).json({
        success: false,
        message: "Kitchen ID and Chef ID are required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "verified") {
      return res.status(400).json({
        success: false,
        message: "Order must be verified first",
      });
    }

    // Get chef
    const chef = await User.findById(chefId);
    if (!chef || chef.role !== "chef") {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    // Check chef capacity
    if (chef.currentCapacity >= chef.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: `Chef ${chef.name} is at max capacity`,
      });
    }

    // Get kitchen
    const kitchen = await Kitchen.findById(kitchenId);
    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: "Kitchen not found",
      });
    }

    // Update order
    order.status = "assigned_to_kitchen";
    order.kitchenId = kitchenId;
    order.chefId = chefId;
    order.timeline.push({
      event: "assigned_to_kitchen",
      changedBy: adminId,
      changedByRole: "admin",
      timestamp: new Date(),
      notes: `Assigned to ${chef.name}`,
      previousStatus: "verified",
    });
    await order.save();

    // Create chef assignment
    const chefAssignment = await ChefAssignment.create({
      orderId: order._id,
      chefId,
      kitchenId,
      assignedBy: adminId,
      estimatedPrepTime: order.estimatedPrepTime,
    });

    // Update timeline
    const timeline = await OrderTimeline.findOne({ orderId });
    if (timeline) {
      timeline.chefId = chefId;
      timeline.events.push({
        event: "assigned_to_kitchen",
        status: "assigned_to_kitchen",
        changedBy: {
          userId: adminId,
          role: "admin",
        },
        timestamp: new Date(),
        metadata: {
          chefId,
          kitchenId,
        },
      });
      await timeline.save();
    }

    // Send notification to chef
    await sendEmail({
      to: chef.email,
      subject: `New Order Assigned - ${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Order Assigned</h2>
          <p>Hi ${chef.name},</p>
          <p>New order <strong>${order.orderId}</strong> has been assigned to you.</p>
          <p><strong>Items:</strong> ${order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}</p>
          <p><strong>Estimated Prep Time:</strong> ${order.estimatedPrepTime} minutes</p>
          <p>Please confirm the order in your dashboard.</p>
        </div>
      `,
    });

    // 📡 Emit socket event
    emitOrderAssignedToChef(chefId, {
      orderId: order._id,
      chefId,
      chefName: chef.name,
      kitchenId,
      items: order.items,
      estimatedPrepTime: order.estimatedPrepTime,
      message: `New order ${order.orderId} assigned to you`,
    });

    return res.status(200).json({
      success: true,
      message: "Order assigned to kitchen successfully",
      data: {
        order,
        chefAssignment,
      },
    });
  } catch (error) {
    console.error("Assign To Kitchen Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Assign delivery person
 */
export const assignDeliveryPerson = async (req, res) => {
  try {
    const { orderId } = req.params;
    const adminId = req.user._id;
    const { deliveryPersonId } = req.body;

    if (!deliveryPersonId) {
      return res.status(400).json({
        success: false,
        message: "Delivery Person ID is required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "prepared") {
      return res.status(400).json({
        success: false,
        message: "Order must be prepared first",
      });
    }

    // Get delivery person
    const deliveryPerson = await User.findById(deliveryPersonId);
    if (!deliveryPerson || deliveryPerson.role !== "delivery_person") {
      return res.status(404).json({
        success: false,
        message: "Delivery person not found",
      });
    }

    // Update order
    order.status = "assigned_to_delivery";
    order.deliveryPersonId = deliveryPersonId;
    order.timeline.push({
      event: "assigned_to_delivery",
      changedBy: adminId,
      changedByRole: "admin",
      timestamp: new Date(),
      notes: `Assigned to ${deliveryPerson.name}`,
      previousStatus: "prepared",
    });
    await order.save();

    // Create delivery assignment
    const deliveryAssignment = await DeliveryAssignment.create({
      orderId: order._id,
      deliveryPersonId,
      assignedBy: adminId,
      estimatedDeliveryTime: order.estimatedDeliveryTime || 45,
    });

    // Send notification to delivery person
    await sendEmail({
      to: deliveryPerson.email,
      subject: `Delivery Assigned - Order ${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Delivery Assignment</h2>
          <p>Hi ${deliveryPerson.name},</p>
          <p>You have been assigned delivery for order <strong>${order.orderId}</strong>.</p>
          <p><strong>Customer:</strong> ${order.customer.name}</p>
          <p><strong>Address:</strong> ${order.customer.address}</p>
          <p><strong>Total:</strong> ₹${order.total}</p>
          <p>Please pick up the order from the kitchen.</p>
        </div>
      `,
    });

    // 📡 Emit socket event
    emitOrderAssignedToDelivery(deliveryPersonId, {
      orderId: order._id,
      deliveryPersonId,
      deliveryPersonName: deliveryPerson.name,
      customerName: order.customer.name,
      address: order.customer.address,
      total: order.total,
      estimatedDeliveryTime: order.estimatedDeliveryTime || 45,
      message: `New delivery assigned: Order ${order.orderId}`,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery person assigned successfully",
      data: {
        order,
        deliveryAssignment,
      },
    });
  } catch (error) {
    console.error("Assign Delivery Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get order by ID with timeline
 */
export const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("chefId", "name chefRating completedOrders")
      .populate("deliveryPersonId", "name deliveryRating completedDeliveries")
      .populate("verifiedBy", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const timeline = await OrderTimeline.findOne({ orderId });

    return res.status(200).json({
      success: true,
      data: {
        order,
        timeline: timeline ? timeline.events : [],
      },
    });
  } catch (error) {
    console.error("Get Order Detail Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all orders with filters
 */
export const getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate("chefId", "name")
      .populate("deliveryPersonId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default {
  getPendingOrders,
  verifyOrder,
  rejectOrder,
  assignToKitchen,
  assignDeliveryPerson,
  getOrderDetail,
  getAllOrders,
};
