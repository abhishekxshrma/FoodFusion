const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerRestaurantPartner,
  loginUser,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Customer & Admin registration
router.post("/register", registerUser);

// Restaurant partner registration (creates User + Restaurant)
router.post("/restaurant/register", registerRestaurantPartner);

// Unified login (with optional role enforcement via req.body.role)
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

module.exports = router;
