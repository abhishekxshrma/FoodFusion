import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.orders.getById(id);
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Loading order details...</p>;
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="order-not-found">
          <h1>Order Not Found</h1>
          <p>We couldn't find this order.</p>

          <button onClick={() => navigate("/orders")}>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const status = order.status || "Pending";
  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  const getStepStatus = (stepName) => {
    const stages = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];
    const currentIdx = stages.indexOf(status);
    const stepIdx = stages.indexOf(stepName);
    return currentIdx >= stepIdx ? "completed" : "";
  };

  return (
    <div className="order-details-page">
      <div className="order-details-container">

        <button
          className="back-button"
          onClick={() => navigate("/orders")}
        >
          ← Back to Orders
        </button>

        <div className="details-header">
          <div>
            <h1>Order Details</h1>
            <p>Order #{String(order._id || id).substring(0, 8).toUpperCase()}</p>
          </div>

          <span className={`order-status ${statusClass}`}>
            {status}
          </span>
        </div>

        <div className="details-card">
          <h2>{order.restaurantName || order.restaurant?.name || "Restaurant"}</h2>

          <div className="order-info">
            <div>
              <span>Order Date</span>
              <strong>{new Date(order.createdAt || Date.now()).toLocaleString()}</strong>
            </div>

            <div>
              <span>Delivery Address</span>
              <strong>{order.deliveryAddress || "Hostel Campus"}</strong>
            </div>

            <div>
              <span>Payment Method</span>
              <strong>{order.paymentMethod || "Cash on Delivery"}</strong>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h2>Items</h2>

          <div className="details-items">
            {order.items && order.items.map((item, index) => (
              <div className="details-item" key={index}>
                <div>
                  <strong>{item.name} {item.addedBy ? `(Added by ${item.addedBy})` : ""}</strong>
                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <strong>
                  ₹{item.price * item.quantity}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="details-card">
          <h2>Bill Details</h2>

          <div className="bill-row">
            <span>Items Total</span>
            <span>₹{order.totalAmount || order.total}</span>
          </div>

          <div className="bill-row">
            <span>Delivery Fee</span>
            <span>Included / Free</span>
          </div>

          <hr />

          <div className="bill-total">
            <strong>Total</strong>
            <strong>₹{order.totalAmount || order.total}</strong>
          </div>
        </div>

        {status !== "Delivered" && status !== "Cancelled" && (
          <div className="tracking-card">
            <h2>Order Tracking Status</h2>

            <div className={`tracking-step ${getStepStatus("Pending")}`}>
              <span>✓</span>
              <div>
                <strong>Order Received</strong>
                <p>Your order has been received by restaurant.</p>
              </div>
            </div>

            <div className={`tracking-step ${getStepStatus("Confirmed")}`}>
              <span>✓</span>
              <div>
                <strong>Order Confirmed</strong>
                <p>Restaurant accepted the order.</p>
              </div>
            </div>

            <div className={`tracking-step ${getStepStatus("Preparing")}`}>
              <span>✓</span>
              <div>
                <strong>Preparing</strong>
                <p>The kitchen is preparing your food.</p>
              </div>
            </div>

            <div className={`tracking-step ${getStepStatus("Out for Delivery")}`}>
              <span>✓</span>
              <div>
                <strong>Out for Delivery</strong>
                <p>Restaurant delivery staff is on the way.</p>
              </div>
            </div>

            <div className={`tracking-step ${getStepStatus("Delivered")}`}>
              <span>5</span>
              <div>
                <strong>Delivered</strong>
                <p>Order delivered to your address.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default OrderDetails;