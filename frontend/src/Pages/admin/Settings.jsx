import { useState } from "react";

function AdminSettings() {
  const [settings, setSettings] = useState({
    commissionRate: "10",
    deliveryFee: "40",
    taxRate: "5",
    platformName: "FoodFusion",
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="admin-page">
      <h1>Platform Settings</h1>
      <p>Configure commission rates, taxes, delivery fees, and general system settings.</p>

      {saved && (
        <div className="alert-success" style={{ margin: "20px 0" }}>
          ✓ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="dashboard-card" style={{ maxWidth: "600px", marginTop: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label>Platform Name</label>
          <input
            type="text"
            value={settings.platformName}
            onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Commission Rate (%)</label>
          <input
            type="number"
            value={settings.commissionRate}
            onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Standard Delivery Fee (₹)</label>
          <input
            type="number"
            value={settings.deliveryFee}
            onChange={(e) => setSettings({ ...settings, deliveryFee: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Taxes & GST (%)</label>
          <input
            type="number"
            value={settings.taxRate}
            onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
          />
        </div>

        <button type="submit" className="save-btn">
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default AdminSettings;
