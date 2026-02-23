// backend/controllers/deliveryController.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import DeliveryAssignment from "../models/DeliveryAssignment.js";
import { sendEmail } from "../utils/mailer.js";
import {
  emitOrderStatusChange,
  emitDeliveryLocationUpdate,
  emitDeliveryDashboardUpdate,
} from "../utils/socketEvents.js";
import { notifyCustomer } from "../socket.js";

/**
 * Get all assigned orders for delivery person
 */
export const getAssignedOrders = async (req, res) => {
  try {
    const deliveryPersonId = req.user._id;

    const orders = await Order.find({ deliveryPersonId })
      .lean()
      .sort({ createdAt: -1 });

    const orderStats = {
      total: orders.length,
      assigned: orders.filter((o) => o.status === "assigned_to_delivery").length,
      pickedUp: orders.filter((o) => o.status === "picked_up").length,
      inTransit: orders.filter((o) => o.status === "out_for_delivery").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
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
 * Get pending pickups (prepared orders waiting for delivery)
 */
export const getPendingPickups = async (req, res) => {
  try {
    const orders = await Order.find({ status: "prepared" })
      .select("orderId customer total estimatedDeliveryTime items")
      .sort({ createdAt: 1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get Pending Pickups Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Pickup order
 */
export const pickupOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deliveryPersonId = req.user._id;
    const { notes } = req.body;

    const order = await Order.findById(orderId).populate("deliveryPersonId");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.deliveryPersonId._id.toString() !== deliveryPersonId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to pickup this order",
      });
    }

    if (order.status !== "assigned_to_delivery") {
      return res.status(400).json({
        success: false,
        message: `Cannot pickup order in ${order.status} status`,
      });
    }

    // Update order
    order.status = "picked_up";
    order.pickupTime = new Date();
    order.timeline.push({
      event: "picked_up",
      changedBy: deliveryPersonId,
      changedByRole: "delivery_person",
      timestamp: new Date(),
      notes: notes || "Order picked up from kitchen",
      previousStatus: "assigned_to_delivery",
    });
    await order.save();

    // Update delivery assignment
    await DeliveryAssignment.findOneAndUpdate(
      { orderId },
      {
        status: "picked_up",
        pickupTime: new Date(),
      }
    );

    // Send notification to customer
    await sendEmail({
      to: order.customer.email,
      subject: `Your Order ${order.orderId} is On The Way`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Order Picked Up</h2>
          <p>Hi ${order.customer.name},</p>
          <p>Your order <strong>${order.orderId}</strong> has been picked up from the kitchen.</p>
          <p>It will be delivered to you shortly.</p>
          <p>Delivery person will contact you soon.</p>
        </div>
      `,
    });

    // 📡 Emit socket event
    emitOrderStatusChange(orderId, {
      orderId: order._id,
      status: "picked_up",
      deliveryPersonId,
      customerId: order.customer.email,
      pickupTime: order.pickupTime,
      message: "Your order has been picked up and is on the way",
    });

    return res.status(200).json({
      success: true,
      message: "Order picked up successfully",
      data: order,
    });
  } catch (error) {
    console.error("Pickup Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Mark as in transit with location
 */
export const markInTransit = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deliveryPersonId = req.user._id;
    const { latitude, longitude, address } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.deliveryPersonId.toString() !== deliveryPersonId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (order.status !== "picked_up") {
      return res.status(400).json({
        success: false,
        message: "Order must be picked up first",
      });
    }

    // Update order
    order.status = "out_for_delivery";
    order.timeline.push({
      event: "in_transit",
      changedBy: deliveryPersonId,
      changedByRole: "delivery_person",
      timestamp: new Date(),
      previousStatus: "picked_up",
    });
    await order.save();

    // Update delivery assignment with location
    const deliveryAssignment = await DeliveryAssignment.findOneAndUpdate(
      { orderId },
      {
        status: "in_transit",
        location: {
          latitude,
          longitude,
          address: address || "",
          lastUpdated: new Date(),
        },
      },
      { new: true }
    );

    // Send notification to customer
    await sendEmail({
      to: order.customer.email,
      subject: `${order.orderId} - Out for Delivery`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Out for Delivery!</h2>
          <p>Hi ${order.customer.name},</p>
          <p>Your order is on the way! We'll be there soon.</p>
          <p>You can track your order in real-time.</p>
        </div>
      `,
    });

    // 📡 Emit socket event
    emitOrderStatusChange(orderId, {
      orderId: order._id,
      status: "out_for_delivery",
      deliveryPersonId,
      customerId: order.customer.email,
      location: { latitude, longitude, address },
      message: "Your order is out for delivery",
    });

    // 📡 Emit location update
    emitDeliveryLocationUpdate(orderId, {
      orderId: order._id,
      deliveryPersonId,
      latitude,
      longitude,
      address,
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Order marked as in transit",
      data: order,
    });
  } catch (error) {
    console.error("Mark In Transit Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Update location during transit
 */
export const updateLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deliveryPersonId = req.user._id;
    const { latitude, longitude, address } = req.body;

    // Update delivery assignment location
    const deliveryAssignment = await DeliveryAssignment.findOneAndUpdate(
      { orderId },
      {
        $set: {
          "location.latitude": latitude,
          "location.longitude": longitude,
          "location.address": address || "",
          "location.lastUpdated": new Date(),
        },
        $push: {
          locationHistory: {
            latitude,
            longitude,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!deliveryAssignment) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // 📡 Emit location update socket event for real-time tracking
    emitDeliveryLocationUpdate(orderId, {
      orderId,
      deliveryPersonId,
      latitude,
      longitude,
      address,
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Location updated",
      data: deliveryAssignment,
    });
  } catch (error) {
    console.error("Update Location Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Mark order as delivered
 */
export const deliverOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deliveryPersonId = req.user._id;
    const { notes } = req.body;

    const order = await Order.findById(orderId).populate("deliveryPersonId");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.deliveryPersonId._id.toString() !== deliveryPersonId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (order.status !== "out_for_delivery") {
      return res.status(400).json({
        success: false,
        message: "Order must be in transit",
      });
    }

    // Update order
    order.status = "delivered";
    order.actualDeliveryTime = new Date();
    order.timeline.push({
      event: "delivered",
      changedBy: deliveryPersonId,
      changedByRole: "delivery_person",
      timestamp: new Date(),
      notes: notes || "Order delivered",
      previousStatus: "out_for_delivery",
    });
    await order.save();

    // Update delivery person stats
    const deliveryPerson = await User.findById(deliveryPersonId);
    deliveryPerson.completedDeliveries += 1;
    await deliveryPerson.save();

    // Update delivery assignment
    const deliveryAssignment = await DeliveryAssignment.findOneAndUpdate(
      { orderId },
      {
        status: "delivered",
        deliveryTime: new Date(),
        actualDeliveryTime: Math.round(
          (new Date() - order.pickupTime) / 60000
        ),
      },
      { new: true }
    );

    // Send confirmation to customer
    await sendEmail({
      to: order.customer.email,
      subject: `Order ${order.orderId} Delivered`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Order Delivered!</h2>
          <p>Hi ${order.customer.name},</p>
          <p>Your order has been delivered successfully.</p>
          <p>Thank you for ordering with us!</p>
          <p>Please rate your experience with our delivery service.</p>
        </div>
      `,
    });

    // 📡 Emit socket event
    emitOrderStatusChange(orderId, {
      orderId: order._id,
      status: "delivered",
      deliveryPersonId,
      customerId: order.customer.email,
      deliveryTime: order.actualDeliveryTime,
      message: "Your order has been delivered",
    });

    return res.status(200).json({
      success: true,
      message: "Order delivered successfully",
      data: order,
    });
  } catch (error) {
    console.error("Deliver Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Cancel delivery (user cancelled order)
 */
export const cancelDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!["assigned_to_delivery", "picked_up", "out_for_delivery"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order in this status",
      });
    }

    // Update order
    order.status = "cancelled";
    order.timeline.push({
      event: "cancelled_by_user",
      changedBy: null,
      changedByRole: "user",
      timestamp: new Date(),
      notes: reason || "Cancelled by user",
      previousStatus: order.status,
    });
    await order.save();

    // Update delivery assignment
    await DeliveryAssignment.findOneAndUpdate(
      { orderId },
      {
        status: "cancelled",
      }
    );

    // Notify delivery person
    const deliveryPerson = await User.findById(order.deliveryPersonId);
    if (deliveryPerson) {
      await sendEmail({
        to: deliveryPerson.email,
        subject: `Order ${order.orderId} Cancelled by Customer`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Order Cancelled</h2>
            <p>Order <strong>${order.orderId}</strong> has been cancelled by the customer.</p>
            <p>Reason: ${reason || "Not specified"}</p>
          </div>
        `,
      });
    }

    // 📡 Emit socket event
    emitOrderStatusChange(orderId, {
      orderId: order._id,
      status: "cancelled",
      customerId: order.customer.email,
      message: "Your order has been cancelled",
    });

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Cancel Delivery Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get delivery dashboard
 */
export const getDeliveryDashboard = async (req, res) => {
  try {
    const deliveryPersonId = req.user._id;

    const deliveryPerson = await User.findById(deliveryPersonId).select(
      "name completedDeliveries deliveryRating deliveryZone"
    );

    const orders = await Order.find({ deliveryPersonId });

    const stats = {
      totalOrders: orders.length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      inTransit: orders.filter((o) => o.status === "out_for_delivery").length,
      pickedUp: orders.filter((o) => o.status === "picked_up").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      completedDeliveries: deliveryPerson.completedDeliveries,
      rating: deliveryPerson.deliveryRating,
    };

    // 📡 Emit socket event for real-time dashboard update
    emitDeliveryDashboardUpdate(deliveryPersonId, {
      deliveryPersonId,
      stats,
      inTransitCount: stats.inTransit,
      deliveredToday: stats.delivered,
      rating: stats.rating,
      completedDeliveries: stats.completedDeliveries,
    });

    return res.status(200).json({
      success: true,
      data: {
        deliveryPerson: {
          name: deliveryPerson.name,
          zone: deliveryPerson.deliveryZone,
          rating: deliveryPerson.deliveryRating,
          completedDeliveries: deliveryPerson.completedDeliveries,
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Get Delivery Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default {
  getAssignedOrders,
  getPendingPickups,
  pickupOrder,
  markInTransit,
  updateLocation,
  deliverOrder,
  cancelDelivery,
  getDeliveryDashboard,
};
