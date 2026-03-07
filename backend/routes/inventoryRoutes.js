import express from "express";
import {
  getInventory,
  updateStock,
  restockItem,
  getInventoryReport
} from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/inventory", getInventory);
router.get("/inventory/report", getInventoryReport);

router.patch("/inventory/:id/stock", updateStock);
router.post("/inventory/:id/restock", restockItem);

export default router;