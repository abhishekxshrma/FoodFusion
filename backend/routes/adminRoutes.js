const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  deleteUser,
  getAllRestaurants,
  updateRestaurantStatus,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/restaurants", getAllRestaurants);
router.put("/restaurants/:id/status", updateRestaurantStatus);

module.exports = router;
