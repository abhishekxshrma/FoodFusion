import { useState } from "react";
import restaurants from "../../data/restaurants";
import RestrauntCard from "../../components/RestrauntCard";
import "./Restaurants.css";

function Restaurants() {
  const [search, setSearch] = useState("");

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="restaurants-page">
      <h1>Restaurants</h1>

      <input
        className="search-input"
        type="text"
        placeholder="Search restaurants or cuisine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="restaurant-grid">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestrauntCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
}

export default Restaurants;
