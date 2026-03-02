import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const seedDelivery = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodOrdering"
    );

    console.log("✅ MongoDB connected");

    const saltRounds = 12;
    const password = process.env.DELIVERY_PASSWORD || "delivery123";
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const deliveryUser = await User.findOneAndUpdate(
      { email: "delivery@gmail.com" },
      {
        name: "Delivery Worker",
        email: "delivery@gmail.com",
        password: hashedPassword,
        role: "delivery_person",
        isVerified: true,
        status: "approved",
        maxCapacity: 10,
        currentCapacity: 0,
      },
      { upsert: true, new: true }
    );

    console.log("✅ Delivery user ready!");
    console.log("📧 Email: delivery@gmail.com");
    console.log("🔑 Password:", password);
    console.log("🚚 Role: delivery_person");
    console.log("✔️ Status: approved");
    console.log("\n🚀 You can now login with these credentials!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding delivery user:", error);
    process.exit(1);
  }
};

seedDelivery();