import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    total,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div>
        <h1>Your Cart is Empty</h1>

        <p>Add some delicious food to get started.</p>

        <Link to="/restaurants">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Cart</h1>

      {cart.map((item) => (
        <div key={item.id}>
          <img
            src={item.image}
            alt={item.name}
            width="120"
          />

          <h3>{item.name}</h3>

          <p>{item.restaurantName}</p>

          <p>₹{item.price}</p>

          <button onClick={() => decreaseQuantity(item.id)}>
            -
          </button>

          <span> {item.quantity} </span>

          <button onClick={() => increaseQuantity(item.id)}>
            +
          </button>

          <button onClick={() => removeFromCart(item.id)}>
            Remove
          </button>

          <hr />
        </div>
      ))}

      <h2>Total: ₹{total}</h2>

      <Link to="/checkout">
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default Cart;