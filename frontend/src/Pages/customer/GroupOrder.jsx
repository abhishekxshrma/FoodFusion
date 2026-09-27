import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../services/api";
import "./GroupOrder.css";

function GroupOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(
    location.state?.selectedRestaurantId || ""
  );
  const [roomName, setRoomName] = useState("");
  const [deadline, setDeadline] = useState("Today, 8:00 PM");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await api.restaurants.getAll();
        const availableRests = Array.isArray(data) ? data : [];
        setRestaurants(availableRests);
        if (!selectedRestaurant && availableRests.length > 0) {
          setSelectedRestaurant(availableRests[0]._id || availableRests[0].id);
        }
      } catch (err) {
        console.error(err);
        setRestaurants([]);
      }
    };

    fetchRestaurants();
  }, [selectedRestaurant]);

  const createRoom = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedRestaurant) {
      alert("Please select a restaurant for the group order.");
      return;
    }

    if (!roomName.trim()) {
      alert("Please enter a group order room name.");
      return;
    }

    setLoading(true);

    try {
      const room = await api.groupOrders.createRoom({
        restaurantId: selectedRestaurant,
        roomName,
        deadline: deadline || "Today, 8:00 PM",
      });

      navigate(`/group-room/${room.roomId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create group order room.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinExistingRoom = (e) => {
    e.preventDefault();
    if (!joinRoomId.trim()) {
      alert("Please enter a Room ID to join.");
      return;
    }

    navigate(`/group-room/${joinRoomId.trim().toUpperCase()}`);
  };

  return (
    <div className="group-order-page">
      <div className="group-order-container">

        <h1>Group Order Room</h1>

        <p>
          Order together with your friends, classmates, or family in one shared order.
        </p>

        {error && (
          <div style={{ padding: "10px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "6px", marginBottom: "15px" }}>
            {error}
          </div>
        )}

        {/* Join existing room card */}
        <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#1e293b" }}>🔗 Have a Room ID? Join Room</h3>
          <form onSubmit={handleJoinExistingRoom} style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Enter 6-digit Room ID (e.g. AB12CD)"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              style={{ flex: 1, textTransform: "uppercase" }}
            />
            <button type="submit" style={{ width: "auto", padding: "0 20px" }}>
              Join
            </button>
          </form>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "25px 0" }} />

        <h2>Create a New Group Room</h2>

        <form onSubmit={createRoom}>

          <label>Select Restaurant</label>
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "15px", background: "#fff" }}
          >
            {restaurants.map((r) => (
              <option key={r._id || r.id} value={r._id || r.id}>
                {r.name} ({r.cuisine} - {r.location})
              </option>
            ))}
          </select>

          <label>Group Room Name</label>
          <input
            type="text"
            placeholder="e.g. Friday Lunch Order / Hostel Gang"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />

          <label>Order Deadline</label>
          <input
            type="text"
            placeholder="e.g. Today, 8:00 PM"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Room..." : "Create Group Order Room"}
          </button>

        </form>

        <div className="group-order-info" style={{ marginTop: "30px" }}>
          <h3>How Group Ordering Works</h3>
          <p>1. Select a restaurant and create a group room.</p>
          <p>2. Share the generated Room ID or link with your friends.</p>
          <p>3. Members join the room and add their food items.</p>
          <p>4. Owner confirms the order and sends combined request to restaurant.</p>
        </div>

      </div>
    </div>
  );
}

export default GroupOrder;