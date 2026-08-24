import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import restaurants from "../data/restaurants";
import food from "../data/food";

function RestaurantDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const restaurant = restaurants.find(
    (restaurant) => restaurant.id === Number(id)
  );

  if (!restaurant) {
    return (
      <div>
        <h1>Restaurant not found</h1>
        <Link to="/restaurants">Back to Restaurants</Link>
      </div>
    );
  }

  const menu = food.filter(
    (item) => item.restaurantId === restaurant.id
  );

  return (
    <div>
      <h1>{restaurant.name}</h1>

      <p>{restaurant.cuisine}</p>
      <p>{restaurant.rating}</p>
      <p>{restaurant.deliveryTime}</p>

      <hr />

      <h2>Menu</h2>

      {menu.map((item) => (
        <div key={item.id}>
          <img
            src={item.image}
            alt={item.name}
            width="150"
          />

          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>₹{item.price}</p>

          <button onClick={() => addToCart(item, restaurant)}>
            Add to Cart
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default RestaurantDetails;