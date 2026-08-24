function AdminDashboard() {
  return (
    <div className="admin-page">
      <h1>Admin Portal Dashboard</h1>
      <p>Platform overview, user activity, and restaurant analytics.</p>

      <div className="admin-stats-grid">
        <div className="dashboard-card">
          <h3>Total Platform Sales</h3>
          <p className="stat-value">₹1,248,500</p>
          <span className="stat-subtext">↑ 15% this month</span>
        </div>

        <div className="dashboard-card">
          <h3>Registered Users</h3>
          <p className="stat-value">4,820</p>
          <span className="stat-subtext">+120 new this week</span>
        </div>

        <div className="dashboard-card">
          <h3>Partner Restaurants</h3>
          <p className="stat-value">142</p>
          <span className="stat-subtext">12 pending approvals</span>
        </div>

        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <p className="stat-value">12,450</p>
          <span className="stat-subtext">840 orders today</span>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
