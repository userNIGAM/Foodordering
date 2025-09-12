// models/Category.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    parent: { type: String }, // optional parent category
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
