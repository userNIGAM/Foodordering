// backend/middleware/authDelivery.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authDelivery = async (req, res, next) => {
  try {
    let token;

    // Priority: Bearer token in Authorization header > cookie
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and check if they're a delivery person
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "delivery_person") {
      return res.status(403).json({
        success: false,
        message: "Delivery person access required",
      });
    }

    // Check if delivery person is active
    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Contact admin.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export default authDelivery;
