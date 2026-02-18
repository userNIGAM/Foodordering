import Order from "../models/Order.js";
import User from "../models/User.js";
import MenuItem from "../models/MenuItem.js";
import Inventory from "../models/Inventory.js";

export const getDashboardData = async (req, res) => {
  try {
    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get total revenue - calculate from items using correct MenuItem prices
    const allOrders = await Order.find().populate("items.menuItemId", "price");
    let totalRevenue = 0;
    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        const correctPrice = item.menuItemId?.price || item.price;
        totalRevenue += correctPrice * item.quantity;
      });
    });

    // Get new customers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      role: "user",
    });

    // Get conversion rate (placeholder)
    const conversionRate = 3.8;

    // Get recent orders using aggregation to ensure correct prices from MenuItem
    const recentOrders = await Order.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "menuitems",
          localField: "items.menuItemId",
          foreignField: "_id",
          as: "menuItems",
        },
      },
      {
        $addFields: {
          items: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                menuItemId: "$$item.menuItemId",
                name: "$$item.name",
                price: {
                  $let: {
                    vars: {
                      menuItem: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$menuItems",
                              as: "m",
                              cond: { $eq: ["$$m._id", "$$item.menuItemId"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      $cond: [
                        { $ne: ["$$menuItem", null] },
                        "$$menuItem.price",
                        "$$item.price",
                      ],
                    },
                  },
                },
                quantity: "$$item.quantity",
              },
            },
          },
        },
      },
      {
        $project: {
          orderId: 1,
          customer: 1,
          items: 1,
          status: 1,
          createdAt: 1,
        },
      },
    ]);

    // Get sales data for chart (last 7 days) - calculate from items
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get low stock items
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ["$currentStock", "$lowStockThreshold"] },
    })
      .populate("menuItemId", "name")
      .limit(5);

    // ✅ Send response only ONCE
    res.json({
      success: true,
      data: {
        stats: [
          {
            title: "Total Orders",
            value: totalOrders.toLocaleString(),
            change: "+12%",
            icon: "ShoppingCart",
            color: "bg-blue-50",
            iconColor: "text-blue-600",
            trend: "up",
          },
          {
            title: "Total Revenue",
            value: `Rs.${totalRevenue.toFixed(2)}`,
            change: "+8%",
            icon: "TrendingUp",
            color: "bg-green-50",
            iconColor: "text-green-600",
            trend: "up",
          },
          {
            title: "New Customers",
            value: newCustomers.toLocaleString(),
            change: "+5%",
            icon: "Users",
            color: "bg-purple-50",
            iconColor: "text-purple-600",
            trend: "up",
          },
          {
            title: "Conversion Rate",
            value: `${conversionRate}%`,
            change: "+2%",
            icon: "BarChart3",
            color: "bg-orange-50",
            iconColor: "text-orange-600",
            trend: "up",
          },
        ],

        // ✅ Safe mapping for recent orders - use correct prices from MenuItem
        recentOrders: recentOrders.map((order) => {
          // Recalculate total using correct prices from MenuItem
          const calculatedTotal = order.items.reduce(
            (sum, item) => {
              // Use the price from the populated MenuItem (correct price)
              // Fallback to stored price if menuItemId is not populated
              const correctPrice = item.menuItemId?.price || item.price;
              return sum + (correctPrice * item.quantity);
            },
            0
          );
          
          return {
            id: order.orderId,
            customer: order.customer?.name || "N/A",
            email: order.customer?.email || "N/A",
            amount: `Rs.${Number(calculatedTotal || 0).toFixed(2)}`,
            status: order.status || "pending",
            time: order.createdAt,
          };
        }),

        // ✅ Safe mapping for sales data
        salesData: salesData.map((item) => ({
          day: item._id
            ? new Date(item._id).toLocaleDateString("en-US", {
                weekday: "short",
              })
            : "N/A",
          sales: item.orderCount || 0,
        })),

        // ✅ Safe mapping for low stock alerts
        lowStockAlerts: lowStockItems.map((item) => ({
          name: item.menuItemId?.name || "Unknown Item",
          quantity: item.currentStock ?? 0,
          threshold: item.lowStockThreshold ?? 0,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
};

// Get all orders (for admin panel)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    // console.log("📦 Orders fetched from DB:", orders.length, "records");
    // console.log(JSON.stringify(orders, null, 2)); // optional, full detail

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, lowStockThreshold } = req.body;

    const inventory = await Inventory.findByIdAndUpdate(
      id,
      { quantity, lowStockThreshold, lastUpdated: new Date() },
      { new: true }
    ).populate("menuItemId", "name category");

    if (!inventory) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.json({ success: true, data: promotions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createPromotion = async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Promotion code already exists" });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!promotion) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, message: "Promotion deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getInventory = async (req, res) => {
  try {
    const { lowStockOnly, category } = req.query;

    let filter = {};

    if (lowStockOnly === "true") {
      filter = {
        $expr: { $lte: ["$currentStock", "$lowStockThreshold"] },
        isTracked: true,
      };
    }

    if (category && category !== "all") {
      // First get menu items in this category
      const menuItems = await MenuItem.find({ category });
      const menuItemIds = menuItems.map((item) => item._id);
      filter.menuItemId = { $in: menuItemIds };
    }

    const inventory = await Inventory.find(filter)
      .populate("menuItemId", "name category price image isAvailable")
      .sort({ currentStock: 1, "menuItemId.name": 1 });

    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentStock, lowStockThreshold, unit, costPerUnit, isTracked } =
      req.body;

    const inventory = await Inventory.findByIdAndUpdate(
      id,
      {
        currentStock,
        lowStockThreshold,
        unit,
        costPerUnit,
        isTracked,
        lastRestocked: currentStock > 0 ? new Date() : undefined,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("menuItemId", "name category");

    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const bulkUpdateInventory = async (req, res) => {
  try {
    const { updates } = req.body;

    const bulkOperations = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.id },
        update: {
          $set: {
            currentStock: update.currentStock,
            lowStockThreshold: update.lowStockThreshold,
            updatedAt: new Date(),
            ...(update.currentStock > 0 && { lastRestocked: new Date() }),
          },
        },
      },
    }));

    await Inventory.bulkWrite(bulkOperations);

    // Get updated inventory
    const updatedIds = updates.map((update) => update.id);
    const updatedInventory = await Inventory.find({
      _id: { $in: updatedIds },
    }).populate("menuItemId", "name category");

    res.json({ success: true, data: updatedInventory });
  } catch (error) {
    console.error("Error in bulk update:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, costPerUnit } = req.body;

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    inventory.currentStock += quantity;
    if (costPerUnit) {
      inventory.costPerUnit = costPerUnit;
    }
    inventory.lastRestocked = new Date();
    inventory.updatedAt = new Date();

    await inventory.save();
    await inventory.populate("menuItemId", "name category");

    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getInventoryReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.updatedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const report = await Inventory.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "menuitems",
          localField: "menuItemId",
          foreignField: "_id",
          as: "menuItem",
        },
      },
      { $unwind: "$menuItem" },
      {
        $group: {
          _id: "$menuItem.category",
          totalItems: { $sum: 1 },
          totalStockValue: {
            $sum: { $multiply: ["$currentStock", "$costPerUnit"] },
          },
          lowStockItems: {
            $sum: {
              $cond: [{ $lte: ["$currentStock", "$lowStockThreshold"] }, 1, 0],
            },
          },
          outOfStockItems: {
            $sum: {
              $cond: [{ $eq: ["$currentStock", 0] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get total inventory value
    const totalValue = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ["$currentStock", "$costPerUnit"] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        report,
        totalValue: totalValue[0]?.totalValue || 0,
      },
    });
  } catch (error) {
    console.error("Error generating inventory report:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
