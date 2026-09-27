import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { useState } from "react";

function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || "Main Campus Hostel, Room 102");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = 40;
  const tax = Math.round(total * 0.05);
  const finalTotal = total + deliveryFee + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Find restaurant ID from cart items
      const firstItem = cart[0];
      const restaurantId = firstItem?.restaurantId || firstItem?.restaurant;
      
      if (!restaurantId) {
        throw new Error("Unable to identify restaurant for this order");
      }

      const orderItems = cart.map((item) => ({
        foodItem: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        addedBy: user?.name || "Customer",
      }));

      await api.orders.create({
        restaurantId,
        items: orderItems,
        totalAmount: finalTotal,
        deliveryAddress: address,
        paymentMethod,
      });

      alert("Order placed successfully!");
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error("Order placement error:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart" style={{ textAlign: "center", padding: "40px 20px" }}>
        <h1>Your Cart is Empty</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>Add items before proceeding to checkout.</p>

        <Link to="/restaurants" className="browse-btn">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>Checkout</h1>

      {error && (
        <div style={{ padding: "10px 14px", backgroundColor: "#fee2e2", border: "1px solid #f87171", color: "#991b1b", borderRadius: "6px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <section className="dashboard-card" style={{ marginBottom: "25px" }}>
          <h2>Delivery Address</h2>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your complete delivery address"
            rows="4"
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "10px" }}
            required
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
            Cash on Delivery (Standard)
          </label>
        </section>

        <section className="dashboard-card" style={{ marginBottom: "25px" }}>
          <h2>Order Summary</h2>

          {cart.map((item, index) => (
            <div key={item._id || item.id || index} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", margin: "6px 0" }}><span>Tax (5%):</span><span>₹{tax}</span></div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "12px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold", color: "#e85d04" }}>
              <span>Total:</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="primary-btn"
          disabled={loading}
          style={{ width: "100%", padding: "14px", fontSize: "16px", cursor: "pointer" }}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;