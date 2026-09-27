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

  const itemCount = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const tax = Math.round(total * 0.05);
  const finalTotal = total + 40 + tax;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h1>Your Cart is Empty</h1>
          <p>Looks like you haven't added anything to your cart yet.</p>

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

        {/* HEADER */}
        <div className="cart-header">
          <div>
            <h1>Your Cart</h1>
            <p>{itemCount} items in your cart</p>
          </div>

          <Link to="/restaurants" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </div>

        {/* CONTENT */}
        <div className="cart-content">

          {/* CART ITEMS */}
          <div className="cart-items">
            {cart.map((item) => {
              const itemId = item._id || item.id;

              return (
                <div className="cart-item" key={itemId}>

                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                    }
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="restaurant-name">
                      {item.restaurantName || "Restaurant"}
                    </p>
                    <p className="item-price">₹{item.price}</p>
                  </div>

                  <div className="quantity-control">
                    <button onClick={() => decreaseQuantity(itemId)}>
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQuantity(itemId)}>
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ₹{item.price * item.quantity}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(itemId)}
                  >
                    Remove
                  </button>

                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
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
              <span>Taxes (5%)</span>
              <span>₹{tax}</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{finalTotal}</span>
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