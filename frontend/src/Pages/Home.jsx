import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Hero */}
      <section>
        <h1>Order. Share. Enjoy.</h1>

        <p>
          Discover delicious food or create a group order
          and enjoy meals together.
        </p>

        <Link to="/restaurants">
          Explore Restaurants
        </Link>

        <Link to="/group-order">
          Start Group Order
        </Link>
      </section>

      {/* Popular Restaurants */}
      <section>
        <h2>Popular Restaurants</h2>

        <div>
          {restaurants.slice(0, 4).map((restaurant) => (
            <div key={restaurant.id}>
              <img
                src={restaurant.image}
                alt={restaurant.name}
                width="200"
              />

              <h3>{restaurant.name}</h3>
              <p>{restaurant.cuisine}</p>
              <p>⭐ {restaurant.rating}</p>

              <Link to={`/restaurant/${restaurant.id}`}>
                View Restaurant
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Group Ordering */}
      <section>
        <h2>Order Together with FoodFusion</h2>

        <p>
          Create a group room, invite your friends,
          and build one shared food order.
        </p>

        <Link to="/group-order">
          Create Group Order
        </Link>
      </section>
    </div>
  );
}

export default Home;