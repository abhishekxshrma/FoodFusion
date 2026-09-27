const express = require("express");
const router = express.Router();
const {
  getRestaurantMenu,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
  toggleFoodAvailability,
} = require("../controllers/foodController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/restaurant/:restaurantId", getRestaurantMenu);
router.post("/", protect, authorize("restaurant", "admin"), addFoodItem);
router.put("/:id", protect, authorize("restaurant", "admin"), updateFoodItem);
router.delete("/:id", protect, authorize("restaurant", "admin"), deleteFoodItem);
router.patch("/:id/availability", protect, authorize("restaurant", "admin"), toggleFoodAvailability);

module.exports = router;
