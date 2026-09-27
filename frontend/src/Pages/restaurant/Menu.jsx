import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function RestaurantMenu() {
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noRestaurant, setNoRestaurant] = useState(false);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "Main Course",
    price: "",
    description: "",
    image: "",
    isAvailable: true,
  });
  const [editLoading, setEditLoading] = useState(false);

  const fetchMenu = async () => {
    try {
      let rest;
      try {
        rest = await api.restaurants.getMyRestaurant();
        setRestaurant(rest);
      } catch {
        setNoRestaurant(true);
        setLoading(false);
        return;
      }

      if (rest) {
        const items = await api.food.getMenu(rest._id || rest.id);
        setMenuItems(Array.isArray(items) ? items : []);
      }
    } catch (err) {
      console.error("Menu fetch error:", err);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleToggleAvailability = async (id) => {
    try {
      await api.food.toggleAvailability(id);
      fetchMenu();
    } catch (err) {
      alert(err.message || "Failed to update food availability");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;
    try {
      await api.food.delete(id);
      fetchMenu();
    } catch (err) {
      alert(err.message || "Failed to delete food item");
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name || "",
      category: item.category || "Main Course",
      price: item.price || "",
      description: item.description || "",
      image: item.image || "",
      isAvailable: item.isAvailable !== false,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setEditLoading(true);

    try {
      await api.food.update(editingItem._id || editingItem.id, editFormData);
      setEditingItem(null);
      fetchMenu();
    } catch (err) {
      alert(err.message || "Failed to update food item");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading restaurant menu...</p>;
  }

  if (noRestaurant) {
    return (
      <div>
        <h1>Menu Management</h1>
        <div className="dashboard-card" style={{ backgroundColor: "#fef3c7", border: "1px solid #f59e0b", padding: "20px", marginTop: "20px" }}>
          <h3 style={{ margin: "0 0 8px", color: "#92400e" }}>⚠️ No Restaurant Profile Found</h3>
          <p style={{ margin: "0 0 15px", color: "#b45309" }}>
            You need to create your restaurant profile before you can add or manage menu items.
          </p>
          <Link to="/restaurant/profile" className="primary-btn">
            Create Restaurant Profile
          </Link>
        </div>
      </div>
    );
  }

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
            Restaurant: <strong>{restaurant?.name || "Spice Garden"}</strong> ({restaurant?.cuisine || "North Indian"})
          </p>
        </div>

        <Link to="/restaurant/add-food">
          <button className="add-food-btn">➕ Add New Food</button>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {menuItems.map((item) => {
          const itemId = item._id || item.id;
          const isAvail = item.isAvailable !== undefined ? item.isAvailable : item.available;

          return (
            <div key={itemId} className="dashboard-card" style={{ display: "flex", flexDirection: "column" }}>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "6px", marginBottom: "12px" }}
                />
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h2 style={{ margin: 0 }}>{item.name}</h2>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: isAvail ? "#dcfce7" : "#fee2e2",
                    color: isAvail ? "#166534" : "#991b1b",
                  }}
                >
                  {isAvail ? "Available" : "Unavailable"}
                </span>
              </div>

              <p style={{ color: "#64748b", margin: "4px 0 8px", fontSize: "14px" }}>
                Category: {item.category || "Main Course"}
              </p>

              {item.description && (
                <p style={{ color: "#555", fontSize: "13px", margin: "0 0 10px", flex: 1 }}>
                  {item.description}
                </p>
              )}

              <h3 style={{ color: "#e85d04", margin: "0 0 12px" }}>₹{item.price}</h3>

              <div style={{ display: "flex", gap: "6px", marginTop: "auto", flexWrap: "wrap" }}>
                <button
                  className="secondary-btn"
                  onClick={() => handleOpenEdit(item)}
                  style={{ flex: 1, padding: "6px 10px", fontSize: "13px" }}
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleToggleAvailability(itemId)}
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    fontSize: "12px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: isAvail ? "#fef3c7" : "#dcfce7",
                    color: isAvail ? "#92400e" : "#166534",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {isAvail ? "Make Offline" : "Make Online"}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteItem(itemId)}
                  style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {menuItems.length === 0 && (
        <p style={{ padding: "40px 0", color: "#666" }}>No food items added yet to menu.</p>
      )}

      {/* Edit Food Item Modal */}
      {editingItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            className="dashboard-card"
            style={{
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h2 style={{ margin: 0 }}>Edit Food Item</h2>
              <button
                onClick={() => setEditingItem(null)}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "14px" }}>Item Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "14px" }}>Category</label>
                <select
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff" }}
                >
                  <option>Starters</option>
                  <option>Main Course</option>
                  <option>Breads</option>
                  <option>Desserts</option>
                  <option>Beverages</option>
                  <option>Pizzas</option>
                  <option>Burgers</option>
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "14px" }}>Price (₹)</label>
                <input
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "14px" }}>Description</label>
                <textarea
                  rows="3"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600", fontSize: "14px" }}>Image URL</label>
                <input
                  type="text"
                  value={editFormData.image}
                  onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                  <input
                    type="checkbox"
                    checked={editFormData.isAvailable}
                    onChange={(e) => setEditFormData({ ...editFormData, isAvailable: e.target.checked })}
                    style={{ width: "16px", height: "16px" }}
                  />
                  Item Available in Menu
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  style={{ padding: "8px 16px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={editLoading}
                  style={{ cursor: "pointer" }}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantMenu;