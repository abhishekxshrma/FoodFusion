import "./Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    alert("Logged out successfully");
    navigate("/");
  };

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

        <div className="navbar-actions" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Link to="/cart" style={{ position: "relative" }}>
            🛒 Cart {cartCount > 0 && <span style={{ background: "#e85d04", color: "#fff", borderRadius: "50%", padding: "2px 6px", fontSize: "12px", marginLeft: "4px" }}>{cartCount}</span>}
          </Link>

          {user ? (
            <>
              <Link to="/profile">👤 {user.name.split(" ")[0]}</Link>
              <button
                onClick={handleLogout}
                style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "14px" }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/customer/login" style={{ fontWeight: "bold", color: "#e85d04" }}>
              Login
            </Link>
          )}

          <Link to="/" style={{ fontSize: "13px", color: "#888", borderLeft: "1px solid #ccc", paddingLeft: "10px" }}>
            Portals
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;