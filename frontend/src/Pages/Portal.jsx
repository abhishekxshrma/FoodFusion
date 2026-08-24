import { useNavigate } from "react-router-dom";
import "./Portal.css";

function Portal() {
  const navigate = useNavigate();

  return (
    <div className="portal-page">
      <div className="portal-container">
        <h1>FoodFusion</h1>

        <p className="portal-tagline">
          Order. Share. Enjoy.
        </p>

        <h2>Choose your portal</h2>

        <div className="portal-options">

          {/* CUSTOMER */}
          <div className="portal-card">
            <div className="portal-icon">👤</div>

            <h3>Customer</h3>

            <p>
              Browse restaurants and order delicious food.
            </p>

            <button
              onClick={() => navigate("/customer")}
            >
              Continue as Customer
            </button>
          </div>


          {/* RESTAURANT */}
          <div className="portal-card">
            <div className="portal-icon">🍴</div>

            <h3>Restaurant Partner</h3>

            <p>
              Manage your restaurant, menu and orders.
            </p>

            <button
              onClick={() => navigate("/restaurant/dashboard")}
            >
              Continue as Restaurant
            </button>
          </div>


          {/* ADMIN */}
          <div className="portal-card">
            <div className="portal-icon">🛠️</div>

            <h3>Admin</h3>

            <p>
              Manage users, restaurants and the platform.
            </p>

            <button
              onClick={() => navigate("/admin/dashboard")}
            >
              Continue as Admin
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Portal;