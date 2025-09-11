// controllers/orderController.js
import Order from "../models/Order.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { updateInventoryOnOrder } from "../middleware/inventoryMiddleware.js";

export const placeOrder = async (req, res) => {
  try {
    const { customer, items, total, paymentMethod } = req.body;

    const sanitizedItems = items.map((item) => {
      let menuItemId;
      if (mongoose.Types.ObjectId.isValid(item.menuItemId)) {
        menuItemId = item.menuItemId;
      } else {
        // fallback for dummy/test items
        menuItemId = new mongoose.Types.ObjectId();
      }

      return {
        menuItemId,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
      };
    });

    const order = new Order({
      customer,
      items: sanitizedItems,
      total,
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
