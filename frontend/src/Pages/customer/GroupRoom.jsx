import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import restaurants from "../../data/restaurants";
import food from "../../data/food";
import "./GroupRoom.css";

function GroupRoom() {
  const { roomId } = useParams();

  const [participants, setParticipants] = useState([
    { id: 1, name: "You", items: 2 },
    { id: 2, name: "Rahul", items: 1 },
    { id: 3, name: "Priya", items: 2 },
  ]);

  const [groupItems, setGroupItems] = useState([
    {
      id: 1,
      name: "Paneer Tikka",
      price: 180,
      quantity: 1,
      user: "You",
    },
    {
      id: 2,
      name: "Veg Biryani",
      price: 220,
      quantity: 1,
      user: "Rahul",
    },
    {
      id: 3,
      name: "Butter Naan",
      price: 50,
      quantity: 2,
      user: "Priya",
    },
  ]);

  const [orderFinalized, setOrderFinalized] = useState(false);

  const total = groupItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleFinalize = () => {
    setOrderFinalized(true);
  };

  const handleShare = () => {
    const roomLink = `${window.location.origin}/group-room/${roomId}`;

    navigator.clipboard.writeText(roomLink);

    alert("Group room link copied!");
  };

  return (
    <div className="group-room-page">
      <div className="group-room-container">

        <div className="group-room-header">
          <div>
            <h1>Group Order Room</h1>
            <p>
              Room ID: <strong>{roomId}</strong>
            </p>
          </div>

          <button onClick={handleShare}>
            Share Room
          </button>
        </div>

        <div className="room-deadline">
          ⏰ Order deadline: Today, 8:00 PM
        </div>

        {orderFinalized && (
          <div className="order-success">
            ✓ Group order finalized successfully!
          </div>
        )}

        <div className="group-room-grid">

          <section className="participants-card">
            <h2>Participants</h2>

            {participants.map((participant) => (
              <div
                className="participant"
                key={participant.id}
              >
                <div>
                  <strong>{participant.name}</strong>
                  <p>{participant.items} items</p>
                </div>

                <span>✓</span>
              </div>
            ))}
          </section>

          <section className="group-cart-card">
            <h2>Shared Cart</h2>

            {groupItems.map((item) => (
              <div
                className="group-item"
                key={item.id}
              >
                <div>
                  <strong>{item.name}</strong>

                  <p>
                    Added by {item.user}
                  </p>
                </div>

                <span>
                  ₹{item.price} × {item.quantity}
                </span>
              </div>
            ))}

            <hr />

            <div className="group-total">
              <strong>Total</strong>
              <strong>₹{total}</strong>
            </div>

            <button
              className="finalize-btn"
              onClick={handleFinalize}
              disabled={orderFinalized}
            >
              {orderFinalized
                ? "Order Finalized"
                : "Finalize Group Order"}
            </button>
          </section>

        </div>

        <Link to="/restaurants">
          + Add More Food
        </Link>

      </div>
    </div>
  );
}

export default GroupRoom;