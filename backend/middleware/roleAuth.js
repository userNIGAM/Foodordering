// backend/middleware/roleAuth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Generic role-based authentication middleware
 * Usage: roleAuth("admin", "chef") - allows admin or chef
 */
export const roleAuth = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      let token;

      if (req.cookies.token) {
        token = req.cookies.token;
      }

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access required: ${allowedRoles.join(", ")}`,
        });
      }

      // Check user status if restricted
      if (["chef", "delivery_person"].includes(user.role) && user.status === "inactive") {
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
};

export default roleAuth;
