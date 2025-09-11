// backend/scripts/seedAdmin.js
import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodOrdering"
    );

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);

    const adminUser = await User.findOneAndUpdate(
      { email: "admin@example.com" },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      },
      { upsert: true, new: true } // 👈 creates if not exists, updates if exists
    );

    console.log("✅ Admin user ready");
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
