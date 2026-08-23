import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        FoodFusion
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/group-order">Group Order</Link>
        <Link to="/orders">Orders</Link>
      </div>

      <div className="navbar-actions">
        <Link to="/cart">Cart</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar;