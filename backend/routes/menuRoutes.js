// routes/menuRoutes.js
import express from "express";
import {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory,
  getCategories,
} from "../controllers/menuController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getMenuItems)
  .post(upload.single("image"), createMenuItem);

router.route("/categories/all").get(getCategories);

router.route("/category/:category").get(getMenuItemsByCategory);

router
  .route("/:id")
  .get(getMenuItem)
  .put(updateMenuItem)
  .delete(deleteMenuItem);

export default router;
