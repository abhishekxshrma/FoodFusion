import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

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
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h1>Your Cart is Empty</h1>

          <p>
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link to="/restaurants" className="browse-btn">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">

        <div className="cart-header">
          <div>
            <h1>Your Cart</h1>
            <p>
              {cart.reduce(
                (total, item) => total + item.quantity,
                0
              )}{" "}
              items in your cart
            </p>
          </div>

          <Link to="/restaurants" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </div>

        <div className="cart-content">

          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>

                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  <p className="restaurant-name">
                    {item.restaurantName}
                  </p>

                  <p className="item-price">
                    ₹{item.price}
                  </p>
                </div>

                <div className="quantity-control">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  ₹{item.price * item.quantity}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>

              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹40</span>
            </div>

            <div className="summary-row">
              <span>Taxes</span>
              <span>₹{Math.round(total * 0.05)}</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <span>
                ₹{total + 40 + Math.round(total * 0.05)}
              </span>
            </div>

            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;