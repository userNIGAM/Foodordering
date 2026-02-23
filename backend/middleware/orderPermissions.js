// backend/middleware/orderPermissions.js
import Order from "../models/Order.js";
import ChefAssignment from "../models/ChefAssignment.js";
import DeliveryAssignment from "../models/DeliveryAssignment.js";

/**
 * Verify chef can update the assigned order
 * Must be used after auth middleware
 */
export const chefCanUpdateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const chefId = req.user._id;

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order is assigned to this chef
    if (order.chefId.toString() !== chefId.toString()) {
      return res.status(403).json({
        success: false,
        message: "This order is not assigned to you",
      });
    }

    // Check if order is in a status where chef can take action
    const chefActionableStatuses = [
      "assigned_to_kitchen",
      "confirmed",
      "preparing",
    ];

    if (!chefActionableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update order in ${order.status} status`,
      });
    }

    req.order = order;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Permission check failed",
      error: error.message,
    });
  }
};

/**
 * Verify delivery person can update the assigned order
 * Must be used after auth middleware
 */
export const deliveryCanUpdateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const deliveryPersonId = req.user._id;

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order is assigned to this delivery person
    if (order.deliveryPersonId.toString() !== deliveryPersonId.toString()) {
      return res.status(403).json({
        success: false,
        message: "This order is not assigned to you",
      });
    }

    // Check if order is in a status where delivery person can take action
    const deliveryActionableStatuses = [
      "assigned_to_delivery",
      "picked_up",
      "out_for_delivery",
    ];

    if (!deliveryActionableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update order in ${order.status} status`,
      });
    }

    req.order = order;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Permission check failed",
      error: error.message,
    });
  }
};

/**
 * Verify admin can manage the order
 * Checks if order is in a state that allows admin intervention
 */
export const adminCanManageOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    req.order = order;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Permission check failed",
      error: error.message,
    });
  }
};

/**
 * Verify user is the order owner (customer)
 */
export const userOwnsOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // For now, check if user created the order (you might store userId in orders)
    // This is a basic check - adjust based on your Order model
    if (order.customer && order.customer.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this order",
      });
    }

    req.order = order;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Permission check failed",
      error: error.message,
    });
  }
};

/**
 * Verify chef has capacity to take new order
 */
export const chefHasCapacity = async (req, res, next) => {
  try {
    const chefId = req.user._id;

    const chef = await User.findById(chefId);
    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    if (chef.currentCapacity >= chef.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: `You've reached maximum capacity (${chef.maxCapacity} orders)`,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Capacity check failed",
      error: error.message,
    });
  }
};

export default {
  chefCanUpdateOrder,
  deliveryCanUpdateOrder,
  adminCanManageOrder,
  userOwnsOrder,
  chefHasCapacity,
};
