import { useState, useEffect } from "react";
import { api } from "../../services/api";

function AdminRestaurants() {
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const data = await api.admin.getRestaurants();
      setRestaurantsList(data);
    } catch (err) {
      console.error("Fetch restaurants error:", err);
      setRestaurantsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.admin.toggleRestaurantStatus(id, !currentStatus);
      fetchRestaurants();
    } catch (err) {
      alert(err.message || "Failed to update restaurant status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }

    try {
      await api.admin.deleteRestaurant(id);
      fetchRestaurants();
    } catch (err) {
      console.error("Delete restaurant error:", err);
      alert(err.message || "Failed to delete restaurant");
    }
  };

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading restaurants...</p>;
  }

  return (
    <div
      className="admin-page"
      style={{
        width: "90%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 0",
      }}
    >
      <div className="admin-page-header">
        <h1>Restaurant Management</h1>
        <p>Manage restaurant partners and availability.</p>
      </div>

      <div
        className="dashboard-card"
        style={{
          marginTop: "20px",
          width: "100%",
          overflowX: "auto",
        }}
      >
        <table
          className="admin-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #eee" }}>
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Restaurant</th>
              <th style={{ padding: "12px" }}>Location</th>
              <th style={{ padding: "12px" }}>Cuisine</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px", width: "180px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {restaurantsList.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "25px", textAlign: "center" }}>
                  No restaurants found.
                </td>
              </tr>
            ) : (
              restaurantsList.map((res) => {
                const resId = res._id || res.id;
                const isAvail =
                  res.isAvailable !== undefined ? res.isAvailable : true;

                return (
                  <tr
                    key={resId}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td style={{ padding: "12px" }}>
                      #{String(resId).substring(0, 8).toUpperCase()}
                    </td>

                    <td style={{ padding: "12px" }}>
                      <strong>{res.name}</strong>
                    </td>

                    <td style={{ padding: "12px" }}>
                      {res.location || "Campus"}
                    </td>

                    <td style={{ padding: "12px" }}>
                      {res.cuisine || "N/A"}
                    </td>

                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          fontSize: "12px",
                          background: isAvail ? "#dcfce7" : "#fee2e2",
                          color: isAvail ? "#166534" : "#991b1b",
                        }}
                      >
                        {isAvail ? "Available" : "Disabled"}
                      </span>
                    </td>

                    <td style={{ padding: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleToggleStatus(resId, isAvail)
                          }
                          style={{
                            padding: "7px 12px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            background: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          {isAvail ? "Disable" : "Enable"}
                        </button>

                        <button
                          onClick={() => handleDelete(resId)}
                          style={{
                            padding: "7px 12px",
                            border: "1px solid #dc2626",
                            borderRadius: "5px",
                            background: "#fee2e2",
                            color: "#991b1b",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminRestaurants;