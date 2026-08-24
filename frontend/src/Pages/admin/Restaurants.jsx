function AdminRestaurants() {
  const restaurantsList = [
    { id: 101, name: "Food Palace", owner: "Rahul Sharma", cuisine: "North Indian", status: "Approved" },
    { id: 102, name: "Burger Hub", owner: "Amit Kumar", cuisine: "Fast Food", status: "Approved" },
    { id: 103, name: "Spice Garden", owner: "Suresh Patel", cuisine: "South Indian", status: "Pending" },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Restaurant Management</h1>
          <p>Approve new restaurant applications and manage onboarded partners.</p>
        </div>
        <button className="add-btn">+ Add Restaurant</button>
      </div>

      <div className="dashboard-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Restaurant Name</th>
                <th>Owner</th>
                <th>Cuisine</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurantsList.map((res) => (
                <tr key={res.id}>
                  <td>#{res.id}</td>
                  <td><strong>{res.name}</strong></td>
                  <td>{res.owner}</td>
                  <td>{res.cuisine}</td>
                  <td>
                    <span className={`status-badge ${res.status === "Approved" ? "active" : "pending"}`}>
                      {res.status}
                    </span>
                  </td>
                  <td>
                    <button className="view-btn">View</button>
                    <button className="delete-btn" style={{ marginLeft: "8px" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminRestaurants;
