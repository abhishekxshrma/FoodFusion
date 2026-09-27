import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.orders.getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch customer orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Loading your orders...</p>;
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track your recent FoodFusion orders and status.</p>
        </div>

        {orders.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>No orders placed yet.</p>
        ) : (
          orders.map((order) => {
            const orderId = order._id || order.id;
            const statusClass = (order.status || "Pending").toLowerCase().replace(/\s+/g, "-");

            return (
              <div className="order-card" key={orderId}>
                <div className="order-top">
                  <div>
                    <h2>{order.restaurantName || order.restaurant?.name || "Restaurant"}</h2>
                    <p>Order #{String(orderId).substring(0, 8).toUpperCase()}</p>
                    <p>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>

                  <span className={`order-status ${statusClass}`}>
                    {order.status || "Pending"}
                  </span>
                </div>

                <hr />

                <div className="order-items">
                  {order.items && order.items.map((item, index) => (
                    <div className="order-item" key={index}>
                      <span>
                        {item.name} × {item.quantity} {item.addedBy ? `(${item.addedBy})` : ""}
                      </span>

                      <span>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="order-bottom">
                  <strong>Total: ₹{order.totalAmount || order.total}</strong>

                  <button
                    onClick={() => navigate(`/orders/${orderId}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Orders;