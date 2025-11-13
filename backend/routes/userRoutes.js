import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", protect, getUserProfile);
router.put("/update", protect, upload.single("avatar"), updateUserProfile);

export default router;
