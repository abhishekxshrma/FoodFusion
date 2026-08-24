import { Link } from "react-router-dom";
import "./RestrauntCard.css";

function RestrauntCard({ restaurant }) {
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

        <p>⭐ {restaurant.rating}</p>

        <p>🕐 {restaurant.deliveryTime}</p>

        <p>₹{restaurant.priceForTwo} for two</p>

        <Link
          to={`/restaurant/${restaurant.id}`}
          className="view-menu"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}

export default RestrauntCard;