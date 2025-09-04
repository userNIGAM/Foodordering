import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      // unique: true,
    },
    subject: {
      required: true,
      type: String,
    },
    message: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("feedback", contactSchema);
