// backend/routes/deliveryRoutes.js
import express from "express";
import { authDelivery } from "../middleware/authDelivery.js";
import { deliveryCanUpdateOrder } from "../middleware/orderPermissions.js";
import {
  getAssignedOrders,
  getPendingPickups,
  pickupOrder,
  markInTransit,
  updateLocation,
  deliverOrder,
  cancelDelivery,
  getDeliveryDashboard,
} from "../controllers/deliveryController.js";

const router = express.Router();

// All delivery routes require delivery person authentication
router.use(authDelivery);

// Get dashboard
router.get("/dashboard", getDeliveryDashboard);

// Get assigned orders
router.get("/orders", getAssignedOrders);

// Get pending pickups
router.get("/pickups/pending", getPendingPickups);

// Pickup order
router.put("/order/:orderId/pickup", deliveryCanUpdateOrder, pickupOrder);

// Mark as in transit
router.put("/order/:orderId/in-transit", deliveryCanUpdateOrder, markInTransit);

// Update location during transit
router.put("/order/:orderId/location", updateLocation);

// Deliver order
router.put("/order/:orderId/deliver", deliveryCanUpdateOrder, deliverOrder);

// Cancel delivery
router.put("/order/:orderId/cancel", cancelDelivery);

export default router;
