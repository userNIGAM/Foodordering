// controllers/orderController.js
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { updateInventoryOnOrder } from "../middleware/inventoryMiddleware.js";

export const placeOrder = async (req, res) => {
  try {
    const { customer, items, total, paymentMethod } = req.body;

    // Fetch actual menu items to get correct prices from database
    const sanitizedItems = await Promise.all(
      items.map(async (item) => {
        let menuItemId;
        if (mongoose.Types.ObjectId.isValid(item.menuItemId)) {
          menuItemId = item.menuItemId;
        } else {
          menuItemId = new mongoose.Types.ObjectId();
        }

        // Get the actual menu item from database to ensure correct price
        const menuItem = await MenuItem.findById(menuItemId);
        const actualPrice = menuItem ? menuItem.price : Number(item.price);

        return {
          menuItemId,
          name: item.name,
          price: actualPrice,
          quantity: Number(item.quantity),
        };
      })
    );

    // Recalculate total from actual prices
    const calculatedTotal = sanitizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      customer,
      items: sanitizedItems,
      total: calculatedTotal,
      paymentMethod: paymentMethod || "cod",
      status: "pending",
    });

    await order.save();

    // Update inventory based on ordered items
    await updateInventoryOnOrder(order);

    // Respond first
    res.status(201).json({ success: true, orderId: order.orderId });

    // Send emails asynchronously
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to user
    await transporter.sendMail({
      from: `"Food Ordering" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: "Order Confirmed - Cash on Delivery",
      text: `Hi ${customer.name}, your order has been received! Keep your money ready. Total: ₹${total}`,
    });

    // Email to admin
    await transporter.sendMail({
      from: `"Food Ordering" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Incoming Order",
      text: `New order from ${customer.name}, Total: ₹${total}`,
    });
  } catch (err) {
    console.error("Order Error:", err);
    // res.status(500).json({ success: false, message: "Order failed" });
  }
};
// ✅ Get stats
export const getOrderStats = async (req, res) => {
  try {
    // Total meals delivered (count of delivered orders)
    const totalDelivered = await Order.countDocuments({ status: "delivered" });

    // Active riders (dummy placeholder — you may link with Rider model later)
    const activeRiders = 20; // Example fixed number, replace with Rider.countDocuments() if you have riders

    // Average rating (if you store ratings in Order or another model)
    const customerRating = "4.9/5"; // Placeholder until ratings implemented

    res.json({
      success: true,
      stats: {
        mealsDelivered: totalDelivered,
        activeRiders,
        customerRating,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};
