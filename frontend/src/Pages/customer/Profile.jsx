import { useState } from "react";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    address: "Sector 12, Chandigarh",
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Customer Profile</h1>
      <p>Manage your account details and default delivery address.</p>

      {saved && (
        <div className="alert-success" style={{ margin: "20px 0" }}>
          ✓ Profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="dashboard-card" style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label>Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Email Address</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Phone Number</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Default Address</label>
          <textarea
            rows="3"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />
        </div>

        <button type="submit" className="save-btn">
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;
