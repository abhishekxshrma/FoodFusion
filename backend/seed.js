const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Restaurant = require("./models/Restaurant");
const FoodItem = require("./models/FoodItem");
const Order = require("./models/Order");
const GroupOrder = require("./models/GroupOrder");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodfusion"
    );
    console.log("MongoDB Connected for Seeding...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing collection data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();
    await Order.deleteMany();
    await GroupOrder.deleteMany();

    console.log("Cleared existing database records.");

    // 1. Create Users
    const customer = await User.create({
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      password: "password123",
      role: "customer",
      phone: "+91 9876543210",
      address: "Hostel Block B, Room 204, Campus",
      city: "Delhi",
      latitude: 28.6920,
      longitude: 77.2075,
    });

    const partner = await User.create({
      name: "Spice Garden Owner",
      email: "spice@foodfusion.com",
      password: "password123",
      role: "restaurant",
      phone: "+91 9123456789",
      address: "College Road, Near Main Gate",
      city: "Delhi",
      latitude: 28.6946,
      longitude: 77.2084,
      restaurantName: "Spice Garden",
      ownerName: "Spice Garden Owner",
    });

    const admin = await User.create({
      name: "System Admin",
      email: "admin@foodfusion.com",
      password: "adminpassword",
      role: "admin",
      phone: "+91 9999999999",
      address: "FoodFusion Admin Office",
      city: "Delhi",
      latitude: 28.6139,
      longitude: 77.2090,
    });

    console.log("Users Seeded successfully.");

    // 2. Create Restaurants
    const r1 = await Restaurant.create({
      name: "Spice Garden",
      description: "Authentic North Indian & Tandoori Delights",
      location: "North Campus",
      address: "12 College Road, North Campus",
      city: "Delhi",
      latitude: 28.6946,
      longitude: 77.2084,
      deliveryRadius: 15,
      cuisine: "North Indian, Tandoori",
      rating: 4.6,
      deliveryTime: "25-30 min",
      priceForTwo: 450,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      owner: partner._id,
      isAvailable: true,
    });

    const r2 = await Restaurant.create({
      name: "Pizza Hub",
      description: "Wood-fired Artisanal Pizzas and Pastas",
      location: "South Campus",
      address: "45 University Avenue, South Campus",
      city: "Delhi",
      latitude: 28.5843,
      longitude: 77.1638,
      deliveryRadius: 12,
      cuisine: "Pizza, Italian",
      rating: 4.4,
      deliveryTime: "20-25 min",
      priceForTwo: 500,
      image: "https://images.unsplash.com/photo-1579751626657-72bc17010498",
      owner: partner._id,
      isAvailable: true,
    });

    const r3 = await Restaurant.create({
      name: "Burger House",
      description: "Juicy handcrafted burgers and crispy fries",
      location: "Main Market",
      address: "88 Commercial Complex, Main Market",
      city: "Delhi",
      latitude: 28.6506,
      longitude: 77.2300,
      deliveryRadius: 10,
      cuisine: "Burgers, Fast Food",
      rating: 4.5,
      deliveryTime: "20-25 min",
      priceForTwo: 350,
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add",
      owner: partner._id,
      isAvailable: true,
    });

    const r4 = await Restaurant.create({
      name: "Royal Biryani",
      description: "Hyderabadi & Lucknowi Dum Biryanis",
      location: "North Campus",
      address: "04 Food Court Street, North Campus",
      city: "Delhi",
      latitude: 28.6980,
      longitude: 77.2050,
      deliveryRadius: 15,
      cuisine: "Biryani, Mughlai",
      rating: 4.8,
      deliveryTime: "30-35 min",
      priceForTwo: 550,
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96c",
      owner: partner._id,
      isAvailable: true,
    });

    console.log("Restaurants Seeded successfully.");

    // 3. Create Food Items for Spice Garden
    const f1 = await FoodItem.create({
      restaurant: r1._id,
      name: "Paneer Tikka",
      description: "Marinated paneer cubes grilled in clay oven",
      price: 180,
      category: "Starters",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8",
      isAvailable: true,
    });

    const f2 = await FoodItem.create({
      restaurant: r1._id,
      name: "Butter Chicken",
      description: "Tender chicken in rich creamy tomato gravy",
      price: 280,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db",
      isAvailable: true,
    });

    const f3 = await FoodItem.create({
      restaurant: r1._id,
      name: "Veg Biryani",
      description: "Fragrant basmati rice cooked with fresh vegetables and spices",
      price: 220,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96c",
      isAvailable: true,
    });

    const f4 = await FoodItem.create({
      restaurant: r1._id,
      name: "Butter Naan",
      description: "Soft Indian bread brushed with melted butter",
      price: 50,
      category: "Breads",
      image: "https://images.unsplash.com/photo-1626074353765-517a681e40be",
      isAvailable: true,
    });

    // Food items for Pizza Hub
    await FoodItem.create({
      restaurant: r2._id,
      name: "Margherita Pizza",
      description: "Classic tomato sauce, fresh mozzarella & basil",
      price: 299,
      category: "Pizzas",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
      isAvailable: true,
    });

    await FoodItem.create({
      restaurant: r2._id,
      name: "Peppy Paneer Pizza",
      description: "Paneer, crisp capsicum, and red paprika",
      price: 389,
      category: "Pizzas",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
      isAvailable: true,
    });

    console.log("Food Items Seeded successfully.");

    // 4. Create Sample Orders
    await Order.create({
      orderType: "individual",
      customer: customer._id,
      customerName: customer.name,
      restaurant: r1._id,
      restaurantName: r1.name,
      items: [
        { foodItem: f1._id, name: f1.name, price: f1.price, quantity: 1, addedBy: customer.name },
        { foodItem: f4._id, name: f4.name, price: f4.price, quantity: 2, addedBy: customer.name },
      ],
      totalAmount: 280,
      deliveryAddress: customer.address,
      paymentMethod: "Cash on Delivery",
      status: "Preparing",
    });

    console.log("Sample Order Seeded successfully.");
    console.log("--- SEEDING COMPLETED SUCCESSFULLY ---");
    process.exit(0);
  } catch (err) {
    console.error("Error Seeding Database:", err);
    process.exit(1);
  }
};

seedData();
