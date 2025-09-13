// routes/orderRoutes.js
import express from "express";
import { getOrderStats, placeOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", placeOrder);
router.get("/stats", getOrderStats);

export default router;
