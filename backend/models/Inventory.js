import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
    unique: true,
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0,
  },
  unit: {
    type: String,
    default: "units",
  },
  lastRestocked: {
    type: Date,
    default: Date.now,
  },
  autoRestock: {
    type: Boolean,
    default: false,
  },
  restockLevel: {
    type: Number,
    default: 50,
  },
  costPerUnit: {
    type: Number,
    min: 0,
    default: 0,
  },
  isTracked: {
    type: Boolean,
    default: true,
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

// Update the updatedAt field before saving
inventorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Inventory", inventorySchema);
