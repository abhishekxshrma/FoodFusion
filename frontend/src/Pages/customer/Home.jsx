import { Link } from "react-router-dom";
import restaurants from "../../data/restaurants";
import './Home.css';
import RestrauntCard from "../../components/RestrauntCard";

function Home() {
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

        <div className="restaurant-grid">
          {restaurants.slice(0, 4).map((restaurant) => (
            <RestrauntCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
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
