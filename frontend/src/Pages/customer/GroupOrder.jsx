import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GroupOrder.css";

function GroupOrder() {
  const [roomName, setRoomName] = useState("");
  const [deadline, setDeadline] = useState("");
  const navigate = useNavigate();

  const createRoom = (e) => {
    e.preventDefault();

    if (!roomName.trim()) {
      alert("Please enter a group order name.");
      return;
    }

    const roomId = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    navigate(`/group-room/${roomId}`);
  };

  return (
    <div className="group-order-page">
      <div className="group-order-container">

        <h1>Create a Group Order</h1>

        <p>
          Order together with your friends, classmates, or family.
        </p>

        <form onSubmit={createRoom}>

          <label>
            Group Order Name
          </label>

          <input
            type="text"
            placeholder="e.g. Friday Lunch"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <label>
            Order Deadline
          </label>

          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button type="submit">
            Create Group Order
          </button>

        </form>

        <div className="group-order-info">
          <h3>How Group Ordering Works</h3>

          <p>1. Create a group order room.</p>
          <p>2. Share the room with your friends.</p>
          <p>3. Everyone adds their own food.</p>
          <p>4. Confirm the order together.</p>
        </div>

      </div>
    </div>
  );
}

export default GroupOrder;