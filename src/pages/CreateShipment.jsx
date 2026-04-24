import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shipmentsAPI } from "../api";
import { INDIAN_STATES, ITEM_CATEGORIES, inputStyle, FormField } from "../components/UI";

const Section = ({ title, children }) => (
  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 20 }}>
    <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>{title}</h3>
    <div className="grid-auto">
      {children}
    </div>
  </div>
);

export default function CreateShipment() {
  const [form, setForm] = useState({
    equipment: "", itemDescription: "", category: "", weight: "",
    quantity: "", fromState: "", fromDistrict: "", fromPincode: "",
    toState: "", toDistrict: "", toPincode: "",
    senderName: "", senderPhone: "",
    recipientName: "", recipientPhone: "",
    estimatedDelivery: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const fromLocation = [form.fromDistrict, form.fromState].filter(Boolean).join(", ") || form.fromState;
      const toLocation = [form.toDistrict, form.toState].filter(Boolean).join(", ") || form.toState;
      const payload = {
        equipment: form.equipment,
        itemDescription: form.itemDescription,
        category: form.category,
        weight: form.weight ? parseFloat(form.weight) : undefined,
        quantity: parseInt(form.quantity),
        fromLocation, fromState: form.fromState, fromDistrict: form.fromDistrict,
        toLocation, toState: form.toState, toDistrict: form.toDistrict,
        senderName: form.senderName, senderPhone: form.senderPhone,
        recipientName: form.recipientName, recipientPhone: form.recipientPhone,
        estimatedDelivery: form.estimatedDelivery || undefined,
        notes: form.notes,
      };
      const res = await shipmentsAPI.create(payload);
      navigate(`/shipments/${res.data.trackingId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create shipment");
    } finally {
      setLoading(false);
    }
  };

  const sel = { ...inputStyle, cursor: "pointer" };

  return (
    <div style={{ maxWidth: 800 }}>
      <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#1E293B" }}>Create New Shipment</h2>
      {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <Section title="Item Details">
          <FormField label="Equipment / Item Name" required>
            <input value={form.equipment} onChange={set("equipment")} required placeholder="e.g. Laptop, Projector" style={inputStyle} />
          </FormField>
          <FormField label="Category" required>
            <select value={form.category} onChange={set("category")} required style={sel}>
              <option value="">Select category</option>
              {ITEM_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Item Description">
              <textarea value={form.itemDescription} onChange={set("itemDescription")} placeholder="Describe what you are sending..." rows={2} style={{ ...inputStyle, resize: "vertical" }} />
            </FormField>
          </div>
          <FormField label="Quantity" required>
            <input value={form.quantity} onChange={set("quantity")} required type="number" min="1" placeholder="Enter quantity" style={inputStyle} />
          </FormField>
          <FormField label="Weight (kg)">
            <input value={form.weight} onChange={set("weight")} type="number" min="0" step="0.1" placeholder="e.g. 2.5" style={inputStyle} />
          </FormField>
        </Section>

        <Section title="From (Origin)">
          <FormField label="State" required>
            <select value={form.fromState} onChange={set("fromState")} required style={sel}>
              <option value="">Select state</option>
              {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="District" required>
            <input value={form.fromDistrict} onChange={set("fromDistrict")} required placeholder="Enter district" style={inputStyle} />
          </FormField>
          <FormField label="Pincode">
            <input value={form.fromPincode} onChange={set("fromPincode")} placeholder="6-digit pincode" maxLength={6} style={inputStyle} />
          </FormField>
        </Section>

        <Section title="To (Destination)">
          <FormField label="State" required>
            <select value={form.toState} onChange={set("toState")} required style={sel}>
              <option value="">Select state</option>
              {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="District" required>
            <input value={form.toDistrict} onChange={set("toDistrict")} required placeholder="Enter district" style={inputStyle} />
          </FormField>
          <FormField label="Pincode">
            <input value={form.toPincode} onChange={set("toPincode")} placeholder="6-digit pincode" maxLength={6} style={inputStyle} />
          </FormField>
        </Section>

        <Section title="Sender & Recipient">
          <FormField label="Sender Name">
            <input value={form.senderName} onChange={set("senderName")} placeholder="Full name" style={inputStyle} />
          </FormField>
          <FormField label="Sender Phone">
            <input value={form.senderPhone} onChange={set("senderPhone")} placeholder="+91 XXXXX XXXXX" style={inputStyle} />
          </FormField>
          <FormField label="Recipient Name">
            <input value={form.recipientName} onChange={set("recipientName")} placeholder="Full name" style={inputStyle} />
          </FormField>
          <FormField label="Recipient Phone">
            <input value={form.recipientPhone} onChange={set("recipientPhone")} placeholder="+91 XXXXX XXXXX" style={inputStyle} />
          </FormField>
        </Section>

        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <FormField label="Estimated Delivery Date">
              <input value={form.estimatedDelivery} onChange={set("estimatedDelivery")} type="date" min={new Date().toISOString().split("T")[0]} style={inputStyle} />
            </FormField>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Notes (Optional)">
                <textarea value={form.notes} onChange={set("notes")} placeholder="Additional notes or special instructions..." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </FormField>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button type="button" onClick={() => navigate("/shipments")} style={{ padding: "10px 24px", background: "#F1F5F9", color: "#374151", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ padding: "10px 24px", background: loading ? "#93C5FD" : "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Creating..." : "Create Shipment"}
          </button>
        </div>
      </form>
    </div>
  );
}
