// backend/routes/admin.js
import express from "express";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Protected admin route example
router.get("/orders", authAdmin, async (req, res) => {
  try {
    // Your admin logic here
    res.json({ message: "Admin orders data" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
