// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import adminRoutes from "./routes/admin.js";
import { ConnectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu-items", menuRoutes);
app.use("/api/admin", adminRoutes); // Add admin routes

// MongoDB connect
ConnectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
