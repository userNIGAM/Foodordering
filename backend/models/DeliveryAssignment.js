// backend/models/DeliveryAssignment.js
import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    deliveryPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin who assigned
      required: true,
    },
    status: {
      type: String,
      enum: [
        "assigned",        // Just assigned, awaiting pickup
        "picked_up",       // Delivery person picked up order
        "in_transit",      // On the way to customer
        "delivered",       // Successfully delivered
        "failed",          // Failed delivery attempt
        "cancelled",       // Cancelled by user or system
      ],
      default: "assigned",
    },
    pickupTime: {
      type: Date,
      default: null,
    },
    deliveryTime: {
      type: Date,
      default: null,
    },
    estimatedDeliveryTime: {
      type: Number, // in minutes
      default: 45,
    },
    actualDeliveryTime: {
      type: Number, // in minutes
      default: null,
    },
    location: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
      address: {
        type: String,
        default: null,
      },
      lastUpdated: {
        type: Date,
        default: null,
      },
    },
    // 📍 Location tracking history
    locationHistory: [
      {
        latitude: Number,
        longitude: Number,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notes: {
      type: String,
      default: "",
    },
    // 🚚 Delivery attempt tracking
    deliveryAttempts: {
      type: Number,
      default: 0,
    },
    failureReason: {
      type: String,
      default: null,
    },
    // ⭐ Feedback
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },
    review: {
      type: String,
      default: null,
    },
    // 💰 Delivery charges
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    distanceTraveled: {
      type: Number, // in km
      default: null,
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

export default mongoose.model("DeliveryAssignment", deliveryAssignmentSchema);
