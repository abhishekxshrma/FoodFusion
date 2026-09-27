import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await register({
        name,
        email,
        password,
        role,
        phone,
        address,
      });

      alert("Account created successfully!");

      if (data.role === "restaurant") {
        navigate("/restaurant/dashboard");
      } else if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="dashboard-card" style={{ width: "100%", maxWidth: "460px", padding: "35px 30px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>Create Account</h1>
        <p style={{ textAlign: "center", marginBottom: "25px", color: "#666" }}>Join FoodFusion today.</p>

        {error && (
          <div style={{ padding: "10px 14px", backgroundColor: "#fee2e2", border: "1px solid #f87171", color: "#991b1b", borderRadius: "6px", marginBottom: "20px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Account Type / Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", background: "#fff" }}
            >
              <option value="customer">Customer (Order Food)</option>
              <option value="restaurant">Restaurant Partner (Manage Menu & Orders)</option>
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
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

          <div style={{ marginBottom: "15px" }}>
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

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Phone Number</label>
            <input
              type="text"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Delivery Address / Campus Location</label>
            <input
              type="text"
              placeholder="e.g. Hostel Block B, Room 204"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
            style={{ width: "100%", padding: "12px", fontSize: "15px", cursor: "pointer" }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#666" }}>
            Already have an account? <Link to="/login" style={{ color: "#e85d04", fontWeight: "bold", textDecoration: "none" }}>Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;