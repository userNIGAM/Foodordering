import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedSuperAdmin = async () => {
  const existing = await User.findOne({ email: "superadmin@example.com" });
  if (existing) {
    console.log("Superadmin already exists");
    return process.exit();
  }

  const superadmin = new User({
    name: "Super Admin",
    email: "superadmin@example.com",
    password: "SuperSecurePassword123!", // will be hashed automatically
    role: "superadmin",
    isVerified: true,
  });

  await superadmin.save();
  console.log("Superadmin created successfully!");
  process.exit();
};

seedSuperAdmin();