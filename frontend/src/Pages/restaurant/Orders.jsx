import { useState } from "react";
import { Link } from "react-router-dom";

function RestaurantOrders() {
  const [orders, setOrders] = useState([
    {
      id: "ORD-1024",
      customer: "Rahul Sharma",
      items: "Paneer Tikka × 2, Butter Naan × 3",
      total: 510,
      status: "New",
      time: "5 mins ago",
    },
    {
      id: "ORD-1023",
      customer: "Priya Singh",
      items: "Veg Biryani × 1, Masala Coke × 2",
      total: 340,
      status: "Preparing",
      time: "15 mins ago",
    },
    {
      id: "ORD-1022",
      customer: "Aman Kumar",
      items: "Dal Makhani × 2",
      total: 320,
      status: "Out for Delivery",
      time: "30 mins ago",
    },
    {
      id: "ORD-1021",
      customer: "Neha Verma",
      items: "Chole Bhature × 2",
      total: 320,
      status: "Delivered",
      time: "1 hour ago",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <div>
      <h1>Orders</h1>

      <p>
        Manage incoming orders and update their delivery status.
      </p>

      <div style={{ marginTop: "25px" }}>
        {orders.map((order) => (
          <div key={order.id} className="dashboard-card" style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "20px",
              }}
            >
              <div>
                <h2>{order.id}</h2>

                <p style={{ margin: "5px 0" }}>
                  <strong>Customer:</strong>{" "}
                  {order.customer}
                </p>

                <p style={{ margin: "5px 0" }}>
                  <strong>Items:</strong>{" "}
                  {order.items}
                </p>

                <p style={{ margin: "5px 0" }}>
                  <strong>Order Time:</strong>{" "}
                  {order.time}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <h2 style={{ color: "#e85d04", margin: "0 0 8px" }}>₹{order.total}</h2>

                <span className="status-badge active">
                  {order.status}
                </span>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "15px 0" }} />

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {order.status === "New" && (
                <button
                  className="primary-btn"
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "Preparing"
                    )
                  }
                >
                  Accept & Prepare
                </button>
              )}

              {order.status === "Preparing" && (
                <button
                  className="primary-btn"
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "Out for Delivery"
                    )
                  }
                >
                  Mark Out for Delivery
                </button>
              )}

              {order.status === "Out for Delivery" && (
                <button
                  className="primary-btn"
                  onClick={() =>
                    updateStatus(
                      order.id,
                      "Delivered"
                    )
                  }
                >
                  Mark Delivered
                </button>
              )}

              <Link
                to={`/restaurant/order/${order.id}`}
              >
                <button className="view-btn">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantOrders;