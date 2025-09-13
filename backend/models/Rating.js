import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, default: "" },
  },
  { timestamps: true }
);

// Ensure one rating per user per product
ratingSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);
