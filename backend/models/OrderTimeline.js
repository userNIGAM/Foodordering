// backend/models/OrderTimeline.js
import mongoose from "mongoose";

const orderTimelineSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    events: [
      {
        // The status event
        event: {
          type: String,
          enum: [
            "order_created",
            "order_verified",
            "order_rejected",
            "assigned_to_kitchen",
            "chef_confirmed",
            "preparation_started",
            "preparation_completed",
            "assigned_to_delivery",
            "picked_up",
            "in_transit",
            "delivered",
            "issue_reported",
            "issue_resolved",
            "cancelled_by_user",
            "cancelled_by_admin",
            "cancelled_by_chef",
          ],
          required: true,
        },
        status: {
          type: String,
          enum: [
            "pending",
            "verified",
            "assigned_to_kitchen",
            "confirmed",
            "preparing",
            "prepared",
            "assigned_to_delivery",
            "picked_up",
            "out_for_delivery",
            "delivered",
            "issue",
            "cancelled",
          ],
        },
        changedBy: {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          name: String,
          role: {
            type: String,
            enum: ["user", "admin", "chef", "delivery_person"],
          },
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
          default: "",
        },
        previousStatus: String,
        metadata: {
          // Additional event-specific data
          kitchenId: mongoose.Schema.Types.ObjectId,
          chefId: mongoose.Schema.Types.ObjectId,
          deliveryPersonId: mongoose.Schema.Types.ObjectId,
          estimatedTime: Number,
          actualTime: Number,
        },
      },
    ],
    // Summary fields
    chefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deliveryPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Timing summary
    timelineStats: {
      verificationTime: Number, // time from created to verified (minutes)
      prepTime: Number, // actual preparation time (minutes)
      deliveryTime: Number, // actual delivery time (minutes)
      totalTime: Number, // total time from order to delivery (minutes)
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("OrderTimeline", orderTimelineSchema);
