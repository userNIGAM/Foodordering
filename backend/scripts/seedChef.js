// backend/scripts/seedChef.js
import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const seedChef = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodOrdering"
    );

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash("chef123", saltRounds);

    const chefUser = await User.findOneAndUpdate(
      { email: "chef@gmail.com" },
      {
        name: "Chef Worker",
        email: "chef@gmail.com",
        password: hashedPassword,
        role: "chef",
        isVerified: true,
        status: "approved",
        maxCapacity: 10,
        currentCapacity: 0,
      },
      { upsert: true, new: true } // creates if not exists, updates if exists
    );

    console.log("✅ Chef user ready!");
    console.log("📧 Email: chef@gmail.com");
    console.log("🔑 Password: chef123");
    console.log("👨‍🍳 Role: chef");
    console.log("✔️ Status: approved");
    console.log("\n🚀 You can now login with these credentials!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding chef:", error);
    process.exit(1);
  }
};

seedChef();
