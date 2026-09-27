import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import RestrauntCard from "../../components/RestrauntCard";
import "./Restaurants.css";

function Restaurants() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [userCoords, setUserCoords] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();

      if (userCoords) {
        params.lat = userCoords.lat;
        params.lng = userCoords.lng;
      } else if (location && location !== "All") {
        params.location = location;
      }

      const data = await api.restaurants.getAll(params);
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading restaurants:", error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [search, location, userCoords]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchRestaurants]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by your browser. Please select an area manually.");
      return;
    }

    setLocationLoading(true);
    setLocationMessage("Locating you...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        setLocation("All");
        setLocationLoading(false);
        setLocationMessage("Showing restaurants that deliver to your current location.");
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setLocationLoading(false);
        setUserCoords(null);
        setLocationMessage("Location permission denied. Please choose your area manually below.");
      },
      { timeout: 10000 }
    );
  };

  const handleClearLocation = () => {
    setUserCoords(null);
    setLocationMessage("");
    setLocation("All");
  };

  return (
    <div className="restaurants-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: "0 0 6px" }}>Browse Restaurants</h1>
          <p style={{ margin: 0, color: "#666" }}>Discover verified restaurants delivering to your campus location.</p>
        </div>

        {/* Location Detection Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!userCoords ? (
            <button
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
              className="primary-btn"
              style={{
                backgroundColor: "#2563eb",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              📍 {locationLoading ? "Detecting Location..." : "Use My Current Location"}
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                📍 Using Current GPS Location
              </span>
              <button
                onClick={handleClearLocation}
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #ccc",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {locationMessage && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "6px",
            marginBottom: "20px",
            backgroundColor: userCoords ? "#f0fdf4" : "#fef3c7",
            border: `1px solid ${userCoords ? "#86efac" : "#fcd34d"}`,
            color: userCoords ? "#166534" : "#92400e",
            fontSize: "14px",
          }}
        >
          {locationMessage}
        </div>
      )}

      {/* Search and Area Filters */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="search-input"
          type="text"
          placeholder="Search restaurants or cuisine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "240px", marginBottom: 0 }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontWeight: "600", fontSize: "14px", color: "#444" }}>Manual Area:</label>
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setUserCoords(null);
              setLocationMessage("");
            }}
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="All">All Areas</option>
            <option value="North Campus">North Campus</option>
            <option value="South Campus">South Campus</option>
            <option value="Main Market">Main Market</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", padding: "30px" }}>Loading available restaurants from database...</p>
      ) : (
        <div className="restaurant-grid">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestrauntCard
                key={restaurant._id || restaurant.id}
                restaurant={restaurant}
              />
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#666", padding: "40px" }}>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#444" }}>
                No restaurants found matching your location or criteria.
              </p>
              <p style={{ fontSize: "14px", marginTop: "6px" }}>
                Try selecting "All Areas" or adjusting your search term.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Restaurants;
