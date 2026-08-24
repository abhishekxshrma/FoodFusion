import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Account created successfully!");
    navigate("/customer");
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="dashboard-card" style={{ width: "100%", maxWidth: "420px", padding: "35px 30px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>Create Account</h1>
        <p style={{ textAlign: "center", marginBottom: "25px", color: "#666" }}>Join FoodFusion today.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primary-btn" style={{ width: "100%", padding: "12px", fontSize: "15px", marginTop: "10px" }}>
            Create Account
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