import { Link, useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();

  const order = {
    id: id,
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    address: "Sector 12, Chandigarh",
    status: "Preparing",
    payment: "Cash on Delivery",
    items: [
      {
        name: "Paneer Tikka",
        quantity: 2,
        price: 180,
      },
      {
        name: "Butter Naan",
        quantity: 3,
        price: 50,
      },
      {
        name: "Masala Coke",
        quantity: 1,
        price: 60,
      },
    ],
  };

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1>Order Details</h1>
          <p>Order #{order.id}</p>
        </div>

        <Link to="/restaurant/orders" className="secondary-btn">
          ← Back to Orders
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        {/* Order Items */}
        <div className="dashboard-card">
          <h2>Order Items</h2>

          {order.items.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <p style={{ margin: "4px 0 0" }}>
                  Quantity: {item.quantity}
                </p>
              </div>

              <strong>
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "15px 0" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#e85d04",
            }}
          >
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <div className="dashboard-card" style={{ marginBottom: "20px" }}>
            <h2>Customer</h2>

            <p style={{ margin: "8px 0" }}>
              <strong>Name:</strong>{" "}
              {order.customer}
            </p>

            <p style={{ margin: "8px 0" }}>
              <strong>Phone:</strong>{" "}
              {order.phone}
            </p>

            <p style={{ margin: "8px 0" }}>
              <strong>Address:</strong>{" "}
              {order.address}
            </p>
          </div>

          <div className="dashboard-card">
            <h2>Order Information</h2>

            <p style={{ margin: "8px 0" }}>
              <strong>Status:</strong>{" "}
              <span className="status-badge active">{order.status}</span>
            </p>

            <p style={{ margin: "8px 0" }}>
              <strong>Payment:</strong>{" "}
              {order.payment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;