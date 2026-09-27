import { Link } from "react-router-dom";
import "./RestrauntCard.css";

function RestrauntCard({ restaurant }) {
  const id = restaurant._id || restaurant.id;
  return (
    <div className="restaurant-card">
      <img
        src={restaurant.image}
        alt={restaurant.name}
      />

      <div className="restaurant-card-content">
        <h3>{restaurant.name}</h3>

        <p className="cuisine">
          {restaurant.cuisine}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: "4px 0" }}>⭐ {restaurant.rating || 4.5}</p>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "600",
              padding: "2px 8px",
              borderRadius: "4px",
              backgroundColor: restaurant.isAvailable !== false ? "#dcfce7" : "#fee2e2",
              color: restaurant.isAvailable !== false ? "#166534" : "#991b1b",
            }}
          >
            {restaurant.isAvailable !== false ? "Open" : "Closed"}
          </span>
        </div>

        <p>🕐 {restaurant.deliveryTime || "25-30 min"}</p>

        <p>₹{restaurant.priceForTwo || 400} for two</p>

        <p style={{ fontSize: "13px", color: "#666", margin: "4px 0" }}>
          📍 {restaurant.location || restaurant.city || "Campus Area"}
          {restaurant.distance != null && (
            <span style={{ fontWeight: "600", color: "#e85d04", marginLeft: "6px" }}>
              ({restaurant.distance} km)
            </span>
          )}
        </p>

        <Link
          to={`/restaurants/${id}`}
          className="view-menu"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}

export default RestrauntCard;