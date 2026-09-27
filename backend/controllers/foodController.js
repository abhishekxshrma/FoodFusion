const FoodItem = require("../models/FoodItem");
const Restaurant = require("../models/Restaurant");

// Helper to check restaurant ownership
const verifyFoodOwnership = async (foodItem, user) => {
  if (user.role === "admin") return true;
  const restaurant = await Restaurant.findById(foodItem.restaurant);
  if (!restaurant || !restaurant.owner || restaurant.owner.toString() !== user._id.toString()) {
    return false;
  }
  return true;
};

// @desc    Get menu items for a restaurant
// @route   GET /api/food/restaurant/:restaurantId
// @access  Public
const getRestaurantMenu = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({
      restaurant: req.params.restaurantId,
    });
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a food item
// @route   POST /api/food
// @access  Private (Restaurant / Admin)
const addFoodItem = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    let targetRestaurantId = req.body.restaurantId;

    if (req.user.role === "restaurant") {
      const restaurant = await Restaurant.findOne({ owner: req.user._id });
      if (!restaurant) {
        return res.status(404).json({ message: "You must create a restaurant profile before adding food items" });
      }
      targetRestaurantId = restaurant._id;
    } else if (!targetRestaurantId) {
      return res.status(400).json({ message: "Please provide restaurantId" });
    }

    if (!name || price === undefined || price === null || price === "") {
      return res.status(400).json({ message: "Please provide food name and price" });
    }

    const foodItem = await FoodItem.create({
      restaurant: targetRestaurantId,
      name,
      description: description || "",
      price: Number(price),
      category: category || "Main Course",
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      isAvailable: true,
    });

    res.status(201).json(foodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a food item
// @route   PUT /api/food/:id
// @access  Private (Restaurant / Admin)
const updateFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const isAuthorized = await verifyFoodOwnership(foodItem, req.user);
    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized to update this food item" });
    }

    const { name, description, price, category, image, isAvailable } = req.body;

    foodItem.name = name || foodItem.name;
    foodItem.description = description !== undefined ? description : foodItem.description;
    foodItem.price = price !== undefined ? Number(price) : foodItem.price;
    foodItem.category = category || foodItem.category;
    foodItem.image = image || foodItem.image;
    if (isAvailable !== undefined) {
      foodItem.isAvailable = isAvailable;
    }

    const updatedFoodItem = await foodItem.save();
    res.json(updatedFoodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/food/:id
// @access  Private (Restaurant / Admin)
const deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const isAuthorized = await verifyFoodOwnership(foodItem, req.user);
    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized to delete this food item" });
    }

    await foodItem.deleteOne();
    res.json({ message: "Food item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle food item availability
// @route   PATCH /api/food/:id/availability
// @access  Private (Restaurant / Admin)
const toggleFoodAvailability = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const isAuthorized = await verifyFoodOwnership(foodItem, req.user);
    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized to modify this food item" });
    }

    foodItem.isAvailable = !foodItem.isAvailable;
    await foodItem.save();

    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurantMenu,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
  toggleFoodAvailability,
};
