import { Link } from "react-router-dom";

function RestaurantDashboard() {
  const recentOrders = [
    {
      id: "ORD-1024",
      customer: "Rahul Sharma",
      items: "Paneer Tikka × 2",
      amount: 360,
      status: "Preparing",
    },
    {
      id: "ORD-1023",
      customer: "Priya Singh",
      items: "Veg Biryani × 1",
      amount: 220,
      status: "Out for Delivery",
    },
    {
      id: "ORD-1022",
      customer: "Aman Kumar",
      items: "Butter Naan × 4",
      amount: 200,
      status: "Delivered",
    },
    {
      id: "ORD-1021",
      customer: "Neha Verma",
      items: "Dal Makhani × 2",
      amount: 320,
      status: "Preparing",
    },
  ];

  return (
    <div>
      <h1>Restaurant Dashboard</h1>
      <p>Welcome back! Here's today's restaurant overview.</p>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <h2 style={{ color: "#e85d04", margin: "10px 0 5px" }}>₹14,250</h2>
          <p style={{ margin: 0 }}>↑ 12% from last week</p>
        </div>

        <div className="dashboard-card">
          <h3>Today's Orders</h3>
          <h2 style={{ color: "#e85d04", margin: "10px 0 5px" }}>38</h2>
          <p style={{ margin: 0 }}>8 orders pending</p>
        </div>

        <div className="dashboard-card">
          <h3>Active Dishes</h3>
          <h2 style={{ color: "#e85d04", margin: "10px 0 5px" }}>24</h2>
          <p style={{ margin: 0 }}>2 dishes unavailable</p>
        </div>

        <div className="dashboard-card">
          <h3>Average Rating</h3>
          <h2 style={{ color: "#e85d04", margin: "10px 0 5px" }}>4.6 ⭐</h2>
          <p style={{ margin: 0 }}>Based on 328 reviews</p>
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
            <button className="add-food-btn">Add New Food</button>
          </Link>

          <Link to="/restaurant/menu">
            <button className="primary-btn">Manage Menu</button>
          </Link>

          <Link to="/restaurant/orders">
            <button className="view-btn">View Orders</button>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ marginTop: "35px" }}>
        <h2>Recent Orders</h2>

        <div className="dashboard-card" style={{ padding: 0, marginTop: "15px", overflow: "hidden" }}>
          {recentOrders.map((order) => (
            <div
              key={order.id}
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
                <strong>{order.id}</strong>
                <p style={{ margin: "3px 0 0", color: "#777", fontSize: "14px" }}>
                  {order.customer}
                </p>
              </div>

              <span>{order.items}</span>

              <strong>₹{order.amount}</strong>

              <span className="status-badge active">{order.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;