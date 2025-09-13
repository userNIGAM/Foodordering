// controllers/menuController.js
import MenuItem from "../models/MenuItem.js";

// @desc    Get all menu items
// @route   GET /api/menu-items
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const { category, search, featured, limit } = req.query;

    let query = {};
    // console.log("Query params:", req.query);
    // console.log("Mongo query object:", query);
    if (category && category !== "all") {
      query.category = category;
    }

    if (featured) {
      query.isPopular = featured === "true";
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } }, // 👈 fixed for array
      ];
    }

    let menuItemsQuery = MenuItem.find(query);

    if (limit) {
      menuItemsQuery = menuItemsQuery.limit(parseInt(limit));
    }

    const menuItems = await menuItemsQuery.sort({ createdAt: -1 });

    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error("Error in getMenuItems:", error); // 👈 full error trace
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu-items/:id
// @access  Public
const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu-items
// @access  Private/Admin
// @desc    Create new menu item with image
// @route   POST /api/menu-items
// @access  Private/Admin
const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
      calories,
      prepTime,
      rating,
      isPopular,
      ingredients,
      tags,
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const menuItem = await MenuItem.create({
      name,
      category,
      price,
      description,
      calories,
      prepTime,
      rating,
      isPopular,
      ingredients: ingredients ? ingredients.split(",") : [],
      tags: tags ? tags.split(",") : [],
      image: imagePath,
    });

    res.status(201).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error("Error in createMenuItem:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu-items/:id
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu-items/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get menu items by category
// @route   GET /api/menu-items/category/:category
// @access  Public
const getMenuItemsByCategory = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ category: req.params.category });

    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get all categories
// @route   GET /api/menu-items/categories/all
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await MenuItem.distinct("category");

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory,
  getCategories,
};
