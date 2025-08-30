// models/MenuItem.js
import mongoose from "mongoose";

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
      enum: [
        "burgers",
        "pizzas",
        "sandwiches",
        "fries",
        "beverages",
        "desserts",
        "starters",
        "mains",
      ],
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MenuItem", menuItemSchema);
