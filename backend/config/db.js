import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("❌ Database connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Database disconnected");
    });
  } catch (error) {
    console.error("❌ Error connecting MongoDB:", error.message);
    process.exit(1);
  }
};

export default ConnectDB;
