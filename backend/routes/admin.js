// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const authAdmin = require("../middleware/authAdmin"); // Import the middleware

// This route is now protected by both authentication AND admin check
router.get("/orders", authAdmin, (req, res) => {
  // ... logic to get all orders from the database
});

module.exports = router;
