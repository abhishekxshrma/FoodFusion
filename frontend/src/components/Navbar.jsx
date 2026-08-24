import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/customer" className="navbar-logo">
          🍴 FoodFusion
        </Link>

        <div className="navbar-links">
          <NavLink to="/customer">Home</NavLink>
          <NavLink to="/restaurants">Restaurants</NavLink>
          <NavLink to="/group-order">Group Order</NavLink>
          <NavLink to="/orders">Orders</NavLink>
        </div>

        <div className="navbar-actions">
          <Link to="/cart">🛒 Cart</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/" style={{ fontSize: "14px", color: "#666", marginLeft: "10px" }}>← Portals</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;