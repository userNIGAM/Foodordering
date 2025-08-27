import express from "express";
import {
  register,
  login,
  resendVerification,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/verify-email", verifyEmail); // Changed to POST with body
router.post("/login", login);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword); // Changed to POST with body
router.get("/me", protect, getCurrentUser);
router.post("/logout", logout);

export default router;
