// backend/routes/roleManagementRoutes.js
import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import {
  getPendingChefs,
  getPendingDeliveryPersons,
  approveChef,
  rejectChef,
  approveDeliveryPerson,
  rejectDeliveryPerson,
  getApprovedChefs,
  getApprovedDeliveryPersons,
  updateChefStatus,
  updateDeliveryStatus,
} from "../controllers/roleManagementController.js";

const router = express.Router();

// All routes require admin authentication
router.use(authAdmin);

// Chef Management Routes
router.get("/chefs/pending", getPendingChefs);
router.get("/chefs/approved", getApprovedChefs);
router.post("/chefs/:chefId/approve", approveChef);
router.post("/chefs/:chefId/reject", rejectChef);
router.patch("/chefs/:chefId/status", updateChefStatus);

// Delivery Person Management Routes
router.get("/delivery/pending", getPendingDeliveryPersons);
router.get("/delivery/approved", getApprovedDeliveryPersons);
router.post("/delivery/:deliveryId/approve", approveDeliveryPerson);
router.post("/delivery/:deliveryId/reject", rejectDeliveryPerson);
router.patch("/delivery/:deliveryId/status", updateDeliveryStatus);

export default router;
