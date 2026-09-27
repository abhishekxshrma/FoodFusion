import { NavLink, Link, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./RestaurantLayout.css";

function RestaurantLayout() {
  const { user, loading } = useAuth();

  // Wait for auth state to resolve
  if (loading) return null;

  // Not logged in → redirect to restaurant login
  if (!user) {
    return <Navigate to="/restaurant/login" replace />;
  }

  // Wrong role → redirect to restaurant login
  if (user.role !== "restaurant" && user.role !== "admin") {
    return <Navigate to="/restaurant/login" replace />;
  }

  return (
    <div className="restaurant-layout">
      <header className="restaurant-navbar">
        <div className="restaurant-navbar-container">
          <Link to="/restaurant/dashboard" className="restaurant-logo">
            🍴 FoodFusion <span className="portal-badge">Partner</span>
          </Link>

          <nav className="restaurant-nav-links">
            <NavLink to="/restaurant/dashboard">Dashboard</NavLink>
            <NavLink to="/restaurant/menu">Menu</NavLink>
            <NavLink to="/restaurant/orders">Orders</NavLink>
            <NavLink to="/restaurant/profile">Profile</NavLink>
          </nav>

          <div className="restaurant-navbar-actions">
            <Link to="/" className="switch-portal-link">← Switch Portal</Link>
          </div>
        </div>
      </header>

      <main className="restaurant-main">
        <Outlet />
      </main>
    </div>
  );
}

export default RestaurantLayout;