const Restaurant = require("../models/Restaurant");
const FoodItem = require("../models/FoodItem");

// Haversine formula to calculate distance between two coordinates in kilometers
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// @desc    Get all restaurants (with optional location-based distance & search query)
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const { location, search, cuisine, lat, lng, city } = req.query;
    let query = { isAvailable: true };

    if (city && city.trim() !== "" && city !== "All") {
      query.$or = [
        { city: { $regex: city.trim(), $options: "i" } },
        { location: { $regex: city.trim(), $options: "i" } },
        { address: { $regex: city.trim(), $options: "i" } },
      ];
    } else if (location && location.trim() !== "" && location !== "All") {
      query.location = { $regex: location.trim(), $options: "i" };
    }

    if (search && search.trim() !== "") {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: searchRegex },
          { cuisine: searchRegex },
          { location: searchRegex },
          { city: searchRegex },
        ],
      });
    }

    if (cuisine && cuisine.trim() !== "" && cuisine !== "All") {
      query.cuisine = { $regex: cuisine.trim(), $options: "i" };
    }

    let restaurants = await Restaurant.find(query).sort({ rating: -1 });

    // Location-based filtering if user latitude & longitude provided
    if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      const userLat = Number(lat);
      const userLng = Number(lng);

      const filtered = [];
      for (const rest of restaurants) {
        if (rest.latitude != null && rest.longitude != null) {
          const dist = calculateDistanceKm(userLat, userLng, rest.latitude, rest.longitude);
          const maxRadius = rest.deliveryRadius || 15;
          // Only show restaurant if user is within delivery radius
          if (dist <= maxRadius) {
            const restObj = rest.toObject();
            restObj.distance = Number(dist.toFixed(1));
            filtered.push(restObj);
          }
        }
      }
      // Sort by nearest distance first
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      return res.json(filtered);
    }

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get restaurant owned by logged-in partner
// @route   GET /api/restaurants/my-restaurant
// @access  Private (Restaurant Partner)
const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant profile found for this account" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create restaurant profile
// @route   POST /api/restaurants
// @access  Private (Restaurant / Admin)
const createRestaurant = async (req, res) => {
  try {
    const existing = await Restaurant.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You already have a restaurant profile" });
    }

    const {
      name,
      description,
      location,
      address,
      city,
      latitude,
      longitude,
      deliveryRadius,
      cuisine,
      priceForTwo,
      deliveryTime,
      image,
    } = req.body;

    if (!name || !location || !cuisine) {
      return res.status(400).json({ message: "Please provide restaurant name, location, and cuisine" });
    }

    const restaurant = await Restaurant.create({
      name,
      description: description || "",
      location,
      address: address || "",
      city: city || "",
      latitude: latitude !== undefined && latitude !== null ? Number(latitude) : 28.6946,
      longitude: longitude !== undefined && longitude !== null ? Number(longitude) : 77.2084,
      deliveryRadius: deliveryRadius ? Number(deliveryRadius) : 15,
      cuisine,
      priceForTwo: priceForTwo ? Number(priceForTwo) : 400,
      deliveryTime: deliveryTime || "25-30 min",
      image: image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      owner: req.user._id,
      isAvailable: true,
    });

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update restaurant profile
// @route   PUT /api/restaurants/:id
// @access  Private (Restaurant / Admin)
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check ownership if role is restaurant
    if (req.user.role === "restaurant" && restaurant.owner && restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this restaurant" });
    }

    const {
      name,
      description,
      location,
      address,
      city,
      latitude,
      longitude,
      deliveryRadius,
      cuisine,
      priceForTwo,
      deliveryTime,
      image,
      isAvailable,
    } = req.body;

    restaurant.name = name || restaurant.name;
    restaurant.description = description !== undefined ? description : restaurant.description;
    restaurant.location = location || restaurant.location;
    restaurant.address = address !== undefined ? address : restaurant.address;
    restaurant.city = city !== undefined ? city : restaurant.city;
    if (latitude !== undefined && latitude !== null) restaurant.latitude = Number(latitude);
    if (longitude !== undefined && longitude !== null) restaurant.longitude = Number(longitude);
    if (deliveryRadius !== undefined && deliveryRadius !== null) restaurant.deliveryRadius = Number(deliveryRadius);
    restaurant.cuisine = cuisine || restaurant.cuisine;
    restaurant.priceForTwo = priceForTwo !== undefined ? Number(priceForTwo) : restaurant.priceForTwo;
    restaurant.deliveryTime = deliveryTime || restaurant.deliveryTime;
    restaurant.image = image || restaurant.image;
    if (isAvailable !== undefined) {
      restaurant.isAvailable = isAvailable;
    }

    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  getMyRestaurant,
  createRestaurant,
  updateRestaurant,
};
