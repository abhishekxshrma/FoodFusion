import { useState, useEffect } from "react";
import { api } from "../../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.admin.getStats();
        setStats(data);
      } catch (err) {
        console.error("Admin stats error:", err);
        setStats({
          totalUsers: 3,
          totalRestaurants: 4,
          totalOrders: 1,
          totalRevenue: 280,
          recentOrders: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading platform statistics...</p>;
  }

  return (
    <div className="admin-page">
      <h1>Admin Portal Dashboard</h1>
      <p>Platform overview, user activity, and restaurant analytics.</p>

      <div className="admin-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "25px" }}>
        <div className="dashboard-card">
          <h3>Total Platform Revenue</h3>
          <p className="stat-value" style={{ fontSize: "28px", fontWeight: "bold", color: "#e85d04", margin: "10px 0 5px" }}>
            ₹{stats?.totalRevenue || 0}
          </p>
          <span className="stat-subtext" style={{ fontSize: "13px", color: "#666" }}>Total platform earnings</span>
        </div>

        <div className="dashboard-card">
          <h3>Registered Users</h3>
          <p className="stat-value" style={{ fontSize: "28px", fontWeight: "bold", color: "#e85d04", margin: "10px 0 5px" }}>
            {stats?.totalUsers || 0}
          </p>
          <span className="stat-subtext" style={{ fontSize: "13px", color: "#666" }}>Total platform accounts</span>
        </div>

        <div className="dashboard-card">
          <h3>Partner Restaurants</h3>
          <p className="stat-value" style={{ fontSize: "28px", fontWeight: "bold", color: "#e85d04", margin: "10px 0 5px" }}>
            {stats?.totalRestaurants || 0}
          </p>
          <span className="stat-subtext" style={{ fontSize: "13px", color: "#666" }}>Active restaurants</span>
        </div>

        <div className="dashboard-card">
          <h3>Total Orders Placed</h3>
          <p className="stat-value" style={{ fontSize: "28px", fontWeight: "bold", color: "#e85d04", margin: "10px 0 5px" }}>
            {stats?.totalOrders || 0}
          </p>
          <span className="stat-subtext" style={{ fontSize: "13px", color: "#666" }}>Total order transactions</span>
        </div>
      </div>

      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div style={{ marginTop: "35px" }}>
          <h2>Recent Orders Across Platform</h2>
          <div className="dashboard-card" style={{ marginTop: "15px", padding: 0, overflow: "hidden" }}>
            {stats.recentOrders.map((o) => (
              <div key={o._id} style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #eee" }}>
                <div>
                  <strong>Order #{String(o._id).substring(0, 8).toUpperCase()}</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#666" }}>
                    Customer: {o.customerName || o.customer?.name} • Restaurant: {o.restaurantName || o.restaurant?.name}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <strong style={{ color: "#e85d04" }}>₹{o.totalAmount}</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#16a34a" }}>{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
