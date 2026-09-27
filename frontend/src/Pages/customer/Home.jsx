import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import RestrauntCard from "../../components/RestrauntCard";
import './Home.css';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await api.restaurants.getAll();
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load restaurants from API:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <h1>Order. Share. Enjoy.</h1>

        <p>
          Discover delicious food or create a group order
          and enjoy meals together.
        </p>

        <div className="hero-buttons">
          <Link to="/restaurants" className="btn">
            Explore Restaurants
          </Link>

          <Link to="/group-order" className="btn">
            Start Group Order
          </Link>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section>
        <h2>Popular Restaurants</h2>

        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Loading restaurants...</p>
        ) : restaurants.length > 0 ? (
          <div className="restaurant-grid">
            {restaurants.slice(0, 4).map((restaurant) => (
              <RestrauntCard
                key={restaurant._id || restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            No restaurants available at the moment.
          </p>
        )}
      </section>

      {/* Group Ordering */}
      <section className="group-section">
        <h2>Order Together with FoodFusion</h2>

        <p>
          Create a group room, invite your friends,
          and build one shared food order.
        </p>

        <Link to="/group-order" className="btn">
          Create Group Order
        </Link>
      </section>
    </div>
  );
}

export default Home;
