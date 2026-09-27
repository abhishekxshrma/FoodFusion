const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add a food item name"],
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Please add price"],
    },
    category: {
      type: String,
      default: "Main Course",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodItem", foodItemSchema);
