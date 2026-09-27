import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Pending");

  const fetchOrder = async () => {
    try {
      const data = await api.orders.getById(id);
      setOrder(data);
      setStatus(data.status || "Pending");
    } catch (err) {
      console.error("Fetch order details error:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await api.orders.updateStatus(id, newStatus);
      alert(`Order status updated to '${newStatus}'`);
      fetchOrder();
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading order details...</p>;
  }

  if (!order) {
    return (
      <div className="dashboard-card" style={{ margin: "30px auto", maxWidth: "500px", textAlign: "center" }}>
        <h1>Order Not Found</h1>
        <p style={{ color: "#666", margin: "10px 0" }}>Could not load order details from database.</p>
        <Link to="/restaurant/orders" className="secondary-btn" style={{ marginTop: "15px" }}>← Back to Orders</Link>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1>Order Details</h1>
          <p>
            Order #{String(order._id || id).substring(0, 8).toUpperCase()} • {new Date(order.createdAt || Date.now()).toLocaleString()}
          </p>
        </div>

        <Link to="/restaurant/orders" className="secondary-btn">
          ← Back to Orders
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        {/* Order Items */}
        <div className="dashboard-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h2 style={{ margin: 0 }}>Order Items ({order.items ? order.items.length : 0})</h2>
            {order.orderType === "group" && (
              <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                👥 GROUP ORDER
              </span>
            )}
          </div>

          {order.items && order.items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <div>
                <strong>{item.name} {item.addedBy ? `(Added by: ${item.addedBy})` : ""}</strong>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#666" }}>
                  Quantity: {item.quantity} × ₹{item.price}
                </p>
              </div>

              <strong>
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#e85d04",
            }}
          >
            <span>Total Order Amount</span>
            <span>₹{order.totalAmount || order.total}</span>
          </div>
        </div>

        {/* Customer Information & Status Controls */}
        <div>
          <div className="dashboard-card" style={{ marginBottom: "20px" }}>
            <h2>Customer Details</h2>

            <p style={{ margin: "8px 0" }}>
              <strong>Name:</strong> {order.customerName || order.customer?.name || "Customer"}
            </p>

            {order.customer?.phone && (
              <p style={{ margin: "8px 0" }}>
                <strong>Phone:</strong> {order.customer.phone}
              </p>
            )}

            <p style={{ margin: "8px 0" }}>
              <strong>Delivery Address:</strong> {order.deliveryAddress || "Hostel Campus"}
            </p>

            <p style={{ margin: "8px 0" }}>
              <strong>Payment:</strong> {order.paymentMethod || "Cash on Delivery"}
            </p>
          </div>

          <div className="dashboard-card">
            <h2>Order Status & Updates</h2>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Current Status</label>
              <select
                value={status}
                onChange={handleStatusChange}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", background: "#fff" }}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <p style={{ margin: "8px 0", fontSize: "13px", color: "#666" }}>
              Changing this status directly informs the customer in their order tracking interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;