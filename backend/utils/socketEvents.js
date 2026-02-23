// backend/utils/socketEvents.js
import {
  notifyUser,
  notifyAdmins,
  notifyKitchen,
  notifyCustomer,
  notifyDelivery,
  getIO,
} from "../socket.js";

/**
 * Emit order status change to all relevant parties
 */
export const emitOrderStatusChange = (orderId, orderData) => {
  const io = getIO();

  // Emit to admin
  notifyAdmins("order:status_changed", {
    orderId,
    ...orderData,
    timestamp: new Date(),
  });

  // Emit to customer
  if (orderData.customerId) {
    notifyCustomer(orderData.customerId, "order:status_changed", {
      orderId,
      status: orderData.status,
      message: getStatusMessage(orderData.status),
      estimatedTime: orderData.estimatedTime,
      timestamp: new Date(),
    });
  }

  // Emit to chef
  if (orderData.chefId) {
    notifyUser(orderData.chefId, "order:status_changed", {
      orderId,
      status: orderData.status,
      ...orderData,
    });
  }

  // Emit to delivery person
  if (orderData.deliveryPersonId) {
    notifyDelivery(orderData.deliveryPersonId, "order:status_changed", {
      orderId,
      status: orderData.status,
      ...orderData,
    });
  }

  // Emit to kitchen
  if (orderData.kitchenId) {
    notifyKitchen(orderData.kitchenId, "order:status_changed", {
      orderId,
      status: orderData.status,
      ...orderData,
    });
  }
};

/**
 * Emit order assignment to chef
 */
export const emitOrderAssignedToChef = (orderId, chefId, orderData) => {
  const io = getIO();

  // Notify the specific chef
  notifyUser(chefId, "order:assigned", {
    orderId,
    orderData,
    message: "New order assigned to you",
    timestamp: new Date(),
  });

  // Notify kitchen
  if (orderData.kitchenId) {
    notifyKitchen(orderData.kitchenId, "order:assigned", {
      orderId,
      chefId,
      orderData,
    });
  }

  // Notify admins
  notifyAdmins("order:assigned", {
    orderId,
    chefId,
    orderData,
  });
};

/**
 * Emit order assignment to delivery person
 */
export const emitOrderAssignedToDelivery = (orderId, deliveryPersonId, orderData) => {
  // Notify the specific delivery person
  notifyDelivery(deliveryPersonId, "order:assigned", {
    orderId,
    orderData,
    message: "New delivery assigned to you",
    timestamp: new Date(),
  });

  // Notify admins
  notifyAdmins("order:assigned", {
    orderId,
    deliveryPersonId,
    orderData,
  });

  // Notify customer
  if (orderData.customerId) {
    notifyCustomer(orderData.customerId, "order:assigned_to_delivery", {
      orderId,
      deliveryPersonName: orderData.deliveryPersonName,
      message: "Your order has been assigned for delivery",
    });
  }
};

/**
 * Emit issue reported
 */
export const emitIssueReported = (orderId, issueData) => {
  // Notify admins immediately
  notifyAdmins("order:issue_reported", {
    orderId,
    severity: issueData.severity,
    description: issueData.description,
    reportedBy: issueData.reportedBy,
    reportedAt: new Date(),
  });

  // Notify customer
  if (issueData.customerId) {
    notifyCustomer(issueData.customerId, "order:issue_reported", {
      orderId,
      message: "There's a small issue with your order. Admin will contact you soon.",
    });
  }
};

/**
 * Emit kitchen status update
 */
export const emitKitchenStatusUpdate = (kitchenId, statusData) => {
  notifyKitchen(kitchenId, "kitchen:status_updated", {
    kitchenId,
    ...statusData,
    timestamp: new Date(),
  });

  notifyAdmins("kitchen:status_updated", {
    kitchenId,
    ...statusData,
  });
};

/**
 * Emit delivery location update
 */
export const emitDeliveryLocationUpdate = (orderId, customerId, locationData) => {
  // Update customer's map in real-time
  if (customerId) {
    notifyCustomer(customerId, "delivery:location_update", {
      orderId,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      address: locationData.address,
      timestamp: new Date(),
    });
  }

  // Notify admins
  notifyAdmins("delivery:location_update", {
    orderId,
    ...locationData,
    timestamp: new Date(),
  });
};

/**
 * Emit chef dashboard update
 */
export const emitChefDashboardUpdate = (chefId, dashboardData) => {
  notifyUser(chefId, "chef:dashboard_update", {
    ...dashboardData,
    timestamp: new Date(),
  });
};

/**
 * Emit delivery dashboard update
 */
export const emitDeliveryDashboardUpdate = (deliveryPersonId, dashboardData) => {
  notifyDelivery(deliveryPersonId, "delivery:dashboard_update", {
    ...dashboardData,
    timestamp: new Date(),
  });
};

/**
 * Emit admin dashboard update
 */
export const emitAdminDashboardUpdate = (dashboardData) => {
  notifyAdmins("admin:dashboard_update", {
    ...dashboardData,
    timestamp: new Date(),
  });
};

/**
 * Emit user online/offline status
 */
export const emitUserStatusChange = (userId, role, status) => {
  if (role === "chef" || role === "delivery_person") {
    notifyAdmins("user:status_changed", {
      userId,
      role,
      status,
      timestamp: new Date(),
    });
  }
};

/**
 * Emit notification to specific user
 */
export const sendNotification = (userId, notificationData) => {
  notifyUser(userId, "notification:received", {
    ...notificationData,
    timestamp: new Date(),
  });
};

/**
 * Get human-readable status message
 */
export const getStatusMessage = (status) => {
  const messages = {
    pending: "Your order has been placed",
    verified: "Order verified by our team",
    assigned_to_kitchen: "Order sent to kitchen",
    confirmed: "Chef is preparing your order",
    preparing: "Your order is being prepared",
    prepared: "Order is ready for delivery",
    assigned_to_delivery: "Delivery person has been assigned",
    picked_up: "Your order has been picked up",
    out_for_delivery: "Your order is on the way",
    delivered: "Your order has been delivered",
    cancelled: "Your order has been cancelled",
    issue: "There's an issue with your order",
  };

  return messages[status] || "Your order status has been updated";
};

/**
 * Broadcast kitchen queue display
 */
export const broadcastKitchenQueue = (kitchenId, queueData) => {
  const io = getIO();
  io.to(`kitchen:${kitchenId}`).emit("kitchen:queue_update", {
    kitchenId,
    queue: queueData,
    timestamp: new Date(),
  });
};

/**
 * Broadcast to order room with timeline update
 */
export const emitOrderTimelineUpdate = (orderId, timelineEvent) => {
  const io = getIO();
  io.to(`order:${orderId}`).emit("order:timeline_update", {
    orderId,
    event: timelineEvent,
    timestamp: new Date(),
  });
};

export default {
  emitOrderStatusChange,
  emitOrderAssignedToChef,
  emitOrderAssignedToDelivery,
  emitIssueReported,
  emitKitchenStatusUpdate,
  emitDeliveryLocationUpdate,
  emitChefDashboardUpdate,
  emitDeliveryDashboardUpdate,
  emitAdminDashboardUpdate,
  emitUserStatusChange,
  sendNotification,
  getStatusMessage,
  broadcastKitchenQueue,
  emitOrderTimelineUpdate,
};
