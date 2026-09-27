const express = require("express");
const router = express.Router();
const {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  getOrderById,
  updateOrderStatus,
  getAdminOrders,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getCustomerOrders);
router.get("/restaurant", protect, authorize("restaurant", "admin"), getRestaurantOrders);
router.get("/admin/all", protect, authorize("admin"), getAdminOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorize("restaurant", "admin"), updateOrderStatus);

module.exports = router;
