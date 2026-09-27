import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../Auth.css";

function RestaurantLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Pass role="restaurant" so the backend enforces the correct portal
      const data = await login({ email, password, role: "restaurant" });
      navigate("/restaurant/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
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

        <div className="auth-portal-badge">🍴 Restaurant Partner Login</div>

        <h1>Partner Sign In</h1>
        <p className="auth-subtitle">Access your restaurant dashboard.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="restaurant@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-toggle">
          Don&apos;t have an account?
          <Link to="/restaurant/signup">Sign Up</Link>
        </p>

        <hr className="auth-divider" />
        <Link to="/" className="auth-back-link">← Back to Portal Selection</Link>
      </div>
    </div>
  );
}

export default RestaurantLogin;
