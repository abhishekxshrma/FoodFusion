function AdminOrders() {
  const orders = [
    { id: "ORD-1024", customer: "Rahul Sharma", restaurant: "Food Palace", amount: 510, status: "Delivered" },
    { id: "ORD-1023", customer: "Priya Singh", restaurant: "Burger Hub", amount: 340, status: "Preparing" },
    { id: "ORD-1022", customer: "Aman Kumar", restaurant: "Spice Garden", amount: 320, status: "Out for Delivery" },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Platform Orders Overview</h1>
          <p>Audit, track, and monitor all platform orders across restaurants.</p>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td><strong>{ord.id}</strong></td>
                  <td>{ord.customer}</td>
                  <td>{ord.restaurant}</td>
                  <td>₹{ord.amount}</td>
                  <td><span className="status-badge active">{ord.status}</span></td>
                  <td><button className="view-btn">View Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
