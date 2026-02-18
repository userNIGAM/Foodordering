import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { sendStatusEmail } from "../utils/statusMail.js";

// 📍 Get current logged-in user's profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // user set by auth middleware
    const user = await User.findById(userId).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      user: {
        ...user._doc,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📤 Update user profile (name, bio, phoneNumber, avatar, etc.)
export const updateUserProfile = async (req, res) => {
  try {
    console.log("File received:", req.file);
    console.log("Body received:", req.body);
    const userId = req.user._id;
    const { firstName, lastName, bio, phoneNumber } = req.body;
    let avatarUrl;

    // 🖼️ Upload image to Cloudinary if provided
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_avatars",
        resource_type: "image",
      });
      avatarUrl = uploadResult.secure_url;
      fs.unlinkSync(req.file.path); // remove local file
    }

    const updateData = {
      firstName,
      lastName,
      bio,
      phoneNumber,
    };

    if (avatarUrl) updateData.avatar = avatarUrl;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user: {
        ...updatedUser._doc,
        name: `${updatedUser.firstName || ""} ${
          updatedUser.lastName || ""
        }`.trim(),
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const oldStatus = user.status;

    // If status not changed, do nothing
    if (oldStatus === status) {
      return res.json({ message: "Status unchanged" });
    }

    user.status = status;
    await user.save();

    // 🔔 Send email
    await sendStatusEmail({
      to: user.email,
      name: user.name || "User",
      oldStatus,
      newStatus: status,
      subject: "Your Status Has Been Updated"
    });

    res.json({
      success: true,
      message: "Status updated and email sent",
      user
    });

  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};