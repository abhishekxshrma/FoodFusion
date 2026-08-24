import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddFood() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "Main Course",
    price: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.description
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    alert(`${formData.name} added successfully!`);

    navigate("/restaurant/menu");
  };

  return (
    <div>
      <h1>Add New Food</h1>

      <p>Add a new item to your restaurant menu.</p>

      <form
        onSubmit={handleSubmit}
        className="dashboard-card"
        style={{
          maxWidth: "600px",
          marginTop: "25px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label>Food Name</label>

          <input
            type="text"
            name="name"
            placeholder="e.g. Paneer Tikka"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option>Starters</option>
            <option>Main Course</option>
            <option>Breads</option>
            <option>Desserts</option>
            <option>Beverages</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Price</label>

          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Description</label>

          <textarea
            name="description"
            placeholder="Describe the dish..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Image URL</label>

          <input
            type="text"
            name="image"
            placeholder="Paste image URL"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="add-food-btn">
          Add Food
        </button>

        <button
          type="button"
          onClick={() => navigate("/restaurant/menu")}
          className="cancel-btn"
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddFood;