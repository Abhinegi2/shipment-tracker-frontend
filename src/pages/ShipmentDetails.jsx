import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shipmentsAPI } from "../api";
import { useToast } from "../components/Toast";
import { StatusBadge, Spinner, INDIAN_STATES, STATUSES, inputStyle } from "../components/UI";

const DOT_COLORS = { "In Transit": "#3B82F6", "Dispatched": "#F97316", "Reached": "#0EA5E9", "Created": "#9CA3AF", "Delivered": "#22C55E", "Out for Delivery": "#F59E0B" };

export default function ShipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [upd, setUpd] = useState({ location: "", status: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const fetchShipment = useCallback(async () => {
    try {
      const res = await shipmentsAPI.getOne(id);
      setShipment(res.data);
    } catch { navigate("/shipments"); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchShipment(); }, [fetchShipment]);

  // Escape key to close modal
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setShowModal(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleUpdate = async () => {
    if (!upd.location || !upd.status) return toast.warning("Please fill in location and status");
    setSaving(true);
    try {
      const res = await shipmentsAPI.updateStatus(id, upd);
      setShipment(res.data);
      setShowModal(false);
      setUpd({ location: "", status: "", notes: "" });
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  if (loading) return <Spinner />;
  if (!shipment) return null;

  const infoItems = [
    ["Equipment", shipment.equipment],
    ["Category", shipment.category || "—"],
    ["Quantity", shipment.quantity],
    ["Weight", shipment.weight ? `${shipment.weight} kg` : "—"],
    ["From", shipment.fromLocation],
    ["To", shipment.toLocation],
    ["Sender", shipment.senderName ? `${shipment.senderName}${shipment.senderPhone ? ` · ${shipment.senderPhone}` : ""}` : "—"],
    ["Recipient", shipment.recipientName ? `${shipment.recipientName}${shipment.recipientPhone ? ` · ${shipment.recipientPhone}` : ""}` : "—"],
    ["Est. Delivery", shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"],
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/shipments")} style={{ background: "none", border: "none", cursor: "pointer", color: "#2563EB", fontSize: 13, padding: 0, fontWeight: 600 }}>All Shipments</button>
        <span>/</span>
        <span style={{ color: "#1E293B", fontWeight: 600 }}>{shipment.trackingId}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button
            onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/track/${shipment.trackingId}`); toast.success("Tracking link copied!"); }}
            style={{ background: "#F1F5F9", color: "#374151", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            🔗 Share
          </button>
          <button onClick={() => setShowModal(true)} style={{ background: "var(--color-primary,#2563EB)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Update Status</button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, background: "#EFF6FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, marginBottom: 2 }}>TRACKING ID</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1E293B" }}>{shipment.trackingId}</div>
          </div>
          <StatusBadge status={shipment.status} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, padding: "16px 0", borderTop: "1px solid #F1F5F9" }}>
          {infoItems.map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{val}</div>
            </div>
          ))}
        </div>
        {shipment.itemDescription && (
          <div style={{ padding: "12px 0 0", borderTop: "1px solid #F1F5F9", marginTop: 4 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>DESCRIPTION</div>
            <div style={{ fontSize: 13, color: "#374151" }}>{shipment.itemDescription}</div>
          </div>
        )}
        <div style={{ padding: "12px 0 0", borderTop: "1px solid #F1F5F9", marginTop: 4 }}>
          <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>CREATED BY</div>
          <div style={{ fontSize: 13, color: "#374151" }}>{shipment.createdByName} · {new Date(shipment.createdAt).toLocaleString("en-IN")}</div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1E293B", marginBottom: 24 }}>Tracking Timeline</div>
        {shipment.timeline.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: DOT_COLORS[t.status] || "#9CA3AF", border: "3px solid #fff", boxShadow: `0 0 0 2px ${DOT_COLORS[t.status] || "#9CA3AF"}`, flexShrink: 0, marginTop: 2, zIndex: 1 }} />
              {i < shipment.timeline.length - 1 && <div style={{ width: 2, flex: 1, background: "#E2E8F0", minHeight: 28, marginTop: 4 }} />}
            </div>
            <div style={{ paddingBottom: 24, flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: DOT_COLORS[t.status] || "#374151" }}>{t.status}</span>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>·</span>
                <span style={{ fontSize: 12, color: "#64748B" }}>{t.location}</span>
                <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: "auto" }}>{new Date(t.createdAt).toLocaleString("en-IN")}</span>
              </div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{t.notes}</div>
              {t.updatedByName && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>Updated by: {t.updatedByName}</div>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#1E293B" }}>Update Shipment Status</span>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, color: "#94A3B8", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Status <span style={{ color: "#EF4444" }}>*</span></label>
              <select value={upd.status} onChange={e => setUpd(u => ({ ...u, status: e.target.value }))} style={{ ...inputStyle, display: "block", cursor: "pointer" }}>
                <option value="">Select status</option>
                {STATUSES.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Current Location <span style={{ color: "#EF4444" }}>*</span></label>
              <input value={upd.location} onChange={e => setUpd(u => ({ ...u, location: e.target.value }))} placeholder="Enter current location" style={{ ...inputStyle, display: "block" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Notes (Optional)</label>
              <textarea value={upd.notes} onChange={e => setUpd(u => ({ ...u, notes: e.target.value }))} rows={2} placeholder="Enter notes..." style={{ ...inputStyle, display: "block", resize: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "9px 20px", background: "#F1F5F9", color: "#374151", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleUpdate} disabled={saving} style={{ padding: "9px 20px", background: saving ? "#93C5FD" : "var(--color-primary,#2563EB)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>{saving ? "Saving..." : "Submit Update"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
