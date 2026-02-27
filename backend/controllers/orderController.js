// controllers/orderController.js
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import User from "../models/User.js";
import Kitchen from "../models/Kitchen.js";
import ChefAssignment from "../models/ChefAssignment.js";
import OrderTimeline from "../models/OrderTimeline.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { updateInventoryOnOrder } from "../middleware/inventoryMiddleware.js";
import { protect } from "../middleware/auth.js";
import { emitOrderAssignedToChef } from "../utils/socketEvents.js";

/**
 * Find an available chef with lowest current capacity
 */
const findAvailableChef = async () => {
  try {
    // Get all chefs
    const chefs = await User.find({ role: "chef" }).sort({ currentCapacity: 1 });
    
    if (chefs.length === 0) {
      console.log("No chefs available");
      return null;
    }

    // Find first chef with available capacity
    for (const chef of chefs) {
      if (chef.currentCapacity < chef.maxCapacity) {
        return chef;
      }
    }

    // If all chefs at capacity, return the one with lowest capacity
    return chefs[0];
  } catch (error) {
    console.error("Error finding available chef:", error);
    return null;
  }
};

/**
 * Auto-assign order to an available kitchen
 */
const getDefaultKitchen = async () => {
  try {
    const kitchen = await Kitchen.findOne({ operatingHours: { isOpen: true } });
    return kitchen || (await Kitchen.findOne());
  } catch (error) {
    console.error("Error getting kitchen:", error);
    return null;
  }
};

/**
 * Send email using nodemailer
 */
const sendOrderEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Food Ordering" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { customer, items, total, paymentMethod } = req.body;
    const userId = req.user?.id || req.user?._id || null;

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
      userId,
      customer,
      items: sanitizedItems,
      total: calculatedTotal,
      paymentMethod: paymentMethod || "cod",
      status: "pending",
    });

    await order.save();

    // Update inventory based on ordered items
    await updateInventoryOnOrder(order);

    // Auto-verify order
    order.status = "verified";
    order.verificationStatus = "verified";
    order.estimatedPrepTime = 30;
    order.timeline.push({
      event: "order_verified",
      changedByRole: "system",
      timestamp: new Date(),
      notes: "Order verified automatically",
      previousStatus: "pending",
    });

    // Auto-assign to available chef
    const availableChef = await findAvailableChef();
    const kitchen = await getDefaultKitchen();

    if (availableChef && kitchen) {
      order.status = "assigned_to_kitchen";
      order.chefId = availableChef._id;
      order.kitchenId = kitchen._id;
      order.timeline.push({
        event: "assigned_to_kitchen",
        changedByRole: "system",
        timestamp: new Date(),
        notes: `Auto-assigned to Chef ${availableChef.name}`,
        previousStatus: "verified",
      });

      await order.save();

      // Create chef assignment
      await ChefAssignment.create({
        orderId: order._id,
        chefId: availableChef._id,
        kitchenId: kitchen._id,
        assignedBy: "system",
        estimatedPrepTime: 30,
      });

      // Create timeline record
      await OrderTimeline.create({
        orderId: order._id,
        events: [
          {
            event: "order_created",
            status: "pending",
            timestamp: order.createdAt,
          },
          {
            event: "order_verified",
            status: "verified",
            timestamp: new Date(),
            notes: "Order verified automatically",
          },
          {
            event: "assigned_to_kitchen",
            status: "assigned_to_kitchen",
            changedBy: {
              name: "System",
              role: "system",
            },
            timestamp: new Date(),
            metadata: {
              chefId: availableChef._id,
              kitchenId: kitchen._id,
            },
          },
        ],
      });

      // Send notification to chef
      await sendOrderEmail(
        availableChef.email,
        `New Order Assigned - ${order.orderId}`,
        `
          <div style="font-family: Arial, sans-serif;">
            <h2>New Order Assigned</h2>
            <p>Hi ${availableChef.name},</p>
            <p>New order <strong>${order.orderId}</strong> has been assigned to you.</p>
            <p><strong>Customer:</strong> ${customer.name}</p>
            <p><strong>Items:</strong> ${order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}</p>
            <p><strong>Total:</strong> ₹${calculatedTotal.toFixed(2)}</p>
            <p><strong>Estimated Prep Time:</strong> 30 minutes</p>
            <p>Please confirm the order in your kitchen dashboard.</p>
          </div>
        `
      );

      // Emit socket event to notify chef
      try {
        emitOrderAssignedToChef(order._id, availableChef._id, {
          orderId: order._id,
          chefId: availableChef._id,
          chefName: availableChef.name,
          kitchenId: kitchen._id,
          items: order.items,
          estimatedPrepTime: 30,
          message: `New order ${order.orderId} assigned to you`,
        });
      } catch (err) {
        console.log("Socket emission completed or skipped");
      }
    } else {
      await order.save();
    }

    // Respond with order confirmation
    res.status(201).json({ success: true, orderId: order.orderId });

    // Send customer confirmation email asynchronously
    await sendOrderEmail(
      customer.email,
      "Order Confirmed - Food Ordering",
      `
        <div style="font-family: Arial, sans-serif;">
          <h2>Order Confirmed!</h2>
          <p>Hi ${customer.name},</p>
          <p>Your order <strong>${order.orderId}</strong> has been received and is being prepared.</p>
          <p><strong>Total Amount:</strong> ₹${calculatedTotal.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}</p>
          <p>Estimated preparation time: 30 minutes</p>
          <p>We will notify you once your order is ready for delivery.</p>
          <p>Thank you for your order!</p>
        </div>
      `
    );

    // Send admin notification
    await sendOrderEmail(
      process.env.ADMIN_EMAIL,
      `New Order Received - ${order.orderId}`,
      `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Order Alert</h2>
          <p>New order from ${customer.name}</p>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Total:</strong> ₹${calculatedTotal.toFixed(2)}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          ${availableChef ? `<p><strong>Assigned Chef:</strong> ${availableChef.name}</p>` : ""}
        </div>
      `
    );
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ success: false, message: "Order failed: " + err.message });
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

// ✅ Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const orders = await Order.find({ userId })
      .populate("items.menuItemId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch orders" });
  }
};
