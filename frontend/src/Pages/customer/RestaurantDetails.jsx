import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { api } from "../../services/api";

function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const restData = await api.restaurants.getById(id);
        setRestaurant(restData);

        if (restData) {
          const restId = restData._id || restData.id;
          const menuData = await api.food.getMenu(restId);
          setMenu(Array.isArray(menuData) ? menuData : []);
        }
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
        setRestaurant(null);
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Loading restaurant menu...</p>;
  }

  if (!restaurant) {
    return (
      <div className="dashboard-card" style={{ textAlign: "center", margin: "40px auto", maxWidth: "500px" }}>
        <h1>Restaurant Not Found</h1>
        <p>The restaurant you are looking for does not exist.</p>
        <Link to="/restaurants" className="primary-btn" style={{ marginTop: "15px" }}>Back to Restaurants</Link>
      </div>
    );
  }

  const startGroupOrder = () => {
    navigate("/group-order", { state: { selectedRestaurantId: restaurant._id || restaurant.id } });
  };

  return (
    <div>
      {/* Restaurant Info Header Card */}
      <div className="dashboard-card" style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h1>{restaurant.name}</h1>
            <p style={{ margin: "5px 0", color: "#444", fontWeight: "500" }}>{restaurant.cuisine}</p>
            <p style={{ margin: "5px 0", color: "#777" }}>⭐ {restaurant.rating || 4.5} • 🕐 {restaurant.deliveryTime || "25-30 min"} • Location: {restaurant.location || "North Campus"}</p>
            {restaurant.description && <p style={{ margin: "6px 0 0", color: "#555", fontSize: "14px" }}>{restaurant.description}</p>}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="primary-btn" onClick={startGroupOrder} style={{ background: "#2563eb" }}>
              👥 Start Group Order
            </button>
            <Link to="/restaurants" className="secondary-btn">← Back to Restaurants</Link>
          </div>
        </div>
      </div>

      <h2>Restaurant Menu</h2>

      {menu.length === 0 ? (
        <p style={{ padding: "20px", color: "#666" }}>No food items available yet for this restaurant.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px", marginTop: "20px" }}>
          {menu.map((item) => (
            <div key={item._id || item.id} className="dashboard-card" style={{ display: "flex", flexDirection: "column" }}>
              <img
                src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                alt={item.name}
                style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px", marginBottom: "15px" }}
              />

              <h3 style={{ margin: "0 0 6px" }}>{item.name}</h3>
              <p style={{ color: "#666", fontSize: "14px", flex: 1, margin: "0 0 12px" }}>{item.description}</p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#e85d04" }}>₹{item.price}</span>

                <button
                  className="primary-btn"
                  onClick={() => addToCart(item, restaurant)}
                  disabled={item.isAvailable === false}
                >
                  {item.isAvailable === false ? "Unavailable" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RestaurantDetails;
