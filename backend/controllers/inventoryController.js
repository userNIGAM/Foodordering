import Inventory from "../models/Inventory.js";
import MenuItem from "../models/MenuItem.js";

// @desc    Get all inventory items (with optional filters)
// @route   GET /api/admin/inventory
// @access  Private/Admin
export const getInventory = async (req, res) => {
  try {
    const { lowStockOnly, category, search } = req.query;
    let query = {};

    // Filter by low stock
    if (lowStockOnly === "true") {
      query.$expr = { $lte: ["$currentStock", "$lowStockThreshold"] };
    }

    // Build aggregation pipeline to handle filtering by category and search
    const pipeline = [
      {
        $lookup: {
          from: "menuitems",
          localField: "menuItemId",
          foreignField: "_id",
          as: "menuItem",
        },
      },
      { $unwind: "$menuItem" },
    ];

    // Apply category filter (must be after lookup)
    if (category && category !== "all") {
      pipeline.push({ $match: { "menuItem.category": category } });
    }

    // Apply search filter on menu item name
    if (search) {
      pipeline.push({
        $match: {
          "menuItem.name": { $regex: search, $options: "i" },
        },
      });
    }

    // Apply low stock filter (using $expr inside $match)
    if (lowStockOnly === "true") {
      pipeline.push({
        $match: {
          $expr: { $lte: ["$currentStock", "$lowStockThreshold"] },
        },
      });
    }

    const inventory = await Inventory.aggregate(pipeline);

    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get a single inventory item by ID
// @route   GET /api/admin/inventory/:id
// @access  Private/Admin
export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate(
      "menuItemId"
    );
    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }
    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Create a new inventory record for a menu item
// @route   POST /api/admin/inventory
// @access  Private/Admin
export const createInventory = async (req, res) => {
  try {
    const { menuItemId, currentStock, lowStockThreshold, unit, costPerUnit } =
      req.body;

    // Check if menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    // Check if inventory already exists for this menu item
    const existing = await Inventory.findOne({ menuItemId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Inventory already exists for this menu item",
      });
    }

    const inventory = new Inventory({
      menuItemId,
      currentStock: currentStock || 0,
      lowStockThreshold: lowStockThreshold || 10,
      unit: unit || "units",
      costPerUnit: costPerUnit || 0,
    });

    await inventory.save();
    await inventory.populate("menuItemId");

    res.status(201).json({ success: true, data: inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update an inventory item (full update)
// @route   PUT /api/admin/inventory/:id
// @access  Private/Admin
export const updateInventory = async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: Date.now() };
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate("menuItemId");

    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update stock only (used by manual stock update)
// @route   PATCH /api/admin/inventory/:id/stock
// @access  Private/Admin
export const updateStock = async (req, res) => {
  try {
    const { currentStock } = req.body;
    if (currentStock === undefined || currentStock < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Valid stock value required" });
    }

    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { currentStock, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate("menuItemId");

    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Restock (add quantity to current stock)
// @route   POST /api/admin/inventory/:id/restock
// @access  Private/Admin
export const restockInventory = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Valid quantity required" });
    }

    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    inventory.currentStock += parseInt(quantity);
    inventory.lastRestocked = Date.now();
    inventory.updatedAt = Date.now();
    await inventory.save();
    await inventory.populate("menuItemId");

    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete an inventory record
// @route   DELETE /api/admin/inventory/:id
// @access  Private/Admin
export const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }
    res.json({ success: true, message: "Inventory deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get inventory report (total value, low stock count, out of stock count)
// @route   GET /api/admin/inventory/report
// @access  Private/Admin
export const getInventoryReport = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("menuItemId");

    let totalValue = 0;
    let lowStockItems = 0;
    let outOfStockItems = 0;

    inventory.forEach((item) => {
      const value = item.currentStock * (item.costPerUnit || 0);
      totalValue += value;

      if (item.currentStock === 0) {
        outOfStockItems++;
      } else if (item.currentStock <= item.lowStockThreshold) {
        lowStockItems++;
      }
    });

    // Optionally group by category
    const reportByCategory = {};
    inventory.forEach((item) => {
      const category = item.menuItemId?.category || "Uncategorized";
      if (!reportByCategory[category]) {
        reportByCategory[category] = {
          totalValue: 0,
          lowStockItems: 0,
          outOfStockItems: 0,
        };
      }
      reportByCategory[category].totalValue +=
        item.currentStock * (item.costPerUnit || 0);
      if (item.currentStock === 0) {
        reportByCategory[category].outOfStockItems++;
      } else if (item.currentStock <= item.lowStockThreshold) {
        reportByCategory[category].lowStockItems++;
      }
    });

    const report = Object.keys(reportByCategory).map((cat) => ({
      category: cat,
      ...reportByCategory[cat],
    }));

    res.json({
      success: true,
      data: {
        totalValue,
        lowStockItems,
        outOfStockItems,
        report, // category breakdown
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};