const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");

// @desc    Create new individual order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const order = await Order.create({
      orderType: "individual",
      customer: req.user._id,
      customerName: req.user.name,
      restaurant: restaurantId,
      restaurantName: restaurant.name,
      items,
      totalAmount,
      deliveryAddress: deliveryAddress || req.user.address || "Main Campus Hostel",
      paymentMethod: paymentMethod || "Cash on Delivery",
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer order history
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("restaurant", "name location image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get restaurant incoming orders
// @route   GET /api/orders/restaurant
// @access  Private (Restaurant Partner)
const getRestaurantOrders = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.json([]);
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("customer", "name email phone")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone address")
      .populate("restaurant", "name location address owner");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Role-based security check
    if (req.user.role === "customer" && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    if (req.user.role === "restaurant") {
      const myRestaurant = await Restaurant.findOne({ owner: req.user._id });
      if (!myRestaurant || order.restaurant._id.toString() !== myRestaurant._id.toString()) {
        return res.status(403).json({ message: "Not authorized to view orders from other restaurants" });
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Restaurant Partner / Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security check: If restaurant partner, verify ownership of the restaurant
    if (req.user.role === "restaurant") {
      const myRestaurant = await Restaurant.findOne({ owner: req.user._id });
      if (!myRestaurant || order.restaurant.toString() !== myRestaurant._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update orders for other restaurants" });
      }
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private (Admin)
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  getOrderById,
  updateOrderStatus,
  getAdminOrders,
};
