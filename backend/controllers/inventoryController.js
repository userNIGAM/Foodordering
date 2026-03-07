import Inventory from "../models/Inventory.js";
import MenuItem from "../models/MenuItem.js";

/*
GET INVENTORY
/api/admin/inventory
*/
export const getInventory = async (req, res) => {
  try {
    const { lowStockOnly, category, search } = req.query;

    // fetch inventory + populate menu item
    const inventory = await Inventory.find()
      .populate("menuItemId", "name category image")
      .lean();

    let filtered = inventory;

    // filter by category
    if (category && category !== "all") {
      filtered = filtered.filter(
        (item) => item.menuItemId?.category === category
      );
    }

    // search by name
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((item) =>
        item.menuItemId?.name?.toLowerCase().includes(s)
      );
    }

    // low stock filter
    if (lowStockOnly === "true") {
      filtered = filtered.filter(
        (item) => item.currentStock <= item.lowStockThreshold
      );
    }

    // map menuItemId -> menuItem (for frontend compatibility)
    const formatted = filtered.map((item) => ({
      ...item,
      menuItem: item.menuItemId
    }));

    res.json({
      success: true,
      data: formatted
    });

  } catch (error) {
    console.error("Inventory fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory"
    });
  }
};



/*
UPDATE STOCK
PATCH /api/admin/inventory/:id/stock
*/
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentStock } = req.body;

    const updated = await Inventory.findByIdAndUpdate(
      id,
      { currentStock },
      { new: true }
    ).populate("menuItemId", "name category image");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found"
      });
    }

    res.json({
      success: true,
      data: {
        ...updated.toObject(),
        menuItem: updated.menuItemId
      }
    });

  } catch (error) {
    console.error("Stock update error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update stock"
    });
  }
};



/*
RESTOCK ITEM
POST /api/admin/inventory/:id/restock
*/
export const restockItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await Inventory.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found"
      });
    }

    item.currentStock += Number(quantity);

    await item.save();

    const populated = await item.populate(
      "menuItemId",
      "name category image"
    );

    res.json({
      success: true,
      data: {
        ...populated.toObject(),
        menuItem: populated.menuItemId
      }
    });

  } catch (error) {
    console.error("Restock error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to restock item"
    });
  }
};



/*
INVENTORY REPORT
GET /api/admin/inventory/report
*/
export const getInventoryReport = async (req, res) => {
  try {

    const items = await Inventory.find().lean();

    const totalItems = items.length;

    const totalStockValue = items.reduce(
      (sum, item) => sum + item.currentStock * item.costPerUnit,
      0
    );

    const lowStockItems = items.filter(
      (item) => item.currentStock <= item.lowStockThreshold
    );

    res.json({
      success: true,
      data: {
        totalItems,
        totalStockValue,
        lowStockCount: lowStockItems.length
      }
    });

  } catch (error) {
    console.error("Inventory report error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate report"
    });
  }
};