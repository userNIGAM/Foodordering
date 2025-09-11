// backend/routes/admin.js
import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import {
  getDashboardData,
  getAllOrders,
  updateOrderStatus,
  getCustomers,
  getInventory,
  updateInventory,
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  bulkUpdateInventory,
  addStock,
  getInventoryReport,
} from "../controllers/adminController.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", authAdmin, getDashboardData);

// Orders
router.get("/orders", authAdmin, getAllOrders);
router.put("/orders/:id", authAdmin, updateOrderStatus);

// Customers
router.get("/customers", authAdmin, getCustomers);

// Inventory
router.get("/inventory", authAdmin, getInventory);
router.put("/inventory/:id", authAdmin, updateInventory);
router.patch("/inventory/bulk", authAdmin, bulkUpdateInventory);
router.post("/inventory/:id/restock", authAdmin, addStock);
router.get("/inventory/report", authAdmin, getInventoryReport);

// Promotions
router.get("/promotions", authAdmin, getPromotions);
router.post("/promotions", authAdmin, createPromotion);
router.put("/promotions/:id", authAdmin, updatePromotion);
router.delete("/promotions/:id", authAdmin, deletePromotion);

export default router;
