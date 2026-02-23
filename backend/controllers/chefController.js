// backend/controllers/chefController.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import ChefAssignment from "../models/ChefAssignment.js";
import OrderTimeline from "../models/OrderTimeline.js";
import { sendEmail } from "../utils/mailer.js";
import {
  emitOrderStatusChange,
  emitIssueReported,
  emitChefDashboardUpdate,
} from "../utils/socketEvents.js";
import { notifyUser, notifyAdmins } from "../socket.js";

/**
 * Get all orders assigned to chef
 */
export const getAssignedOrders = async (req, res) => {
  try {
    const chefId = req.user._id;

    const orders = await Order.find({ chefId })
      .select("-customer.email -customer.phone") // Hide sensitive data
      .sort({ createdAt: -1 });

    const orderStats = {
      total: orders.length,
      assigned: orders.filter((o) => o.status === "assigned_to_kitchen").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      prepared: orders.filter((o) => o.status === "prepared").length,
      issues: orders.filter((o) => o.status === "issue").length,
    };

    return res.status(200).json({
      success: true,
      stats: orderStats,
      data: orders,
    });
  } catch (error) {
    console.error("Get Assigned Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Confirm order - Chef confirms they'll prepare
 */
export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const chefId = req.user._id;
    const { notes } = req.body;

    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify chef
    if (order.chefId.toString() !== chefId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to confirm this order",
      });
    }

    // Check order status
    if (order.status !== "assigned_to_kitchen") {
      return res.status(400).json({
        success: false,
        message: `Cannot confirm order in ${order.status} status`,
      });
    }

    // Update chef capacity
    const chef = await User.findById(chefId);
    chef.currentCapacity += 1;
    await chef.save();

    // Update order
    order.status = "confirmed";
    order.actualPrepStartTime = new Date();
    order.timeline.push({
      event: "chef_confirmed",
      changedBy: chefId,
      changedByRole: "chef",
      timestamp: new Date(),
      notes: notes || "Chef confirmed order",
      previousStatus: "assigned_to_kitchen",
    });
    await order.save();

    // Update/Create chef assignment
    let chefAssignment = await ChefAssignment.findOne({ orderId });
    if (chefAssignment) {
      chefAssignment.status = "confirmed";
      chefAssignment.notes = notes || "";
      await chefAssignment.save();
    }

    // Update timeline
    const timeline = await OrderTimeline.findOne({ orderId });
    if (timeline) {
      timeline.events.push({
        event: "chef_confirmed",
        status: "confirmed",
        changedBy: {
          userId: chefId,
          name: chef.name,
          role: "chef",
        },
        notes: notes || "",
        previousStatus: "assigned_to_kitchen",
      });
      await timeline.save();
    }

    // 📡 Emit socket event
    emitOrderStatusChange(orderId, {
      orderId: order._id,
      status: "confirmed",
      chefId,
      kitchenId: order.kitchenId,
      customerId: order.customer.email, // Using email as identifier for now
      message: "Chef confirmed your order",
    });

    return res.status(200).json({
      success: true,
      message: "Order confirmed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Confirm Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Start preparing
 */
export const startPreparing = async (req, res) => {
  try {
    const { orderId } = req.params;
    const chefId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.chefId.toString() !== chefId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (order.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Can only start preparing confirmed orders",
      });
    }

    // Update order
    order.status = "preparing";
    order.timeline.push({
      event: "preparation_started",
      changedBy: chefId,
      changedByRole: "chef",
      timestamp: new Date(),
      previousStatus: "confirmed",
    });
    await order.save();

    // Update chef assignment
    const chefAssignment = await ChefAssignment.findOneAndUpdate(
      { orderId },
      {
        status: "preparing",
        startTime: new Date(),
      },
      { new: true }
    );

    // 📡 Emit socket event
    emitOrderStatusChange(orderId, {
      orderId: order._id,
      status: "preparing",
      chefId,
      kitchenId: order.kitchenId,
      customerId: order.customer.email,
      message: "Chef started preparing your order",
    });

    return res.status(200).json({
      success: true,
      message: "Preparation started",
      data: order,
    });
  } catch (error) {
    console.error("Start Preparing Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Mark order as prepared
 */
export const markAsPrepared = async (req, res) => {
  try {
    const { orderId } = req.params;
    const chefId = req.user._id;
    const { notes } = req.body;

    const order = await Order.findById(orderId).populate("chefId");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.chefId._id.toString() !== chefId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (order.status !== "preparing") {
      return res.status(400).json({
        success: false,
        message: "Order must be in preparing status",
      });
    }

    // Update order
    order.status = "prepared";
    order.actualPrepEndTime = new Date();
    order.timeline.push({
      event: "preparation_completed",
      changedBy: chefId,
      changedByRole: "chef",
      timestamp: new Date(),
      notes: notes || "Order prepared",
      previousStatus: "preparing",
    });
    await order.save();

    // Update chef capacity
    const chef = await User.findById(chefId);
    chef.currentCapacity -= 1;
    chef.completedOrders += 1;
    await chef.save();

    // Update chef assignment
    const chefAssignment = await ChefAssignment.findOneAndUpdate(
      { orderId },
      {
        status: "prepared",
        completionTime: new Date(),
        actualPrepTime: Math.round(
          (new Date() - order.actualPrepStartTime) / 60000
        ),
      },
      { new: true }
    );

    // Send email to admin/delivery team
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@example.com",
      subject: `Order ${order.orderId} Ready for Delivery`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Order Prepared</h2>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Chef:</strong> ${chef.name}</p>
          <p><strong>Prep Time:</strong> ${chefAssignment.actualPrepTime} minutes</p>
          <p>Order is ready for delivery assignment.</p>
        </div>
      `,
    });

    // 📡 Emit socket event
    emitOrderStatusChange(orderId, {
      orderId: order._id,
      status: "prepared",
      chefId,
      kitchenId: order.kitchenId,
      customerId: order.customer.email,
      prepTime: chefAssignment.actualPrepTime,
      message: "Your order is prepared and ready for delivery",
    });

    return res.status(200).json({
      success: true,
      message: "Order marked as prepared",
      data: order,
    });
  } catch (error) {
    console.error("Mark As Prepared Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Report issue with order
 */
export const reportIssue = async (req, res) => {
  try {
    const { orderId } = req.params;
    const chefId = req.user._id;
    const { description, severity } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.chefId.toString() !== chefId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Update order
    order.status = "issue";
    order.issue = {
      description,
      reportedBy: chefId,
      reportedByRole: "chef",
      reportedAt: new Date(),
      status: "open",
    };
    order.timeline.push({
      event: "issue_reported",
      changedBy: chefId,
      changedByRole: "chef",
      timestamp: new Date(),
      notes: description,
      previousStatus: order.status,
    });
    await order.save();

    // Update chef assignment
    const chefAssignment = await ChefAssignment.findOne({ orderId });
    if (chefAssignment) {
      chefAssignment.issues.push({
        description,
        reportedAt: new Date(),
        severity: severity || "medium",
      });
      await chefAssignment.save();
    }

    // Notify admin
    const chef = await User.findById(chefId);
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@example.com",
      subject: `ISSUE REPORTED - Order ${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: red;">Issue Reported</h2>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Chef:</strong> ${chef.name}</p>
          <p><strong>Severity:</strong> ${severity || "medium"}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p>Please take immediate action.</p>
        </div>
      `,
    });

    // 📡 Emit socket event for urgent admin notification
    emitIssueReported(orderId, {
      orderId: order._id,
      chefId,
      chefName: chef.name,
      kitchenId: order.kitchenId,
      severity: severity || "medium",
      description,
      message: `Issue reported in order ${order.orderId} by ${chef.name}`,
    });

    return res.status(200).json({
      success: true,
      message: "Issue reported successfully",
      data: order,
    });
  } catch (error) {
    console.error("Report Issue Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get chef dashboard stats
 */
export const getChefDashboard = async (req, res) => {
  try {
    const chefId = req.user._id;

    const chef = await User.findById(chefId).select(
      "name completedOrders chefRating currentCapacity maxCapacity"
    );

    const orders = await Order.find({ chefId });

    const stats = {
      totalOrders: orders.length,
      completed: orders.filter((o) => o.status === "prepared").length,
      inProgress: orders.filter((o) =>
        ["confirmed", "preparing"].includes(o.status)
      ).length,
      issues: orders.filter((o) => o.status === "issue").length,
      currentCapacity: chef.currentCapacity,
      maxCapacity: chef.maxCapacity,
      completedOrders: chef.completedOrders,
      rating: chef.chefRating,
    };

    const preparedOrders = orders.filter((o) => o.status === "prepared");

    // 📡 Emit socket event for real-time dashboard update
    emitChefDashboardUpdate(chefId, {
      chefId,
      stats,
      inProgressCount: stats.inProgress,
      completedToday: stats.completed,
      issuesCount: stats.issues,
      currentCapacity: stats.currentCapacity,
      maxCapacity: stats.maxCapacity,
    });

    return res.status(200).json({
      success: true,
      data: {
        chef: {
          name: chef.name,
          rating: chef.chefRating,
          completedOrders: chef.completedOrders,
        },
        stats,
        preparedOrders,
      },
    });
  } catch (error) {
    console.error("Get Chef Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default {
  getAssignedOrders,
  confirmOrder,
  startPreparing,
  markAsPrepared,
  reportIssue,
  getChefDashboard,
};
