import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  updateUserStatus
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", protect, getUserProfile);
router.put("/update", protect, upload.single("avatar"), updateUserProfile);
router.put("/status/:userId", updateUserStatus);


export default router;
