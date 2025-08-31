import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
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
      "confirmed",
      "preparing",
      "out for delivery",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
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
