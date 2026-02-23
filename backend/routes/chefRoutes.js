// backend/routes/chefRoutes.js
import express from "express";
import { authChef } from "../middleware/authChef.js";
import { chefCanUpdateOrder } from "../middleware/orderPermissions.js";
import {
  getAssignedOrders,
  confirmOrder,
  startPreparing,
  markAsPrepared,
  reportIssue,
  getChefDashboard,
} from "../controllers/chefController.js";

const router = express.Router();

// All chef routes require chef authentication
router.use(authChef);

// Get dashboard
router.get("/dashboard", getChefDashboard);

// Get assigned orders
router.get("/orders", getAssignedOrders);

// Confirm order
router.put("/order/:orderId/confirm", chefCanUpdateOrder, confirmOrder);

// Start preparing
router.put("/order/:orderId/start-preparing", chefCanUpdateOrder, startPreparing);

// Mark order as prepared
router.put("/order/:orderId/prepared", chefCanUpdateOrder, markAsPrepared);

// Report issue
router.put("/order/:orderId/issue", chefCanUpdateOrder, reportIssue);

export default router;
