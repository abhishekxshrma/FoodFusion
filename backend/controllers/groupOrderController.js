const GroupOrder = require("../models/GroupOrder");
const Restaurant = require("../models/Restaurant");
const FoodItem = require("../models/FoodItem");
const Order = require("../models/Order");

// Helper to generate 6-character uppercase Room ID
const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Create a new Group Order Room
// @route   POST /api/group-orders
// @access  Private (Customer)
const createGroupRoom = async (req, res) => {
  try {
    const { restaurantId, roomName, deadline } = req.body;

    if (!restaurantId) {
      return res.status(400).json({ message: "Please select a restaurant" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    let roomId = generateRoomId();
    // Ensure uniqueness
    let existing = await GroupOrder.findOne({ roomId });
    while (existing) {
      roomId = generateRoomId();
      existing = await GroupOrder.findOne({ roomId });
    }

    const groupOrder = await GroupOrder.create({
      roomId,
      roomName: roomName || `${req.user.name}'s Group Order`,
      owner: req.user._id,
      ownerName: req.user.name,
      restaurant: restaurantId,
      deadline: deadline || "Today, 8:00 PM",
      status: "active",
      members: [
        {
          user: req.user._id,
          name: req.user.name,
          joinedAt: new Date(),
        },
      ],
      memberItems: [],
    });

    res.status(201).json(groupOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Group Order Room by Room ID
// @route   GET /api/group-orders/:roomId
// @access  Public / Private
const getGroupRoom = async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findOne({ roomId: req.params.roomId.toUpperCase() })
      .populate("restaurant", "name cuisine image location deliveryTime rating priceForTwo")
      .populate("owner", "name email");

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order room not found" });
    }

    res.json(groupOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join Group Order Room
// @route   POST /api/group-orders/:roomId/join
// @access  Private (Customer)
const joinGroupRoom = async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findOne({ roomId: req.params.roomId.toUpperCase() });

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order room not found" });
    }

    if (groupOrder.status !== "active") {
      return res.status(400).json({ message: "This group order room is already closed or finalized" });
    }

    // Check if user is already a member
    const alreadyMember = groupOrder.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!alreadyMember) {
      groupOrder.members.push({
        user: req.user._id,
        name: req.user.name,
        joinedAt: new Date(),
      });
      await groupOrder.save();
    }

    res.json(groupOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add food item for a member
// @route   POST /api/group-orders/:roomId/items
// @access  Private (Customer)
const addMemberItem = async (req, res) => {
  try {
    const { foodItemId, quantity } = req.body;
    const groupOrder = await GroupOrder.findOne({ roomId: req.params.roomId.toUpperCase() });

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order room not found" });
    }

    if (groupOrder.status !== "active") {
      return res.status(400).json({ message: "Cannot add items. Room is locked/finalized." });
    }

    const foodItem = await FoodItem.findById(foodItemId);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Ensure member is in members list
    const isMember = groupOrder.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      groupOrder.members.push({
        user: req.user._id,
        name: req.user.name,
        joinedAt: new Date(),
      });
    }

    // Check if user already added this food item
    const existingIndex = groupOrder.memberItems.findIndex(
      (item) =>
        item.user.toString() === req.user._id.toString() &&
        item.foodItem.toString() === foodItemId.toString()
    );

    const qty = Number(quantity) || 1;

    if (existingIndex > -1) {
      groupOrder.memberItems[existingIndex].quantity += qty;
    } else {
      groupOrder.memberItems.push({
        user: req.user._id,
        userName: req.user.name,
        foodItem: foodItemId,
        name: foodItem.name,
        price: foodItem.price,
        quantity: qty,
      });
    }

    await groupOrder.save();
    res.json(groupOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove/decrease member item
// @route   DELETE /api/group-orders/:roomId/items/:itemId
// @access  Private (Customer)
const removeMemberItem = async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findOne({ roomId: req.params.roomId.toUpperCase() });

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order room not found" });
    }

    if (groupOrder.status !== "active") {
      return res.status(400).json({ message: "Cannot remove items. Room is locked." });
    }

    const item = groupOrder.memberItems.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in group order" });
    }

    // Security check: Member can only manage their own items (unless owner)
    const isOwner = groupOrder.owner.toString() === req.user._id.toString();
    const isItemOwner = item.user.toString() === req.user._id.toString();

    if (!isOwner && !isItemOwner) {
      return res.status(403).json({ message: "You can only manage your own items" });
    }

    groupOrder.memberItems.pull(req.params.itemId);
    await groupOrder.save();

    res.json(groupOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quantity of a member item
// @route   PUT /api/group-orders/:roomId/items/:itemId
// @access  Private (Customer)
const updateMemberItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const groupOrder = await GroupOrder.findOne({ roomId: req.params.roomId.toUpperCase() });

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order room not found" });
    }

    if (groupOrder.status !== "active") {
      return res.status(400).json({ message: "Cannot modify items. Room is locked or finalized." });
    }

    const item = groupOrder.memberItems.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in group order" });
    }

    // Security check: Member can only manage their own items
    const isItemOwner = item.user.toString() === req.user._id.toString();
    const isRoomOwner = groupOrder.owner.toString() === req.user._id.toString();

    if (!isItemOwner && !isRoomOwner) {
      return res.status(403).json({ message: "You can only modify your own items" });
    }

    const newQty = Number(quantity);
    if (newQty <= 0) {
      groupOrder.memberItems.pull(req.params.itemId);
    } else {
      item.quantity = newQty;
    }

    await groupOrder.save();
    res.json(groupOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle lock/unlock on Group Room (Owner only)
// @route   PATCH /api/group-orders/:roomId/lock
// @access  Private (Customer - Owner only)
const toggleLockGroupRoom = async (req, res) => {
  try {
    const groupOrder = await GroupOrder.findOne({ roomId: req.params.roomId.toUpperCase() });

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order room not found" });
    }

    if (groupOrder.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the group room owner can lock/unlock the room" });
    }

    if (groupOrder.status === "confirmed" || groupOrder.status === "cancelled") {
      return res.status(400).json({ message: "Cannot change lock status on a finalized order" });
    }

    groupOrder.status = groupOrder.status === "active" ? "locked" : "active";
    await groupOrder.save();

    res.json({
      message: `Room is now ${groupOrder.status}`,
      status: groupOrder.status,
      groupOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm and finalize Group Order (Owner only)
// @route   POST /api/group-orders/:roomId/confirm
// @access  Private (Customer - Owner only)
const confirmGroupOrder = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;
    const groupOrder = await GroupOrder.findOne({ roomId: req.params.roomId.toUpperCase() })
      .populate("restaurant");

    if (!groupOrder) {
      return res.status(404).json({ message: "Group order room not found" });
    }

    // Security check: Only the group owner can confirm
    if (groupOrder.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the group room owner can finalize the order" });
    }

    if (groupOrder.status === "confirmed" || groupOrder.status === "cancelled") {
      return res.status(400).json({ message: "Group order is already confirmed or cancelled" });
    }

    if (groupOrder.memberItems.length === 0) {
      return res.status(400).json({ message: "Cannot finalize an empty group order. Please add food items first." });
    }

    // Calculate total amount
    const totalAmount = groupOrder.memberItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Prepare items array for Order model
    const orderItems = groupOrder.memberItems.map((item) => ({
      foodItem: item.foodItem,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      addedBy: item.userName,
    }));

    // Create combined restaurant order
    const combinedOrder = await Order.create({
      orderType: "group",
      customer: groupOrder.owner,
      customerName: groupOrder.ownerName,
      restaurant: groupOrder.restaurant._id,
      restaurantName: groupOrder.restaurant.name,
      items: orderItems,
      totalAmount,
      deliveryAddress: deliveryAddress || req.user.address || "Main Campus Hostel",
      paymentMethod: "Cash on Delivery",
      status: "Pending",
      groupOrder: groupOrder._id,
    });

    // Update group order room status to locked/confirmed
    groupOrder.status = "confirmed";
    groupOrder.combinedOrder = combinedOrder._id;
    await groupOrder.save();

    res.json({
      message: "Group order confirmed successfully!",
      groupOrder,
      order: combinedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGroupRoom,
  getGroupRoom,
  joinGroupRoom,
  addMemberItem,
  removeMemberItem,
  updateMemberItemQuantity,
  toggleLockGroupRoom,
  confirmGroupOrder,
};
