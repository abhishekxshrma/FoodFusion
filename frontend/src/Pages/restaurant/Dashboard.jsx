import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuCount, setMenuCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [noRestaurant, setNoRestaurant] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        let restData = null;
        try {
          restData = await api.restaurants.getMyRestaurant();
          setRestaurant(restData);
        } catch {
          setNoRestaurant(true);
        }

        const ordersData = await api.orders.getRestaurantOrders();
        setOrders(Array.isArray(ordersData) ? ordersData : []);

        if (restData) {
          const menuData = await api.food.getMenu(restData._id || restData.id);
          setMenuCount(Array.isArray(menuData) ? menuData.length : 0);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading restaurant dashboard...</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ margin: "0 0 6px" }}>
            {restaurant ? restaurant.name : "Restaurant Dashboard"}
          </h1>
          <p style={{ margin: 0, color: "#666" }}>
            {restaurant
              ? `Real-time management dashboard for ${restaurant.name} (${restaurant.cuisine || "Cuisine"}).`
              : "Welcome back! Here is your restaurant overview."}
          </p>
        </div>

        {restaurant && (
          <span
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              fontWeight: "600",
              fontSize: "14px",
              background: restaurant.isAvailable !== false ? "#dcfce7" : "#fee2e2",
              color: restaurant.isAvailable !== false ? "#166534" : "#991b1b",
            }}
          >
            {restaurant.isAvailable !== false ? "🟢 Live & Accepting Orders" : "🔴 Store Offline / Closed"}
          </span>
        )}
      </div>

      {noRestaurant && (
        <div className="dashboard-card" style={{ backgroundColor: "#fef3c7", border: "1px solid #f59e0b", padding: "20px", marginTop: "20px" }}>
          <h3 style={{ margin: "0 0 8px", color: "#92400e" }}>⚠️ No Restaurant Profile Found</h3>
          <p style={{ margin: "0 0 15px", color: "#b45309", fontSize: "14px" }}>
            You haven't set up your restaurant details yet. Please create your restaurant profile so customers can find you and place orders.
          </p>
          <Link to="/restaurant/profile" className="primary-btn">
            Create Restaurant Profile
          </Link>
        </div>
      )}

      {/* Stats Required by Requirement 3: Total Orders, Pending Orders, Completed Orders, Total Revenue, Menu Item Count */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "18px",
          marginTop: "25px",
        }}
      >
        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <h2 style={{ color: "#e85d04", margin: "10px 0 5px" }}>₹{totalRevenue}</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>From all valid orders</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <h2 style={{ color: "#e85d04", margin: "10px 0 5px" }}>{orders.length}</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>All-time orders</p>
        </div>

        <div className="dashboard-card">
          <h3>Pending Orders</h3>
          <h2 style={{ color: "#2563eb", margin: "10px 0 5px" }}>{pendingOrders}</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>Requires kitchen attention</p>
        </div>

        <div className="dashboard-card">
          <h3>Completed Orders</h3>
          <h2 style={{ color: "#16a34a", margin: "10px 0 5px" }}>{completedOrders}</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>Delivered orders</p>
        </div>

        <div className="dashboard-card">
          <h3>Menu Item Count</h3>
          <h2 style={{ color: "#e85d04", margin: "10px 0 5px" }}>{menuCount}</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>Active food items in menu</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: "35px" }}>
        <h2>Quick Actions</h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >
          <Link to="/restaurant/add-food">
            <button className="add-food-btn">➕ Add New Food</button>
          </Link>

          <Link to="/restaurant/menu">
            <button className="primary-btn">📋 Manage Menu ({menuCount})</button>
          </Link>

          <Link to="/restaurant/orders">
            <button className="view-btn">📦 View Orders ({orders.length})</button>
          </Link>

          <Link to="/restaurant/profile">
            <button style={{ padding: "10px 16px", borderRadius: "6px", border: "1px solid #ccc", background: "#fff", cursor: "pointer", fontWeight: "600" }}>
              ⚙️ Store Settings & Location
            </button>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ marginTop: "35px" }}>
        <h2>Recent Incoming Orders</h2>

        {orders.length === 0 ? (
          <p style={{ padding: "20px 0", color: "#666" }}>No orders received yet.</p>
        ) : (
          <div className="dashboard-card" style={{ padding: 0, marginTop: "15px", overflow: "hidden" }}>
            {orders.slice(0, 5).map((order) => {
              const orderId = order._id || order.id;
              return (
                <div
                  key={orderId}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1.5fr 100px 150px",
                    gap: "15px",
                    alignItems: "center",
                    padding: "18px 24px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <strong>#{String(orderId).substring(0, 8).toUpperCase()}</strong>
                    {order.orderType === "group" && (
                      <span style={{ marginLeft: "8px", fontSize: "11px", background: "#fef3c7", color: "#92400e", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
                        👥 GROUP ORDER
                      </span>
                    )}
                    <p style={{ margin: "3px 0 0", color: "#777", fontSize: "14px" }}>
                      {order.customerName || order.customer?.name || "Customer"}
                    </p>
                  </div>

                  <span style={{ fontSize: "14px" }}>
                    {order.items ? order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ") : "Items"}
                  </span>

                  <strong>₹{order.totalAmount}</strong>

                  <span className="status-badge active" style={{ display: "inline-block", textAlign: "center" }}>
                    {order.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantDashboard;