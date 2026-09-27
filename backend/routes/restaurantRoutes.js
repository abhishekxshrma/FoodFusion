const express = require("express");
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  getMyRestaurant,
  createRestaurant,
  updateRestaurant,
} = require("../controllers/restaurantController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getRestaurants);
router.get("/my-restaurant", protect, authorize("restaurant", "admin"), getMyRestaurant);
router.get("/:id", getRestaurantById);
router.post("/", protect, authorize("restaurant", "admin"), createRestaurant);
router.put("/:id", protect, authorize("restaurant", "admin"), updateRestaurant);

module.exports = router;
