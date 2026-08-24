import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetails.css";

const orders = [
  {
    id: "FF1024",
    restaurant: "Food Palace",
    date: "24 Aug 2026",
    status: "Delivered",
    address: "Hostel Block A",
    payment: "Cash on Delivery",
    items: [
      { name: "Paneer Tikka", quantity: 2, price: 180 },
      { name: "Butter Naan", quantity: 3, price: 50 },
    ],
    subtotal: 510,
    deliveryFee: 0,
    total: 510,
  },
  {
    id: "FF1025",
    restaurant: "Spice Garden",
    date: "23 Aug 2026",
    status: "On the way",
    address: "Hostel Block A",
    payment: "UPI",
    items: [
      { name: "Veg Biryani", quantity: 1, price: 220 },
      { name: "Masala Coke", quantity: 2, price: 60 },
    ],
    subtotal: 340,
    deliveryFee: 0,
    total: 340,
  },
  {
    id: "FF1026",
    restaurant: "Urban Tadka",
    date: "20 Aug 2026",
    status: "Preparing",
    address: "Hostel Block A",
    payment: "UPI",
    items: [
      { name: "Chole Bhature", quantity: 2, price: 160 },
    ],
    subtotal: 320,
    deliveryFee: 0,
    total: 320,
  },
];

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = orders.find((order) => order.id === id);

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="order-not-found">
          <h1>Order Not Found</h1>
          <p>We couldn't find this order.</p>

          <button onClick={() => navigate("/orders")}>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="order-details-container">

        <button
          className="back-button"
          onClick={() => navigate("/orders")}
        >
          ← Back to Orders
        </button>

        <div className="details-header">
          <div>
            <h1>Order Details</h1>
            <p>Order #{order.id}</p>
          </div>

          <span
            className={`order-status ${order.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {order.status}
          </span>
        </div>

        <div className="details-card">
          <h2>{order.restaurant}</h2>

          <div className="order-info">
            <div>
              <span>Order Date</span>
              <strong>{order.date}</strong>
            </div>

            <div>
              <span>Delivery Address</span>
              <strong>{order.address}</strong>
            </div>

            <div>
              <span>Payment Method</span>
              <strong>{order.payment}</strong>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h2>Items</h2>

          <div className="details-items">
            {order.items.map((item, index) => (
              <div className="details-item" key={index}>
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <strong>
                  ₹{item.price * item.quantity}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="details-card">
          <h2>Bill Details</h2>

          <div className="bill-row">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>

          <div className="bill-row">
            <span>Delivery Fee</span>
            <span>
              {order.deliveryFee === 0
                ? "FREE"
                : `₹${order.deliveryFee}`}
            </span>
          </div>

          <hr />

          <div className="bill-total">
            <strong>Total</strong>
            <strong>₹{order.total}</strong>
          </div>
        </div>

        {order.status !== "Delivered" && (
          <div className="tracking-card">
            <h2>Order Tracking</h2>

            <div className="tracking-step completed">
              <span>✓</span>
              <div>
                <strong>Order Confirmed</strong>
                <p>Your order has been confirmed.</p>
              </div>
            </div>

            <div
              className={`tracking-step ${
                order.status === "Preparing" ||
                order.status === "On the way"
                  ? "completed"
                  : ""
              }`}
            >
              <span>✓</span>
              <div>
                <strong>Preparing</strong>
                <p>The restaurant is preparing your food.</p>
              </div>
            </div>

            <div
              className={`tracking-step ${
                order.status === "On the way"
                  ? "completed"
                  : ""
              }`}
            >
              <span>✓</span>
              <div>
                <strong>On the Way</strong>
                <p>Your food is on the way.</p>
              </div>
            </div>

            <div className="tracking-step">
              <span>4</span>
              <div>
                <strong>Delivered</strong>
                <p>Your order will be delivered soon.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default OrderDetails;