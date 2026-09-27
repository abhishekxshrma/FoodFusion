import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function RestaurantOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await api.orders.getRestaurantOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading restaurant orders...</p>;
  }

  return (
    <div>
      <h1>Restaurant Orders</h1>
      <p>Manage incoming customer & group orders and update real-time delivery status.</p>

      <div style={{ marginTop: "25px" }}>
        {orders.length === 0 ? (
          <div className="dashboard-card" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            <h3>No orders received yet</h3>
            <p style={{ margin: "6px 0 0" }}>When customers place orders from your restaurant, they will appear here in real time.</p>
          </div>
        ) : (
          orders.map((order) => {
            const orderId = order._id || order.id;
            const status = order.status || "Pending";

            return (
              <div key={orderId} className="dashboard-card" style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h2 style={{ margin: 0 }}>Order #{String(orderId).substring(0, 8).toUpperCase()}</h2>
                      {order.orderType === "group" ? (
                        <span style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                          👥 GROUP ORDER
                        </span>
                      ) : (
                        <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>
                          👤 Individual Order
                        </span>
                      )}
                    </div>

                    <p style={{ margin: "6px 0 2px", color: "#666", fontSize: "13px" }}>
                      📅 <strong>Date:</strong> {new Date(order.createdAt || Date.now()).toLocaleString()}
                    </p>

                    <p style={{ margin: "4px 0" }}>
                      <strong>Customer:</strong> {order.customerName || order.customer?.name || "Customer"}
                      {order.customer?.phone && <span style={{ marginLeft: "8px", color: "#555" }}>({order.customer.phone})</span>}
                    </p>

                    <div style={{ margin: "6px 0", background: "#f8fafc", padding: "10px", borderRadius: "6px" }}>
                      <strong style={{ fontSize: "13px" }}>Items Ordered:</strong>
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: "14px", display: "flex", justifyContent: "space-between", margin: "3px 0" }}>
                          <span>• {item.name} × {item.quantity} {item.addedBy ? `(by ${item.addedBy})` : ""}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <p style={{ margin: "4px 0", fontSize: "14px" }}>
                      <strong>Delivery Address:</strong> {order.deliveryAddress || "Campus"}
                    </p>

                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#666" }}>
                      <strong>Payment Method:</strong> {order.paymentMethod || "Cash on Delivery"}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <h2 style={{ color: "#e85d04", margin: "0 0 8px" }}>₹{order.totalAmount}</h2>

                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        fontWeight: "600",
                        fontSize: "13px",
                        background:
                          status === "Delivered"
                            ? "#dcfce7"
                            : status === "Cancelled"
                            ? "#fee2e2"
                            : "#fef9c3",
                        color:
                          status === "Delivered"
                            ? "#166534"
                            : status === "Cancelled"
                            ? "#991b1b"
                            : "#854d0e",
                      }}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "15px 0" }} />

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Change Status:</label>
                  {status === "Pending" && (
                    <button
                      className="primary-btn"
                      onClick={() => handleUpdateStatus(orderId, "Confirmed")}
                    >
                      ✓ Accept Order
                    </button>
                  )}

                  {status === "Confirmed" && (
                    <button
                      className="primary-btn"
                      onClick={() => handleUpdateStatus(orderId, "Preparing")}
                    >
                      🍳 Start Preparing
                    </button>
                  )}

                  {status === "Preparing" && (
                    <button
                      className="primary-btn"
                      onClick={() => handleUpdateStatus(orderId, "Out for Delivery")}
                    >
                      🛵 Out for Delivery
                    </button>
                  )}

                  {status === "Out for Delivery" && (
                    <button
                      className="primary-btn"
                      onClick={() => handleUpdateStatus(orderId, "Delivered")}
                      style={{ background: "#16a34a" }}
                    >
                      ✓ Mark Delivered
                    </button>
                  )}

                  {status !== "Delivered" && status !== "Cancelled" && (
                    <button
                      onClick={() => handleUpdateStatus(orderId, "Cancelled")}
                      style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
                    >
                      Cancel Order
                    </button>
                  )}

                  <Link to={`/restaurant/orders/${orderId}`}>
                    <button className="view-btn">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RestaurantOrders;