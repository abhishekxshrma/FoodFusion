import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import restaurants from "../../data/restaurants";
import food from "../../data/food";

function RestaurantDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const restaurant = restaurants.find(
    (restaurant) => restaurant.id === Number(id)
  );

  if (!restaurant) {
    return (
      <div className="dashboard-card" style={{ textCenter: "center", margin: "40px auto", maxWidth: "500px" }}>
        <h1>Restaurant not found</h1>
        <p>The restaurant you are looking for does not exist.</p>
        <Link to="/restaurants" className="primary-btn" style={{ marginTop: "15px" }}>Back to Restaurants</Link>
      </div>
    );
  }

  const menu = food.filter(
    (item) => item.restaurantId === restaurant.id
  );

  return (
    <div>
      {/* Restaurant Info Header Card */}
      <div className="dashboard-card" style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h1>{restaurant.name}</h1>
            <p style={{ margin: "5px 0", color: "#444", fontWeight: "500" }}>{restaurant.cuisine}</p>
            <p style={{ margin: "5px 0", color: "#777" }}>⭐ {restaurant.rating} • 🕐 {restaurant.deliveryTime}</p>
          </div>
          <Link to="/restaurants" className="secondary-btn">← Back to Restaurants</Link>
        </div>
      </div>

      <h2>Menu</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px", marginTop: "20px" }}>
        {menu.map((item) => (
          <div key={item.id} className="dashboard-card" style={{ display: "flex", flexDirection: "column" }}>
            <img
              src={item.image}
              alt={item.name}
              style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px", marginBottom: "15px" }}
            />

            <h3 style={{ margin: "0 0 6px" }}>{item.name}</h3>
            <p style={{ color: "#666", fontSize: "14px", flex: 1, margin: "0 0 12px" }}>{item.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
              <span style={{ fontSize: "18px", fontWeight: "bold", color: "#e85d04" }}>₹{item.price}</span>

              <button className="primary-btn" onClick={() => addToCart(item, restaurant)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantDetails;
