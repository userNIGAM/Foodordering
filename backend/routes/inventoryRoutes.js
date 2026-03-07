import express from "express";
import {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  updateStock,
  restockInventory,
  deleteInventory,
  getInventoryReport,
} from "../controllers/inventoryController.js";
// import {admin } from "../middleware/auth.js"; // adjust based on your auth

const router = express.Router();

// All routes are protected and admin only


router.route("/").get(getInventory).post(createInventory);
router.get("/report", getInventoryReport);
router
  .route("/:id")
  .get(getInventoryById)
  .put(updateInventory)
  .delete(deleteInventory);
router.patch("/:id/stock", updateStock);
router.post("/:id/restock", restockInventory);

export default router;