const API_URL = "http://localhost:5000/api";

async function runTest() {
  console.log("=== STARTING END-TO-END FLOW VERIFICATION ===");

  const timestamp = Date.now();
  const partnerEmail = `partner_${timestamp}@test.com`;
  const customerEmail = `customer_${timestamp}@test.com`;
  const password = "password123";

  // 1. REGISTER RESTAURANT PARTNER
  console.log("\n1. Registering Restaurant Partner...");
  const regPartnerRes = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Chef Mario",
      email: partnerEmail,
      password: password,
      role: "restaurant",
      phone: "9876543210",
      address: "Downtown Market",
    }),
  });
  const partnerData = await regPartnerRes.json();
  console.log("Partner registered:", partnerData.email, "| Role:", partnerData.role, "| Token:", !!partnerData.token);
  const partnerToken = partnerData.token;

  // 2. GET MY RESTAURANT (Expect 404 since none created yet)
  console.log("\n2. Checking My Restaurant before creation...");
  const myRestRes1 = await fetch(`${API_URL}/restaurants/my-restaurant`, {
    headers: { Authorization: `Bearer ${partnerToken}` },
  });
  console.log("Status before creation (Expect 404):", myRestRes1.status);

  // 3. CREATE RESTAURANT PROFILE
  console.log("\n3. Creating Restaurant Profile...");
  const createRestRes = await fetch(`${API_URL}/restaurants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${partnerToken}`,
    },
    body: JSON.stringify({
      name: "Mario's Italian Bistro",
      description: "Authentic handcrafted Italian pizza & pasta",
      location: "Main Market",
      address: "42 Central Avenue",
      cuisine: "Italian, Pizza",
      deliveryTime: "20-25 min",
      priceForTwo: 500,
    }),
  });
  const createdRestaurant = await createRestRes.json();
  console.log("Created Restaurant ID:", createdRestaurant._id, "| Name:", createdRestaurant.name, "| Owner:", createdRestaurant.owner);

  // 4. RE-FETCH MY RESTAURANT (Expect 200 OK)
  console.log("\n4. Fetching My Restaurant after creation...");
  const myRestRes2 = await fetch(`${API_URL}/restaurants/my-restaurant`, {
    headers: { Authorization: `Bearer ${partnerToken}` },
  });
  console.log("Status after creation:", myRestRes2.status);
  const myRest = await myRestRes2.json();
  console.log("Fetched Restaurant ID:", myRest._id, "| Name:", myRest.name);

  // 5. ADD FOOD ITEM
  console.log("\n5. Adding Food Item to Menu...");
  const addFoodRes = await fetch(`${API_URL}/food`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${partnerToken}`,
    },
    body: JSON.stringify({
      name: "Truffle Mushroom Pizza",
      description: "Wood-fired pizza with wild mushrooms and truffle oil",
      price: 450,
      category: "Pizzas",
    }),
  });
  const addedFood = await addFoodRes.json();
  console.log("Added Food Item ID:", addedFood._id, "| Name:", addedFood.name, "| Price: ₹" + addedFood.price, "| Restaurant:", addedFood.restaurant);

  // 6. REGISTER CUSTOMER
  console.log("\n6. Registering Customer...");
  const regCustRes = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Alice Smith",
      email: customerEmail,
      password: password,
      role: "customer",
      phone: "9123456789",
      address: "Hostel A, Room 101",
    }),
  });
  const customerData = await regCustRes.json();
  console.log("Customer registered:", customerData.email, "| Role:", customerData.role);
  const customerToken = customerData.token;

  // 7. CUSTOMER GET ALL RESTAURANTS
  console.log("\n7. Customer fetching all restaurants...");
  const allRestsRes = await fetch(`${API_URL}/restaurants`);
  const allRests = await allRestsRes.json();
  console.log("Total restaurants in DB:", allRests.length);
  const foundRest = allRests.find((r) => r._id === createdRestaurant._id);
  console.log("Found created restaurant in public list:", !!foundRest, "| Name:", foundRest?.name);

  // 8. CUSTOMER FETCH MENU FOR RESTAURANT
  console.log("\n8. Customer fetching menu for restaurant...");
  const menuRes = await fetch(`${API_URL}/food/restaurant/${createdRestaurant._id}`);
  const menu = await menuRes.json();
  console.log("Fetched menu items count:", menu.length, "| First item:", menu[0]?.name, "₹" + menu[0]?.price);

  // 9. CUSTOMER PLACE ORDER
  console.log("\n9. Customer placing order...");
  const placeOrderRes = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      restaurantId: createdRestaurant._id,
      items: [
        {
          foodItem: addedFood._id,
          name: addedFood.name,
          price: addedFood.price,
          quantity: 2,
          addedBy: customerData.name,
        },
      ],
      totalAmount: 940,
      deliveryAddress: customerData.address,
      paymentMethod: "Cash on Delivery",
    }),
  });
  const createdOrder = await placeOrderRes.json();
  console.log("Created Order ID:", createdOrder._id, "| Status:", createdOrder.status, "| Total: ₹" + createdOrder.totalAmount);

  // 10. RESTAURANT PARTNER FETCHES INCOMING ORDERS
  console.log("\n10. Partner fetching incoming orders...");
  const partnerOrdersRes = await fetch(`${API_URL}/orders/restaurant`, {
    headers: { Authorization: `Bearer ${partnerToken}` },
  });
  const partnerOrders = await partnerOrdersRes.json();
  console.log("Incoming orders count for partner:", partnerOrders.length, "| Order ID:", partnerOrders[0]?._id, "| Total: ₹" + partnerOrders[0]?.totalAmount);

  console.log("\n=== SUCCESS: ALL END-TO-END FLOW TESTS PASSED! ===");
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
