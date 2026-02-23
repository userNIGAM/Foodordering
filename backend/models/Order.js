import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    // required: true,
  },
  customer: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    specialInstructions: {
      type: String,
      default: "",
    },
  },
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "wallet", "bank"],
    required: true,
    default: "cod",
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
    default: "pending",
  },
  // 🔍 Verification fields
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  verificationNotes: {
    type: String,
    default: "",
  },
  verificationTime: {
    type: Date,
    default: null,
  },

  // 🍳 Kitchen & Chef fields
  kitchenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kitchen",
    default: null,
  },
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // 🚚 Delivery Person fields
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // ⏱️ Timing fields
  estimatedPrepTime: {
    type: Number, // in minutes
    default: 30,
  },
  estimatedDeliveryTime: {
    type: Number, // in minutes
    default: 45,
  },
  actualPrepStartTime: {
    type: Date,
    default: null,
  },
  actualPrepEndTime: {
    type: Date,
    default: null,
  },
  pickupTime: {
    type: Date,
    default: null,
  },
  actualDeliveryTime: {
    type: Date,
    default: null,
  },

  // 📋 Timeline events
  timeline: [
    {
      event: String, // pending, verified, assigned, confirmed, preparing, prepared, etc.
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      changedByRole: String, // user, admin, chef, delivery_person
      timestamp: {
        type: Date,
        default: Date.now,
      },
      notes: String,
      previousStatus: String,
    },
  ],

  // ⚠️ Issue tracking
  issue: {
    description: String,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reportedByRole: String,
    reportedAt: Date,
    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },
    resolution: String,
  },

  // ⭐ Ratings & Feedback
  chefRating: {
    type: Number,
    min: 0,
    max: 5,
    default: null,
  },
  chefReview: String,
  deliveryRating: {
    type: Number,
    min: 0,
    max: 5,
    default: null,
  },
  deliveryReview: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate order ID before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderId = `ORD${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

export default mongoose.model("Order", orderSchema);
