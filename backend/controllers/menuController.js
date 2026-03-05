import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";


// GET all menu items with filters
export const getMenuItems = async (req, res) => {
  try {
    const { category, search, featured, limit } = req.query;

    let query = {};

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
        { tags: { $elemMatch: { $regex: search, $options: "i" } } }
      ];
    }

    let menuQuery = MenuItem.find(query).sort({ createdAt: -1 });

    if (limit) {
      menuQuery = menuQuery.limit(parseInt(limit));
    }

    const menuItems = await menuQuery;

    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// GET single menu item
export const getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    res.json({ success: true, data: item });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// CREATE menu item
export const createMenuItem = async (req, res) => {
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
      tags
    } = req.body;

    if (!name || !category || !price || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });
    }

    // Validate category
    const categoryExists = await Category.findOne({ name: category });

    if (!categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category name" });
    }

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
      image: imagePath
    });

    res.status(201).json({
      success: true,
      data: menuItem
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// UPDATE menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { category } = req.body;

    if (category) {
      const exists = await Category.findOne({ name: category });

      if (!exists) {
        return res
          .status(400)
          .json({ success: false, message: "Category does not exist" });
      }
    }

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    res.json({
      success: true,
      data: item
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    res.json({
      success: true,
      message: "Menu item deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET items by category
export const getMenuItemsByCategory = async (req, res) => {
  try {
    const items = await MenuItem.find({ category: req.params.category });

    res.json({
      success: true,
      count: items.length,
      data: items
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};