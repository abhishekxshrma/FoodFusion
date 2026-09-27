import { useState, useEffect } from "react";
import { api } from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await api.admin.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setUsers([
        { _id: "1", name: "Rahul Sharma", email: "rahul@gmail.com", role: "customer" },
        { _id: "2", name: "Spice Garden Owner", email: "spice@foodfusion.com", role: "restaurant" },
        { _id: "3", name: "System Admin", email: "admin@foodfusion.com", role: "admin" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    try {
      await api.admin.deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Failed to delete user");
    }
  };

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading platform users...</p>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage registered customer accounts, restaurant partner accounts, and admin roles.</p>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: "20px" }}>
        <div className="admin-table-container" style={{ overflowX: "auto" }}>
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>User ID</th>
                <th style={{ padding: "12px" }}>Name</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Role</th>
                <th style={{ padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userId = user._id || user.id;
                return (
                  <tr key={userId} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>#{String(userId).substring(0, 8).toUpperCase()}</td>
                    <td style={{ padding: "12px" }}><strong>{user.name}</strong></td>
                    <td style={{ padding: "12px" }}>{user.email}</td>
                    <td style={{ padding: "12px" }}>
                      <span className="role-badge" style={{ padding: "4px 8px", background: user.role === "admin" ? "#fef3c7" : user.role === "restaurant" ? "#e0e7ff" : "#f1f5f9", borderRadius: "4px", fontSize: "12px", textTransform: "capitalize" }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {user.role !== "admin" && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(userId)}
                          style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Delete User
                        </button>
                      )}
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

export default AdminUsers;
