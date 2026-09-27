const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "foodfusion_secret_key", {
    expiresIn: "30d",
  });
};

// @desc    Register new customer
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, city, latitude, longitude } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Only allow customer and admin roles via this endpoint
    const allowedRoles = ["customer", "admin"];
    const userRole = role && allowedRoles.includes(role) ? role : "customer";

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      phone: phone || "",
      address: address || "",
      city: city || "",
      latitude: latitude !== undefined && latitude !== null ? Number(latitude) : null,
      longitude: longitude !== undefined && longitude !== null ? Number(longitude) : null,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        latitude: user.latitude,
        longitude: user.longitude,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register new restaurant partner (creates User + Restaurant record)
// @route   POST /api/auth/restaurant/register
// @access  Public
const registerRestaurantPartner = async (req, res) => {
  try {
    const {
      restaurantName,
      ownerName,
      email,
      phone,
      password,
      address,
      city,
      latitude,
      longitude,
      cuisine,
      deliveryRadius,
    } = req.body;

    if (!restaurantName || !ownerName || !email || !password) {
      return res.status(400).json({
        message: "Please provide restaurant name, owner name, email and password",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account already exists with this email" });
    }

    // Create the user with role=restaurant
    const user = await User.create({
      name: ownerName,
      email,
      password,
      role: "restaurant",
      phone: phone || "",
      address: address || "",
      city: city || "",
      latitude: latitude !== undefined && latitude !== null ? Number(latitude) : 28.6946,
      longitude: longitude !== undefined && longitude !== null ? Number(longitude) : 77.2084,
      restaurantName,
      ownerName,
    });

    // Create linked Restaurant document
    const restaurant = await Restaurant.create({
      name: restaurantName,
      ownerName,
      contactEmail: email,
      contactPhone: phone || "",
      address: address || "",
      city: city || "",
      location: address || city || "Campus Area",
      latitude: latitude !== undefined && latitude !== null ? Number(latitude) : 28.6946,
      longitude: longitude !== undefined && longitude !== null ? Number(longitude) : 77.2084,
      deliveryRadius: deliveryRadius ? Number(deliveryRadius) : 15,
      cuisine: cuisine || "Multi-Cuisine",
      owner: user._id,
      isAvailable: true,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      latitude: user.latitude,
      longitude: user.longitude,
      restaurantName: user.restaurantName,
      ownerName: user.ownerName,
      restaurantId: restaurant._id,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If a specific role is required, enforce it
    if (role && user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as a '${user.role}'. Please use the correct login portal.`,
      });
    }

    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      latitude: user.latitude,
      longitude: user.longitude,
      token: generateToken(user._id),
    };

    // Include restaurant-specific fields if applicable
    if (user.role === "restaurant") {
      responseData.restaurantName = user.restaurantName;
      responseData.ownerName = user.ownerName;
      // Fetch the linked restaurant document
      const restaurant = await Restaurant.findOne({ owner: user._id });
      if (restaurant) {
        responseData.restaurantId = restaurant._id;
      }
    }

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const responseData = user.toObject();

    // Include restaurant data if restaurant partner
    if (user.role === "restaurant") {
      const restaurant = await Restaurant.findOne({ owner: user._id });
      if (restaurant) {
        responseData.restaurantId = restaurant._id;
      }
    }

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.city = req.body.city !== undefined ? req.body.city : user.city;
    if (req.body.latitude !== undefined) user.latitude = req.body.latitude !== null ? Number(req.body.latitude) : null;
    if (req.body.longitude !== undefined) user.longitude = req.body.longitude !== null ? Number(req.body.longitude) : null;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      latitude: updatedUser.latitude,
      longitude: updatedUser.longitude,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  registerRestaurantPartner,
  loginUser,
  getMe,
  updateProfile,
};
