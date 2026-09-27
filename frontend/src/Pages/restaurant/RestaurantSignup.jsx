import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../Auth.css";

function RestaurantSignup() {
  const navigate = useNavigate();
  const { registerRestaurant } = useAuth();

  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await registerRestaurant({
        restaurantName: formData.restaurantName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
      });
      navigate("/restaurant/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span>🍴 FoodFusion</span>
          <sub>Restaurant Partner Portal</sub>
        </div>

        <div className="auth-portal-badge">🍴 Restaurant Partner Sign Up</div>

        <h1>Join as a Partner</h1>
        <p className="auth-subtitle">Register your restaurant on FoodFusion.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              placeholder="e.g. Spice Garden"
              value={formData.restaurantName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form-group">
            <label>Owner Name</label>
            <input
              type="text"
              name="ownerName"
              placeholder="e.g. Rahul Sharma"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form-row">
            <div className="auth-form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="owner@restaurant.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label>Restaurant Address</label>
            <input
              type="text"
              name="address"
              placeholder="e.g. 12, MG Road, Bangalore"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="auth-form-row">
            <div className="auth-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="auth-form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Registering Restaurant..." : "Register Restaurant"}
          </button>
        </form>

        <p className="auth-toggle">
          Already have an account?
          <Link to="/restaurant/login">Login</Link>
        </p>

        <hr className="auth-divider" />
        <Link to="/" className="auth-back-link">← Back to Portal Selection</Link>
      </div>
    </div>
  );
}

export default RestaurantSignup;
