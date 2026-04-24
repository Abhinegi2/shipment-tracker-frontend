import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shipmentsAPI } from "../api";
import { LOCATIONS, inputStyle, FormField } from "../components/UI";

export default function CreateShipment() {
  const [form, setForm] = useState({ equipment: "", quantity: "", fromLocation: "", toLocation: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await shipmentsAPI.create({ ...form, quantity: parseInt(form.quantity) });
      navigate(`/shipments/${res.data.trackingId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create shipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#1E293B" }}>Create New Shipment</h2>
      {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <FormField label="Equipment Name" required>
              <input value={form.equipment} onChange={set("equipment")} required placeholder="e.g. Laptop, Projector" style={{ ...inputStyle, display: "block" }} />
            </FormField>
            <FormField label="Quantity" required>
              <input value={form.quantity} onChange={set("quantity")} required type="number" min="1" placeholder="Enter quantity" style={{ ...inputStyle, display: "block" }} />
            </FormField>
            <FormField label="Source Location" required>
              <select value={form.fromLocation} onChange={set("fromLocation")} required style={{ ...inputStyle, display: "block", cursor: "pointer" }}>
                <option value="">Select source location</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </FormField>
            <FormField label="Destination Location" required>
              <select value={form.toLocation} onChange={set("toLocation")} required style={{ ...inputStyle, display: "block", cursor: "pointer" }}>
                <option value="">Select destination location</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </FormField>
          </div>
          <div style={{ marginBottom: 24 }}>
            <FormField label="Notes (Optional)">
              <textarea value={form.notes} onChange={set("notes")} placeholder="Additional notes..." rows={3} style={{ ...inputStyle, display: "block", resize: "vertical" }} />
            </FormField>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button type="button" onClick={() => navigate("/shipments")} style={{ padding: "10px 24px", background: "#F1F5F9", color: "#374151", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: "10px 24px", background: loading ? "#93C5FD" : "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Creating..." : "Create Shipment"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
