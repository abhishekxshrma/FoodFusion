import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const deliveryFee = 40;
  const tax = Math.round(total * 0.05);
  const finalTotal = total + deliveryFee + tax;

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    alert("Order placed successfully!");

    clearCart();
    navigate("/orders");
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your Cart is Empty</h1>
        <p>Add items before proceeding to checkout.</p>

        <Link to="/restaurants" className="browse-btn">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <section className="dashboard-card" style={{ marginBottom: "25px" }}>
          <h2>Delivery Address</h2>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your complete delivery address"
            rows="4"
          />
        </section>

        <section className="dashboard-card" style={{ marginBottom: "25px" }}>
          <h2>Payment Method</h2>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0", cursor: "pointer", fontWeight: "normal" }}>
            <input
              type="radio"
              value="Cash on Delivery"
              checked={paymentMethod === "Cash on Delivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: "auto" }}
            />
            Cash on Delivery
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0", cursor: "pointer", fontWeight: "normal" }}>
            <input
              type="radio"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: "auto" }}
            />
            UPI
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0", cursor: "pointer", fontWeight: "normal" }}>
            <input
              type="radio"
              value="Card"
              checked={paymentMethod === "Card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: "auto" }}
            />
            Card
          </label>
        </section>

        <section className="dashboard-card" style={{ marginBottom: "25px" }}>
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}

          <div style={{ marginTop: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "6px 0" }}><span>Subtotal:</span><span>₹{total}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "6px 0" }}><span>Delivery Fee:</span><span>₹{deliveryFee}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "6px 0" }}><span>Tax:</span><span>₹{tax}</span></div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "12px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold", color: "#e85d04" }}>
              <span>Total:</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
        </section>

        <button type="submit" className="primary-btn" style={{ width: "100%", padding: "14px", fontSize: "16px" }}>
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;