import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailer.js";
import { randomGreeting } from "../utils/greetings.js";
import bcrypt from "bcryptjs";

// Helper: sign JWT
const signJWT = (
  payload,
  expiresIn = "1d",
  secret = process.env.JWT_SECRET
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Set login cookie
const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/* ------------------- REGISTER ------------------- */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
    });

    // Generate OTP for email verification
    const otp = user.generateOTP();
    const salt = await bcrypt.genSalt(10);
    user.verificationOTP = await bcrypt.hash(otp, salt);
    user.verificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const greeting = randomGreeting(user.name);

    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>${greeting}</h2>
          <p>Thanks for signing up! Please verify your email address using this OTP:</p>
          <h3 style="background:#f1f5f9; padding:10px; display:inline-block; border-radius:5px;">${otp}</h3>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
    });

    // Create JWT token for immediate login after verification
    const token = signJWT({ id: user._id });
    setAuthCookie(res, token);

    const { password: _p, ...userData } = user.toObject();
    return res.status(201).json({
      success: true,
      message: "Verification OTP sent to email",
      user: userData,
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------- VERIFY EMAIL (with OTP) ------------------- */
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(200)
        .json({ success: true, message: "Email already verified" });
    }

    // Check if OTP is valid and not expired
    if (!user.verificationOTP || !user.verificationOTPExpires) {
      return res
        .status(400)
        .json({ success: false, message: "No verification request found" });
    }

    if (Date.now() > user.verificationOTPExpires) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    const isValidOTP = await bcrypt.compare(otp, user.verificationOTP);
    if (!isValidOTP) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    // Create new JWT token with verified status
    const token = signJWT({ id: user._id });
    setAuthCookie(res, token);

    const { password: _p, ...userData } = user.toObject();
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: userData,
    });
  } catch (err) {
    console.error("Verify Email Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------- LOGIN (without requiring verification) ------------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    // Create JWT token regardless of verification status
    const token = signJWT({ id: user._id });
    setAuthCookie(res, token);

    const { password: _p, ...userData } = user.toObject();
    return res
      .status(200)
      .json({ success: true, message: "Login successful", user: userData });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------- RESEND VERIFICATION OTP ------------------- */
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.isVerified) {
      return res
        .status(200)
        .json({ success: true, message: "Email already verified" });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    const salt = await bcrypt.genSalt(10);
    user.verificationOTP = await bcrypt.hash(otp, salt);
    user.verificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const greeting = randomGreeting(user.name);
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `
        <h2>${greeting}</h2>
        <p>Your new verification OTP is:</p>
        <h3 style="background:#f1f5f9; padding:10px; display:inline-block; border-radius:5px;">${otp}</h3>
        <p>This OTP will expire in 10 minutes.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Verification OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend Verification Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------- FORGOT PASSWORD (with OTP) ------------------- */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    // Generate OTP for password reset
    const otp = user.generateOTP();
    const salt = await bcrypt.genSalt(10);
    user.resetPasswordOTP = await bcrypt.hash(otp, salt);
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Use this OTP to reset your password:</p>
        <h3 style="background:#f1f5f9; padding:10px; display:inline-block; border-radius:5px;">${otp}</h3>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request this, ignore this email.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------- RESET PASSWORD (with OTP) ------------------- */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    // Check if OTP is valid and not expired
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res
        .status(400)
        .json({ success: false, message: "No password reset request found" });
    }

    if (Date.now() > user.resetPasswordOTPExpires) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    const isValidOTP = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isValidOTP) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Update password and clear OTP fields
    user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
/* ------------------- GET CURRENT USER ------------------- */
export const getCurrentUser = async (req, res) => {
  try {
    // This middleware should be protected by auth middleware that verifies JWT
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Get Current User Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------- LOGOUT ------------------- */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
