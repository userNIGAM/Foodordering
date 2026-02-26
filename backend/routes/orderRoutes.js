// routes/orderRoutes.js
import express from "express";
import { getOrderStats, placeOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/stats", getOrderStats);

export default router;
