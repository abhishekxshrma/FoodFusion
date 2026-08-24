import { Link } from "react-router-dom";

function RestrauntCard({ restaurant }) {
  return (
    <div>
      <img
        src={restaurant.image}
        alt={restaurant.name}
        width="200"
      />

      <h2>{restaurant.name}</h2>

      <p>{restaurant.cuisine}</p>

      <p>{restaurant.rating}</p>

      <p>Delivery: {restaurant.deliveryTime}</p>

      <p>₹{restaurant.priceForTwo} for two</p>

      <Link to={`/restaurant/${restaurant.id}`}>
        View Menu
      </Link>
    </div>
  );
}

export default RestrauntCard;