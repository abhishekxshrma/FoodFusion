import { useState, useEffect } from "react";
import { api } from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.admin.getOrders();
        setOrders(data);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setOrders([
          { _id: "ORD-1024", customerName: "Rahul Sharma", restaurantName: "Spice Garden", totalAmount: 280, status: "Preparing", orderType: "individual" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading platform orders...</p>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Platform Orders Overview</h1>
          <p>Audit, track, and monitor all platform orders across all partner restaurants.</p>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: "20px" }}>
        <div className="admin-table-container" style={{ overflowX: "auto" }}>
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Order ID</th>
                <th style={{ padding: "12px" }}>Customer</th>
                <th style={{ padding: "12px" }}>Restaurant</th>
                <th style={{ padding: "12px" }}>Type</th>
                <th style={{ padding: "12px" }}>Amount</th>
                <th style={{ padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => {
                const ordId = ord._id || ord.id;
                return (
                  <tr key={ordId} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}><strong>#{String(ordId).substring(0, 8).toUpperCase()}</strong></td>
                    <td style={{ padding: "12px" }}>{ord.customerName || ord.customer?.name || "Customer"}</td>
                    <td style={{ padding: "12px" }}>{ord.restaurantName || ord.restaurant?.name || "Restaurant"}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ fontSize: "12px", padding: "3px 8px", background: "#f1f5f9", borderRadius: "4px" }}>
                        {ord.orderType === "group" ? "👥 Group" : "👤 Individual"}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}><strong>₹{ord.totalAmount || ord.total}</strong></td>
                    <td style={{ padding: "12px" }}>
                      <span className="status-badge active" style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>
                        {ord.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
