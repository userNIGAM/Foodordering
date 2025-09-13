// models/MenuItem.js
import mongoose from "mongoose";
import Category from "./Category.js";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: async function (value) {
          // make sure category exists
          const categoryExists = await Category.findOne({ name: value });
          return !!categoryExists;
        },
        message: "Category does not exist",
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    prepTime: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      breakdown: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);
menuItemSchema.pre("save", async function (next) {
  const exists = await Category.findOne({ name: this.category });
  if (!exists) {
    return next(new Error("Invalid category"));
  }
  next();
});

export default mongoose.model("MenuItem", menuItemSchema);
