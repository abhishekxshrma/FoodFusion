import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../Auth.css";

function CustomerLogin() {
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
      // Pass role="customer" so the backend enforces the correct portal
      const data = await login({ email, password, role: "customer" });
      navigate("/customer");
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
          <span>🍔 FoodFusion</span>
          <sub>Customer Portal</sub>
        </div>

        <div className="auth-portal-badge">👤 Customer Login</div>

        <h1>Welcome Back!</h1>
        <p className="auth-subtitle">Sign in to order delicious food.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
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
          <Link to="/customer/signup">Sign Up</Link>
        </p>

        <hr className="auth-divider" />
        <Link to="/" className="auth-back-link">← Back to Portal Selection</Link>
      </div>
    </div>
  );
}

export default CustomerLogin;
