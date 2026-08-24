import { Link, NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <header className="admin-navbar">
        <div className="admin-navbar-container">
          <Link to="/admin/dashboard" className="admin-logo">
            ⚡ FoodFusion <span className="portal-badge">Admin</span>
          </Link>

          <nav className="admin-nav-links">
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
            <NavLink to="/admin/users">Users</NavLink>
            <NavLink to="/admin/restaurants">Restaurants</NavLink>
            <NavLink to="/admin/orders">Orders</NavLink>
            <NavLink to="/admin/settings">Settings</NavLink>
          </nav>

          <div className="admin-navbar-actions">
            <Link to="/" className="switch-portal-link">← Switch Portal</Link>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <Outlet />
      </main>

      <footer className="admin-footer">
        <p>FoodFusion Super Admin System © 2026</p>
      </footer>
    </div>
  );
}

export default AdminLayout;
