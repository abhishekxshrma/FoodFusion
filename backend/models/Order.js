const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodItem",
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  addedBy: { type: String, default: "Customer" },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
  type: String,
  unique: true,
  default: () => "ORD-" + Date.now(),
},
    orderType: {
      type: String,
      enum: ["individual", "group"],
      default: "individual",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: {
      type: String,
      default: "",
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    restaurantName: {
      type: String,
      default: "",
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
    groupOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupOrder",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
