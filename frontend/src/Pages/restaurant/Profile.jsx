import { useState, useEffect } from "react";
import { api } from "../../services/api";

function RestaurantProfile() {
  const [restaurantId, setRestaurantId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [restaurant, setRestaurant] = useState({
    name: "",
    location: "North Campus",
    city: "Delhi",
    address: "",
    cuisine: "",
    description: "",
    deliveryTime: "25-30 min",
    priceForTwo: 400,
    deliveryRadius: 15,
    latitude: 28.6946,
    longitude: 77.2084,
    isAvailable: true,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.restaurants.getMyRestaurant();
        if (data) {
          setRestaurantId(data._id || data.id);
          setIsCreating(false);
          setRestaurant({
            name: data.name || "",
            location: data.location || "North Campus",
            city: data.city || "Delhi",
            address: data.address || "",
            cuisine: data.cuisine || "",
            description: data.description || "",
            deliveryTime: data.deliveryTime || "25-30 min",
            priceForTwo: data.priceForTwo || 400,
            deliveryRadius: data.deliveryRadius || 15,
            latitude: data.latitude ?? 28.6946,
            longitude: data.longitude ?? 77.2084,
            isAvailable: data.isAvailable !== false,
          });
        }
      } catch {
        setIsCreating(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRestaurant({
      ...restaurant,
      [name]: type === "checkbox" ? checked : value,
    });
    setSaved(false);
  };

  const handleDetectCoords = () => {
    if (!navigator.geolocation) {
      setGeoStatus("Geolocation is not supported by your browser.");
      return;
    }
    setGeoStatus("Detecting restaurant coordinates...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setRestaurant((prev) => ({
          ...prev,
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
        }));
        setGeoStatus("✓ GPS Coordinates detected!");
      },
      (err) => {
        console.warn(err);
        setGeoStatus("Could not detect coordinates. Permission denied.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      if (isCreating || !restaurantId) {
        const created = await api.restaurants.create(restaurant);
        setRestaurantId(created._id || created.id);
        setIsCreating(false);
        alert("Restaurant profile created successfully!");
      } else {
        await api.restaurants.update(restaurantId, restaurant);
      }
      setSaved(true);
    } catch (err) {
      alert(err.message || "Failed to save restaurant profile");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading restaurant profile...</p>;
  }

  return (
    <div>
      <h1>{isCreating ? "Create Restaurant Profile" : "Restaurant Partner Profile"}</h1>
      <p>
        {isCreating
          ? "Fill out your restaurant details to start accepting orders on FoodFusion."
          : "Manage your restaurant details, location coordinates, delivery radius, and store status."}
      </p>

      {saved && (
        <div className="alert-success" style={{ marginTop: "20px", padding: "12px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "6px", maxWidth: "700px" }}>
          ✓ Restaurant profile saved successfully!
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
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Restaurant Name</label>
          <input
            name="name"
            value={restaurant.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        {/* Store Open/Closed Toggle */}
        <div style={{ marginBottom: "20px", background: restaurant.isAvailable ? "#f0fdf4" : "#fef2f2", border: `1px solid ${restaurant.isAvailable ? "#86efac" : "#fca5a5"}`, padding: "12px 16px", borderRadius: "6px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "600", fontSize: "15px" }}>
            <input
              type="checkbox"
              name="isAvailable"
              checked={restaurant.isAvailable}
              onChange={handleChange}
              style={{ width: "18px", height: "18px" }}
            />
            Restaurant Status: {restaurant.isAvailable ? "🟢 OPEN (Accepting Orders)" : "🔴 CLOSED (Temporarily Unavailable)"}
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Location Area</label>
            <select
              name="location"
              value={restaurant.location}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", background: "#fff" }}
            >
              <option value="North Campus">North Campus</option>
              <option value="South Campus">South Campus</option>
              <option value="Main Market">Main Market</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>City</label>
            <input
              name="city"
              value={restaurant.city}
              placeholder="e.g. Delhi"
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Cuisine Types</label>
          <input
            name="cuisine"
            placeholder="e.g. North Indian, Fast Food, Chinese"
            value={restaurant.cuisine}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Description</label>
          <textarea
            name="description"
            value={restaurant.description}
            onChange={handleChange}
            placeholder="Tell customers about your kitchen and signature items..."
            rows="3"
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Complete Address</label>
          <textarea
            name="address"
            value={restaurant.address}
            onChange={handleChange}
            rows="2"
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Delivery Time</label>
            <input
              name="deliveryTime"
              value={restaurant.deliveryTime}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Price For Two (₹)</label>
            <input
              type="number"
              name="priceForTwo"
              value={restaurant.priceForTwo}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Delivery Radius (km)</label>
            <input
              type="number"
              name="deliveryRadius"
              value={restaurant.deliveryRadius}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>
        </div>

        {/* GPS Coordinates Section */}
        <div style={{ marginBottom: "20px", background: "#f8fafc", padding: "15px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label style={{ fontWeight: "600", fontSize: "14px", margin: 0 }}>📍 GPS Location Coordinates</label>
            <button
              type="button"
              onClick={handleDetectCoords}
              style={{ background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
            >
              Detect Current GPS
            </button>
          </div>
          {geoStatus && <p style={{ fontSize: "12px", color: geoStatus.includes("✓") ? "#16a34a" : "#b45309", margin: "4px 0" }}>{geoStatus}</p>}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <input
              type="number"
              step="any"
              name="latitude"
              placeholder="Latitude"
              value={restaurant.latitude ?? ""}
              onChange={handleChange}
              style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }}
            />
            <input
              type="number"
              step="any"
              name="longitude"
              placeholder="Longitude"
              value={restaurant.longitude ?? ""}
              onChange={handleChange}
              style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="save-btn"
          disabled={saveLoading}
          style={{ marginTop: "10px", cursor: "pointer" }}
        >
          {saveLoading ? "Saving..." : "Save Restaurant Changes"}
        </button>
      </form>
    </div>
  );
}

export default RestaurantProfile;