// backend/routes/kitchenRoutes.js
import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import { roleAuth } from "../middleware/roleAuth.js";
import {
  createKitchen,
  getAllKitchens,
  getKitchenById,
  updateKitchen,
  assignChefToKitchen,
  removeChefFromKitchen,
  getKitchenStatus,
  deleteKitchen,
} from "../controllers/kitchenController.js";

const router = express.Router();

// Get all kitchens (accessible to admin and chefs)
router.get("/", roleAuth("admin", "chef"), getAllKitchens);

// Get kitchen status (accessible to admin and chefs)
router.get("/:kitchenId/status", roleAuth("admin", "chef"), getKitchenStatus);

// Get specific kitchen (accessible to admin and chefs)
router.get("/:kitchenId", roleAuth("admin", "chef"), getKitchenById);

// All admin-only operations requiring authentication
router.use(authAdmin);

// Create kitchen
router.post("/", createKitchen);

// Update kitchen
router.patch("/:kitchenId", updateKitchen);

// Assign chef to kitchen
router.post("/:kitchenId/assign-chef", assignChefToKitchen);

// Remove chef from kitchen
router.delete("/:kitchenId/chefs/:chefId", removeChefFromKitchen);

// Delete kitchen
router.delete("/:kitchenId", deleteKitchen);

export default router;
