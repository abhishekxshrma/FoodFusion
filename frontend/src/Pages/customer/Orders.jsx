import { useNavigate } from "react-router-dom";
import "./Orders.css";

const orders = [
  {
    id: "FF1024",
    restaurant: "Food Palace",
    date: "24 Aug 2026",
    status: "Delivered",
    items: [
      { name: "Paneer Tikka", quantity: 2, price: 180 },
      { name: "Butter Naan", quantity: 3, price: 50 },
    ],
    total: 510,
  },
  {
    id: "FF1025",
    restaurant: "Spice Garden",
    date: "23 Aug 2026",
    status: "On the way",
    items: [
      { name: "Veg Biryani", quantity: 1, price: 220 },
      { name: "Masala Coke", quantity: 2, price: 60 },
    ],
    total: 340,
  },
  {
    id: "FF1026",
    restaurant: "Urban Tadka",
    date: "20 Aug 2026",
    status: "Preparing",
    items: [
      { name: "Chole Bhature", quantity: 2, price: 160 },
    ],
    total: 320,
  },
];

function Orders() {
  const navigate = useNavigate();

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track your recent FoodFusion orders.</p>
        </div>

        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-top">
              <div>
                <h2>{order.restaurant}</h2>
                <p>Order #{order.id}</p>
                <p>{order.date}</p>
              </div>

              <span
                className={`order-status ${order.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {order.status}
              </span>
            </div>

            <hr />

            <div className="order-items">
              {order.items.map((item, index) => (
                <div className="order-item" key={index}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <hr />

            <div className="order-bottom">
              <strong>Total: ₹{order.total}</strong>

              <button
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;