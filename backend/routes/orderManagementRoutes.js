// backend/routes/orderManagementRoutes.js
import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import { roleAuth } from "../middleware/roleAuth.js";
import { adminCanManageOrder } from "../middleware/orderPermissions.js";
import {
  getPendingOrders,
  verifyOrder,
  rejectOrder,
  assignToKitchen,
  assignDeliveryPerson,
  getOrderDetail,
  getAllOrders,
} from "../controllers/orderManagementController.js";

const router = express.Router();

// Get order details (accessible to authenticated users)
router.get("/:orderId", getOrderDetail);

// Admin-only routes
router.use(authAdmin);

// Get pending orders (awaiting verification)
router.get("/pending", getPendingOrders);

// Get all orders with filters
router.get("/", getAllOrders);

// Verify order
router.post("/:orderId/verify", adminCanManageOrder, verifyOrder);

// Reject order
router.post("/:orderId/reject", adminCanManageOrder, rejectOrder);

// Assign to kitchen
router.post("/:orderId/assign-kitchen", adminCanManageOrder, assignToKitchen);

// Assign delivery person
router.post("/:orderId/assign-delivery", adminCanManageOrder, assignDeliveryPerson);

export default router;
