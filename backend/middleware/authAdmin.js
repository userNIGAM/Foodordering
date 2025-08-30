// backend/middleware/authAdmin.js
const authAdmin = (req, res, next) => {
  // 1. Check if user is authenticated (has a valid token)
  if (!req.user) {
    return res.status(401).json({ message: "Auth failed" });
  }
  // 2. Check if the authenticated user is an admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin permission required" });
  }
  // 3. If both checks pass, move on to the route handler
  next();
};

module.exports = authAdmin;
