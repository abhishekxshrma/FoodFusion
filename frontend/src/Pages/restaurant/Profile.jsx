import { useState } from "react";

function RestaurantProfile() {
  const [restaurant, setRestaurant] = useState({
    name: "Food Palace",
    owner: "Rahul Sharma",
    email: "foodpalace@example.com",
    phone: "+91 98765 43210",
    address: "Sector 12, Chandigarh",
    cuisine: "North Indian, Chinese",
    openingTime: "10:00 AM",
    closingTime: "11:00 PM",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setRestaurant({
      ...restaurant,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div>
      <h1>Restaurant Profile</h1>
      <p>
        Manage your restaurant information and business details.
      </p>

      {saved && (
        <div className="alert-success" style={{ marginTop: "20px" }}>
          ✓ Restaurant profile updated successfully!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="dashboard-card"
        style={{
          maxWidth: "700px",
          marginTop: "25px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label>Restaurant Name</label>

          <input
            name="name"
            value={restaurant.name}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Owner Name</label>

          <input
            name="owner"
            value={restaurant.owner}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={restaurant.email}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Phone</label>

          <input
            name="phone"
            value={restaurant.phone}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Address</label>

          <textarea
            name="address"
            value={restaurant.address}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Cuisine</label>

          <input
            name="cuisine"
            value={restaurant.cuisine}
            onChange={handleChange}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <label>Opening Time</label>

            <input
              name="openingTime"
              value={restaurant.openingTime}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Closing Time</label>

            <input
              name="closingTime"
              value={restaurant.closingTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="save-btn"
          style={{ marginTop: "25px" }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default RestaurantProfile;