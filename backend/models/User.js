// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // 🔐 Authentication fields
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin", "chef", "delivery_person"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "processing", "completed", "active", "inactive", "on_break"],
      default: "pending"
    },
    verificationOTP: String,
    verificationOTPExpires: Date,
    resetPasswordOTP: String,
    resetPasswordOTPExpires: Date,

    // 👤 Profile fields
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    phoneNumber: { type: String, trim: true, default: "" },
    bio: { type: String, maxlength: 500, default: "" },
    avatar: { type: String, default: null }, // store image URL or /uploads/file.jpg

    // 📧 Secondary email(s)
    secondaryEmails: [{ type: String, lowercase: true, trim: true }],

    // 👨‍🍳 Chef-specific fields
    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kitchen",
      default: null,
    },
    assignedOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    completedOrders: {
      type: Number,
      default: 0,
    },
    currentCapacity: {
      type: Number,
      default: 0,
    },
    maxCapacity: {
      type: Number,
      default: 5,
    },
    chefRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    // 🚚 Delivery Person-specific fields
    deliveryZone: {
      type: String,
      default: null,
    },
    deliveryRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    completedDeliveries: {
      type: Number,
      default: 0,
    },
    currentLocation: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      address: { type: String, default: null },
      updatedAt: { type: Date, default: null },
    },
    deliveryStats: {
      onTimeDeliveries: { type: Number, default: 0 },
      totalDeliveries: { type: Number, default: 0 },
      averageDeliveryTime: { type: Number, default: 0 }, // in minutes
      cancellations: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// 🔑 Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 🔑 Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔑 Generate OTP
userSchema.methods.generateOTP = function () {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default mongoose.model("User", userSchema);
