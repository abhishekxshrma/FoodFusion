import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

function Profile() {
  const { user, updateProfileState } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [coords, setCoords] = useState({
    latitude: user?.latitude ?? null,
    longitude: user?.longitude ?? null,
  });
  const [geoStatus, setGeoStatus] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCity(user.city || "");
      setCoords({
        latitude: user.latitude ?? null,
        longitude: user.longitude ?? null,
      });
    }
  }, [user]);

  const handleDetectCoords = () => {
    if (!navigator.geolocation) {
      setGeoStatus("Geolocation is not supported by your browser.");
      return;
    }
    setGeoStatus("Detecting GPS coordinates...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
        });
        setGeoStatus("✓ Coordinates detected successfully!");
      },
      (err) => {
        console.warn(err);
        setGeoStatus("Could not retrieve GPS coordinates. Permission denied.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setError("");
    setLoading(true);

    try {
      const updated = await api.auth.updateProfile({
        name,
        phone,
        address,
        city,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      updateProfileState(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Customer Profile</h1>
      <p>Manage your account details and default delivery address.</p>

      {saved && (
        <div className="alert-success" style={{ margin: "20px 0", padding: "12px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "6px" }}>
          ✓ Profile saved successfully!
        </div>
      )}

      {error && (
        <div style={{ margin: "20px 0", padding: "12px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "6px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="dashboard-card" style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Email Address</label>
          <input
            type="email"
            value={email}
            disabled
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", background: "#f1f5f9" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>City / Campus Region</label>
          <input
            type="text"
            value={city}
            placeholder="e.g. Delhi, North Campus"
            onChange={(e) => setCity(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Default Delivery Address</label>
          <textarea
            rows="3"
            value={address}
            placeholder="Hostel Block B, Room 204, Main Campus"
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "20px", background: "#f8fafc", padding: "15px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label style={{ fontWeight: "600", fontSize: "14px", margin: 0 }}>📍 GPS Location Coordinates</label>
            <button
              type="button"
              onClick={handleDetectCoords}
              style={{ background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
            >
              Detect Current GPS
            </button>
          </div>
          {geoStatus && <p style={{ fontSize: "12px", color: geoStatus.includes("✓") ? "#16a34a" : "#b45309", margin: "4px 0" }}>{geoStatus}</p>}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={coords.latitude ?? ""}
              onChange={(e) => setCoords({ ...coords, latitude: e.target.value ? Number(e.target.value) : null })}
              style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }}
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={coords.longitude ?? ""}
              onChange={(e) => setCoords({ ...coords, longitude: e.target.value ? Number(e.target.value) : null })}
              style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }}
            />
          </div>
        </div>

        <button type="submit" className="primary-btn" disabled={loading} style={{ cursor: "pointer" }}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
