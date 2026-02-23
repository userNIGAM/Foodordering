// backend/models/Kitchen.js
import mongoose from "mongoose";

const kitchenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    chefs: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        assignedAt: {
          type: Date,
          default: Date.now,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    maxCapacity: {
      type: Number,
      default: 50, // max orders kitchen can handle simultaneously
    },
    currentLoad: {
      type: Number,
      default: 0, // current number of orders being prepared
    },
    operatingHours: {
      openTime: String, // HH:MM format
      closeTime: String, // HH:MM format
      isOpen: {
        type: Boolean,
        default: true,
      },
    },
    avgPrepTime: {
      type: Number,
      default: 30, // in minutes
    },
    ratings: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    specializations: [String], // e.g., ["North Indian", "South Indian", "Continental"]
    equipmentDetails: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance", "closed"],
      default: "active",
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

export default mongoose.model("Kitchen", kitchenSchema);
