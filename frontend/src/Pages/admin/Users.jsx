function AdminUsers() {
  const users = [
    { id: 1, name: "Rahul Sharma", email: "rahul@example.com", role: "Customer", status: "Active" },
    { id: 2, name: "Priya Singh", email: "priya@example.com", role: "Customer", status: "Active" },
    { id: 3, name: "Food Palace Owner", email: "foodpalace@example.com", role: "Restaurant Partner", status: "Active" },
    { id: 4, name: "Admin User", email: "admin@foodfusion.com", role: "Admin", status: "Active" },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage customer accounts, roles, and platform permissions.</p>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td><span className="role-badge">{user.role}</span></td>
                  <td><span className="status-badge active">{user.status}</span></td>
                  <td>
                    <button className="edit-btn">Edit</button>
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

export default AdminUsers;
