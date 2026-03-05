import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory,
  getCategories
} from "../controllers/menuController.js";

const router = express.Router();


// CREATE + GET ALL
router
  .route("/")
  .get(getMenuItems)
  .post(upload.single("image"), createMenuItem);


// GET ALL CATEGORIES
router.get("/categories/all", getCategories);


// GET MENU ITEMS BY CATEGORY
router.get("/category/:category", getMenuItemsByCategory);


// SINGLE MENU ITEM CRUD
router
  .route("/:id")
  .get(getMenuItem)
  .put(upload.single("image"), updateMenuItem)
  .delete(deleteMenuItem);

export default router;