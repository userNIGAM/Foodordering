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
import { initSocket } from "./socket.js";
import { createServer } from "http";
import path from "path";
import menuItemRoutes from "./routes/menuItems.js";
import categoryRoutes from "./routes/categories.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// init socket.io
initSocket(httpServer);

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // dev
  "https://foodordering-q4rq.vercel.app", // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu-items", menuRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRouter);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/categories", categoryRoutes);
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect to DB
ConnectDB();

// ✅ only use httpServer.listen (not app.listen)
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
