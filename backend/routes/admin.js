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
  createStaff,
  getAllUsers,
  deleteUser,
  toggleBlockUser
} from "../controllers/adminController.js";
import { get } from "mongoose";

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

// Staff
router.post("/staff", authAdmin, createStaff);

//get all users
router.get("/users", authAdmin, getAllUsers);

// Delete a user by ID
router.delete("/users/:id", authAdmin, deleteUser);

// Block or unblock a user
router.patch("/users/:id/block", authAdmin, toggleBlockUser);
export default router;
