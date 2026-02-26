import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  updateUserStatus
} from "../controllers/userController.js";
import { getUserOrders } from "../controllers/orderController.js";
import upload from "../middleware/multer.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", protect, getUserProfile);
router.get("/orders", protect, getUserOrders);
router.put("/update", protect, upload.single("avatar"), updateUserProfile);
router.put("/status/:userId", updateUserStatus);


export default router;
