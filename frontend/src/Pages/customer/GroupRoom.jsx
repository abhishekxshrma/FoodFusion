import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./GroupRoom.css";

function GroupRoom() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [menu, setMenu] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "Main Campus Hostel");
  const [copyFeedback, setCopyFeedback] = useState("");

  const fetchRoomData = useCallback(async (isPolling = false) => {
    try {
      const roomData = await api.groupOrders.getRoom(roomId);
      setRoom(roomData);

      // Auto-join room if logged in customer is not yet in members list
      if (user && (roomData.status === "active" || roomData.status === "locked")) {
        const isMember = roomData.members.some(
          (m) => String(m.user?._id || m.user) === String(user._id)
        );
        if (!isMember) {
          try {
            await api.groupOrders.joinRoom(roomId);
          } catch (err) {
            console.warn("Auto join room warning:", err);
          }
        }
      }

      // Fetch restaurant menu for adding items (only first load)
      if (!isPolling && roomData.restaurant) {
        const restId = roomData.restaurant._id || roomData.restaurant;
        try {
          const menuData = await api.food.getMenu(restId);
          const availableMenu = Array.isArray(menuData) ? menuData : [];
          setMenu(availableMenu);
          if (availableMenu.length > 0) {
            setSelectedFoodId(availableMenu[0]._id || availableMenu[0].id);
          }
        } catch {
          setMenu([]);
        }
      }
    } catch (err) {
      console.error("Failed to load group room:", err);
      if (!isPolling) {
        setRoom(null);
        setMenu([]);
      }
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
    }
  }, [roomId, user]);

  useEffect(() => {
    fetchRoomData(false);

    // Auto-sync polling every 3 seconds to keep group room synchronized
    const interval = setInterval(() => {
      fetchRoomData(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchRoomData]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedFoodId) {
      alert("Please select a food item.");
      return;
    }

    setActionLoading(true);
    try {
      await api.groupOrders.addMemberItem(roomId, selectedFoodId, quantity);
      setQuantity(1);
      fetchRoomData(true);
    } catch (err) {
      alert(err.message || "Failed to add item to room");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItemQty = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    setActionLoading(true);
    try {
      if (newQty <= 0) {
        await api.groupOrders.removeMemberItem(roomId, itemId);
      } else {
        await api.groupOrders.updateMemberItem(roomId, itemId, newQty);
      }
      fetchRoomData(true);
    } catch (err) {
      alert(err.message || "Failed to update item quantity");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Remove this item from the group order?")) return;

    setActionLoading(true);
    try {
      await api.groupOrders.removeMemberItem(roomId, itemId);
      fetchRoomData(true);
    } catch (err) {
      alert(err.message || "Failed to remove item");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleLock = async () => {
    setActionLoading(true);
    try {
      await api.groupOrders.toggleLockRoom(roomId);
      fetchRoomData(true);
    } catch (err) {
      alert(err.message || "Failed to update lock state");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinalizeGroupOrder = async () => {
    if (!window.confirm("Finalize group order and send combined order to restaurant?")) return;

    setActionLoading(true);
    try {
      const res = await api.groupOrders.confirmGroupOrder(roomId, deliveryAddress);
      alert(res.message || "Group order confirmed successfully!");
      fetchRoomData(true);
      if (res.order?._id) {
        navigate(`/orders/${res.order._id}`);
      }
    } catch (err) {
      alert(err.message || "Failed to finalize order");
    } finally {
      setActionLoading(false);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopyFeedback("✓ Room ID copied!");
    setTimeout(() => setCopyFeedback(""), 2500);
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/group-room/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopyFeedback("✓ Shareable Invitation Link copied!");
    setTimeout(() => setCopyFeedback(""), 2500);
  };

  if (loading) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Loading group room data...</p>;
  }

  if (!room) {
    return (
      <div className="dashboard-card" style={{ textAlign: "center", margin: "40px auto", maxWidth: "500px" }}>
        <h1>Group Room Not Found</h1>
        <p style={{ color: "#666", margin: "10px 0" }}>The group room you requested does not exist or has expired.</p>
        <Link to="/group-order" className="primary-btn" style={{ marginTop: "15px" }}>Create New Group Room</Link>
      </div>
    );
  }

  const isOwner = user && (
    String(room.owner?._id || room.owner) === String(user._id) ||
    room.ownerName === user.name
  );

  const isLocked = room.status === "locked" || room.status === "confirmed";

  const total = room.memberItems
    ? room.memberItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  // Group items by member name for individual subtotals display
  const memberSubtotals = {};
  if (room.memberItems) {
    room.memberItems.forEach((item) => {
      const name = item.userName || "Member";
      memberSubtotals[name] = (memberSubtotals[name] || 0) + item.price * item.quantity;
    });
  }

  return (
    <div className="group-room-page">
      <div className="group-room-container">

        {/* Room Header */}
        <div className="group-room-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ margin: 0 }}>{room.roomName || "Group Order Room"}</h1>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background:
                    room.status === "confirmed"
                      ? "#dcfce7"
                      : room.status === "locked"
                      ? "#fee2e2"
                      : "#fef9c3",
                  color:
                    room.status === "confirmed"
                      ? "#166534"
                      : room.status === "locked"
                      ? "#991b1b"
                      : "#854d0e",
                }}
              >
                {room.status === "confirmed" ? "✓ Finalized & Sent" : room.status === "locked" ? "🔒 Locked" : "🟢 Active"}
              </span>
            </div>

            <p style={{ margin: "6px 0 2px" }}>
              Room ID: <strong style={{ color: "#e85d04", letterSpacing: "1px", fontSize: "16px" }}>{roomId}</strong> • Restaurant: <strong>{room.restaurant?.name || "Selected Restaurant"}</strong>
            </p>
            <p style={{ fontSize: "14px", color: "#666", margin: "2px 0 0" }}>
              Room Creator: <strong>{room.ownerName || room.owner?.name || "Owner"}</strong> {isOwner && "(You)"}
            </p>
          </div>

          {/* Share Buttons */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={copyRoomId} className="secondary-btn" style={{ background: "#fff", fontSize: "13px" }}>
              📋 Copy Room ID
            </button>
            <button onClick={copyRoomLink} className="secondary-btn" style={{ background: "#fff", fontSize: "13px" }}>
              🔗 Copy Invite Link
            </button>
          </div>
        </div>

        {copyFeedback && (
          <div style={{ padding: "8px 12px", background: "#f0fdf4", color: "#166534", borderRadius: "6px", marginBottom: "15px", fontSize: "13px", fontWeight: "600" }}>
            {copyFeedback}
          </div>
        )}

        {/* Deadline & Lock Banner */}
        <div className="room-deadline" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <span>⏰ Closes at / Deadline: <strong>{room.deadline || "8:00 PM"}</strong></span>

          {isOwner && room.status !== "confirmed" && (
            <button
              onClick={handleToggleLock}
              disabled={actionLoading}
              style={{
                background: room.status === "locked" ? "#16a34a" : "#dc2626",
                color: "#fff",
                border: "none",
                padding: "6px 14px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              {room.status === "locked" ? "🔓 Unlock Room" : "🔒 Lock Room"}
            </button>
          )}
        </div>

        {room.status === "confirmed" && (
          <div className="order-success" style={{ padding: "14px", backgroundColor: "#dcfce7", color: "#15803d", borderRadius: "6px", marginBottom: "20px", fontWeight: "600" }}>
            ✓ This group order has been finalized and sent to {room.restaurant?.name || "the restaurant"}!
            {room.combinedOrder && (
              <Link to={`/orders/${room.combinedOrder}`} style={{ marginLeft: "10px", color: "#166534", textDecoration: "underline" }}>
                View Combined Order Tracking →
              </Link>
            )}
          </div>
        )}

        {room.status === "locked" && (
          <div style={{ padding: "12px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "6px", marginBottom: "20px", fontSize: "14px" }}>
            🔒 Room is locked by creator. New items or modifications cannot be made. Waiting for confirmation.
          </div>
        )}

        {/* Add Food Item Section (If Room Active) */}
        {!isLocked && menu.length > 0 && (
          <section className="dashboard-card" style={{ marginBottom: "25px", background: "#f8fafc" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>➕ Add Food Item to Group Order</h2>

            <form onSubmit={handleAddItem} style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: 2, minWidth: "200px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>Select Food Item</label>
                <select
                  value={selectedFoodId}
                  onChange={(e) => setSelectedFoodId(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", background: "#fff" }}
                >
                  {menu.map((item) => (
                    <option key={item._id || item.id} value={item._id || item.id}>
                      {item.name} — ₹{item.price}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: "100px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "600" }}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>

              <button type="submit" className="primary-btn" disabled={actionLoading} style={{ height: "42px", cursor: "pointer" }}>
                {actionLoading ? "Adding..." : "Add to Group Cart"}
              </button>
            </form>
          </section>
        )}

        <div className="group-room-grid">

          {/* Members Card & Subtotals */}
          <section className="participants-card">
            <h2>Group Members ({room.members ? room.members.length : 0})</h2>

            {room.members && room.members.length > 0 ? (
              room.members.map((member, index) => {
                const memberName = member.name || member.userName || `Member ${index + 1}`;
                const memberSub = memberSubtotals[memberName] || 0;
                const isMemberOwner = String(member.user?._id || member.user) === String(room.owner?._id || room.owner);

                return (
                  <div className="participant" key={member._id || index} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                    <div>
                      <strong>
                        {memberName} {isMemberOwner ? "👑 (Owner)" : ""}
                      </strong>
                      <p style={{ margin: "2px 0 0", color: "#e85d04", fontSize: "13px", fontWeight: "600" }}>
                        Subtotal: ₹{memberSub}
                      </p>
                    </div>

                    <span style={{ color: "#16a34a", fontSize: "12px", fontWeight: "bold" }}>✓ Active</span>
                  </div>
                );
              })
            ) : (
              <p>No members joined yet.</p>
            )}
          </section>

          {/* Shared Group Cart */}
          <section className="group-cart-card">
            <h2>Shared Group Cart</h2>

            {room.memberItems && room.memberItems.length > 0 ? (
              room.memberItems.map((item) => {
                const isItemOwner = user && (String(item.user?._id || item.user) === String(user._id));
                const canModify = !isLocked && (isItemOwner || isOwner);

                return (
                  <div className="group-item" key={item._id || item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eee", gap: "10px" }}>
                    <div>
                      <strong style={{ fontSize: "15px" }}>{item.name}</strong>
                      <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#666" }}>
                        Selected by: <strong style={{ color: isItemOwner ? "#2563eb" : "#333" }}>{item.userName} {isItemOwner && "(You)"}</strong>
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {canModify ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQty(item._id, item.quantity, -1)}
                            disabled={actionLoading}
                            style={{ border: "none", background: "none", cursor: "pointer", fontWeight: "bold", fontSize: "16px", padding: "0 4px" }}
                          >
                            −
                          </button>
                          <span style={{ fontSize: "14px", fontWeight: "bold", minWidth: "16px", textAlign: "center" }}>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQty(item._id, item.quantity, 1)}
                            disabled={actionLoading}
                            style={{ border: "none", background: "none", cursor: "pointer", fontWeight: "bold", fontSize: "16px", padding: "0 4px" }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: "14px" }}>× {item.quantity}</span>
                      )}

                      <strong style={{ color: "#e85d04", minWidth: "55px", textAlign: "right" }}>₹{item.price * item.quantity}</strong>

                      {canModify && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={actionLoading}
                          title="Remove item"
                          style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ padding: "15px 0", color: "#666" }}>No food items added to the room yet.</p>
            )}

            <hr style={{ margin: "15px 0" }} />

            <div className="group-total" style={{ display: "flex", justifyContent: "space-between", fontSize: "18px" }}>
              <strong>Group Total</strong>
              <strong style={{ color: "#e85d04" }}>₹{total}</strong>
            </div>

            {/* Delivery address input for owner */}
            {isOwner && room.status !== "confirmed" && (
              <div style={{ marginTop: "15px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Hostel Block B, Room 204"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px" }}
                />
              </div>
            )}

            {/* Finalize Button for Owner */}
            {isOwner && (
              <button
                className="finalize-btn"
                onClick={handleFinalizeGroupOrder}
                disabled={room.status === "confirmed" || actionLoading || !room.memberItems || room.memberItems.length === 0}
                style={{ marginTop: "15px", cursor: "pointer" }}
              >
                {room.status === "confirmed"
                  ? "✓ Order Finalized & Sent"
                  : actionLoading
                  ? "Finalizing Order..."
                  : "Confirm Combined Group Order (Owner)"}
              </button>
            )}

            {!isOwner && room.status !== "confirmed" && (
              <p style={{ fontSize: "13px", color: "#666", marginTop: "15px", textAlign: "center" }}>
                Waiting for room owner ({room.ownerName || "Owner"}) to confirm and place the combined order.
              </p>
            )}
          </section>

        </div>

      </div>
    </div>
  );
}

export default GroupRoom;