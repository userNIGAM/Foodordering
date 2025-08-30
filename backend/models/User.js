import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // For email verification OTP
    verificationOTP: String,
    verificationOTPExpires: Date,
    // For password reset OTP
    resetPasswordOTP: String,
    resetPasswordOTPExpires: Date,
  },
  { timestamps: true }
);

// Index email

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate OTP method
userSchema.methods.generateOTP = function () {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const User = mongoose.model("User", userSchema);

export default User;
