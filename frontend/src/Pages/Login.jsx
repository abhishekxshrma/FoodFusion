import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
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
      const data = await login({ email, password });
      alert(`Welcome back, ${data.name}!`);

      if (data.role === "restaurant") {
        navigate("/restaurant/dashboard");
      } else if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="dashboard-card" style={{ width: "100%", maxWidth: "440px", padding: "35px 30px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>Welcome Back</h1>
        <p style={{ textAlign: "center", marginBottom: "25px", color: "#666" }}>Please log in to your FoodFusion account.</p>

        {error && (
          <div style={{ padding: "10px 14px", backgroundColor: "#fee2e2", border: "1px solid #f87171", color: "#991b1b", borderRadius: "6px", marginBottom: "20px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
            style={{ width: "100%", padding: "12px", fontSize: "15px", marginTop: "10px", cursor: "pointer" }}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#666" }}>
            Don't have an account? <Link to="/register" style={{ color: "#e85d04", fontWeight: "bold", textDecoration: "none" }}>Register</Link>
          </p>
        </form>

        <div style={{ marginTop: "25px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "10px", textAlign: "center" }}>Quick Demo Login (Click to fill):</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => fillDemoCredentials("rahul@gmail.com", "password123")}
              style={{ padding: "6px 10px", fontSize: "12px", borderRadius: "4px", border: "1px solid #ddd", background: "#f9f9f9", cursor: "pointer" }}
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("spice@foodfusion.com", "password123")}
              style={{ padding: "6px 10px", fontSize: "12px", borderRadius: "4px", border: "1px solid #ddd", background: "#f9f9f9", cursor: "pointer" }}
            >
              🍴 Restaurant
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("admin@foodfusion.com", "adminpassword")}
              style={{ padding: "6px 10px", fontSize: "12px", borderRadius: "4px", border: "1px solid #ddd", background: "#f9f9f9", cursor: "pointer" }}
            >
              🛠️ Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;