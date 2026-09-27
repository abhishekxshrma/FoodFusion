const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a restaurant name"],
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    latitude: {
      type: Number,
      default: 28.6946,
    },
    longitude: {
      type: Number,
      default: 77.2084,
    },
    deliveryRadius: {
      type: Number,
      default: 15, // in kilometers
    },
    cuisine: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    deliveryTime: {
      type: String,
      default: "25-30 min",
    },
    priceForTwo: {
      type: Number,
      default: 400,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    },
    // Restaurant partner contact info (populated on signup)
    ownerName: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    contactPhone: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
