import express from "express";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
} from "../services/emailService.js";

const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    //validate if all the menu items exists
    for (const item of req.body.items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: `Menu item with ID ${item.menuItemId} not found`,
        });
      }
    }

    const order = new Order(req.body);
    const savedOrder = await order.save();

    // Populate the order with menu item details
    await savedOrder.populate("items.menuItemId");

    // Send confirmation email to customer
    await sendOrderConfirmationEmail(savedOrder);

    // Send notification email to admin
    await sendAdminNotificationEmail(savedOrder);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: savedOrder.orderId,
      data: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
});

// Get all orders (for admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// Update order status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

export default router;
