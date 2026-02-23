// backend/models/ChefAssignment.js
import mongoose from "mongoose";

const chefAssignmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    chefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kitchen",
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
        "assigned",      // Just assigned, awaiting chef confirmation
        "confirmed",     // Chef confirmed they'll prepare
        "preparing",     // Chef started preparation
        "prepared",      // Chef finished, ready for delivery
        "issue",         // Some problem occurred
      ],
      default: "assigned",
    },
    startTime: {
      type: Date,
      default: null,
    },
    completionTime: {
      type: Date,
      default: null,
    },
    estimatedPrepTime: {
      type: Number, // in minutes
      default: 30,
    },
    actualPrepTime: {
      type: Number, // in minutes
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    issues: [
      {
        description: String,
        reportedAt: {
          type: Date,
          default: Date.now,
        },
        severity: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
        resolution: String,
      },
    ],
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

export default mongoose.model("ChefAssignment", chefAssignmentSchema);
