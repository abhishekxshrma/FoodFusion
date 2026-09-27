import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";

function AddFood() {
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState("");
  const [noRestaurant, setNoRestaurant] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Main Course",
    price: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const rest = await api.restaurants.getMyRestaurant();
        if (rest) {
          setRestaurantId(rest._id || rest.id);
        } else {
          setNoRestaurant(true);
        }
      } catch (err) {
        console.error(err);
        setNoRestaurant(true);
      }
    };
    fetchRestaurant();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price) {
      alert("Please enter food name and price.");
      return;
    }

    setLoading(true);

    try {
      await api.food.add({
        ...(restaurantId ? { restaurantId } : {}),
        ...formData,
      });

      alert(`${formData.name} added successfully to menu!`);
      navigate("/restaurant/menu");
    } catch (err) {
      setError(err.message || "Failed to add food item");
    } finally {
      setLoading(false);
    }
  };

  if (noRestaurant) {
    return (
      <div>
        <h1>Add New Food Item</h1>
        <div className="dashboard-card" style={{ backgroundColor: "#fef3c7", border: "1px solid #f59e0b", padding: "20px", marginTop: "20px" }}>
          <h3 style={{ margin: "0 0 8px", color: "#92400e" }}>⚠️ No Restaurant Profile Found</h3>
          <p style={{ margin: "0 0 15px", color: "#b45309" }}>
            You need to create your restaurant profile before you can add food items.
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
      <h1>Add New Food Item</h1>

      <p>Add a new dish to your restaurant menu.</p>

      {error && (
        <div style={{ padding: "10px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "6px", margin: "15px 0", maxWidth: "600px" }}>
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="dashboard-card"
        style={{
          maxWidth: "600px",
          marginTop: "25px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Food Name</label>

          <input
            type="text"
            name="name"
            placeholder="e.g. Paneer Tikka"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", background: "#fff" }}
          >
            <option>Starters</option>
            <option>Main Course</option>
            <option>Breads</option>
            <option>Desserts</option>
            <option>Beverages</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Price (₹)</label>

          <input
            type="number"
            name="price"
            placeholder="Enter price e.g. 180"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Description</label>

          <textarea
            name="description"
            placeholder="Describe ingredients or taste profile..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Image URL</label>

          <input
            type="text"
            name="image"
            placeholder="Paste image URL (optional)"
            value={formData.image}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <button type="submit" className="add-food-btn" disabled={loading} style={{ cursor: "pointer" }}>
          {loading ? "Adding..." : "Add Food Item"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/restaurant/menu")}
          className="cancel-btn"
          style={{ marginLeft: "10px", cursor: "pointer" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddFood;