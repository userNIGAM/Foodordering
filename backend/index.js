// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import adminRoutes from "./routes/admin.js";
import orderRoutes from "./routes/orderRoutes.js";
import ConnectDB from "./config/db.js";
import contactRouter from "./routes/contactRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // dev
  "https://foodordering-q4rq.vercel.app", // production frontend
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true, // allow cookies
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu-items", menuRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRouter);

ConnectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
