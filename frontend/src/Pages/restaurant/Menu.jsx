import { useState } from "react";
import { Link } from "react-router-dom";

function RestaurantMenu() {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Paneer Tikka",
      category: "Starters",
      price: 180,
      available: true,
    },
    {
      id: 2,
      name: "Veg Biryani",
      category: "Main Course",
      price: 220,
      available: true,
    },
    {
      id: 3,
      name: "Butter Naan",
      category: "Breads",
      price: 50,
      available: true,
    },
    {
      id: 4,
      name: "Dal Makhani",
      category: "Main Course",
      price: 160,
      available: false,
    },
    {
      id: 5,
      name: "Gulab Jamun",
      category: "Desserts",
      price: 90,
      available: true,
    },
  ]);

  const toggleAvailability = (id) => {
    setMenuItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, available: !item.available }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setMenuItems((items) =>
      items.filter((item) => item.id !== id)
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1>Menu Management</h1>
          <p>
            Manage your restaurant's food items and availability.
          </p>
        </div>

        <Link to="/restaurant/add-food">
          <button className="add-food-btn">Add New Food</button>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {menuItems.map((item) => (
          <div key={item.id} className="dashboard-card">
            <h2>{item.name}</h2>

            <p style={{ color: "#64748b", margin: "4px 0 10px" }}>
              {item.category}
            </p>

            <h3 style={{ color: "#e85d04", margin: "0 0 10px" }}>₹{item.price}</h3>

            <p style={{ marginBottom: "15px" }}>
              Status:{" "}
              <strong style={{ color: item.available ? "#16803c" : "#dc2626" }}>
                {item.available
                  ? "Available"
                  : "Unavailable"}
              </strong>
            </p>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="secondary-btn"
                onClick={() => toggleAvailability(item.id)}
              >
                {item.available
                  ? "Mark Unavailable"
                  : "Mark Available"}
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteItem(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <p>No menu items available.</p>
      )}
    </div>
  );
}

export default RestaurantMenu;