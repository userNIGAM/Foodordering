import express from "express";
import {
  rateProduct,
  getProductRatings,
} from "../controllers/ratingController.js";
import { protect } from "../middleware/auth.js"; // auth middleware if you have one

const router = express.Router();

router.post("/", protect, rateProduct); // submit rating
router.get("/:productId", getProductRatings); // fetch ratings for a product

export default router;
