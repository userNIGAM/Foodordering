import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";

// CREATE menu item
export const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      prepTime,
      calories,
      description,
      ingredients,
      tags,
      isPopular,
      image,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !category ||
      !price ||
      !prepTime ||
      !calories ||
      !description ||
      !image
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields." });
    }

    // Check category exists
    const categoryExists = await Category.findOne({ name: category });
    if (!categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category name." });
    }

    const newItem = new MenuItem({
      name,
      category,
      price,
      prepTime,
      calories,
      description,
      ingredients,
      tags,
      isPopular,
      image,
    });

    await newItem.save();
    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: newItem,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
//GET all menu items by id
export const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { category } = req.body;
    if (category) {
      const exists = await Category.findOne({ name: category });
      if (!exists)
        return res
          .status(400)
          .json({ success: false, message: "Category does not exist" });
    }

    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });

    res.json({ success: true, message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
