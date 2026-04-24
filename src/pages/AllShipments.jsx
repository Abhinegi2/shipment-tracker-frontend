import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { shipmentsAPI } from "../api";
import { StatusBadge, Spinner, STATUSES } from "../components/UI";

export default function AllShipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await shipmentsAPI.getAll({ search, status, limit: 50 });
      setShipments(res.data.shipments);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchShipments(); }, [search, status]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1E293B" }}>All Shipments <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 400 }}>({total})</span></h2>
        <button onClick={() => navigate("/shipments/create")} style={{ background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Create Shipment</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 12, padding: "16px 20px", borderBottom: "1px solid #F1F5F9", flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Tracking ID or Equipment..." style={{ flex: 1, minWidth: 200, padding: "8px 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, outline: "none", color: "#1E293B" }} />
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: "8px 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, color: "#374151", background: "#fff", outline: "none" }}>
            <option value="All">All Status</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        {loading ? <Spinner /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Tracking ID", "Equipment", "Qty", "From", "To", "Status", "Updated", "Action"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shipments.map(s => (
                  <tr key={s._id} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#2563EB", fontWeight: 600 }}>{s.trackingId}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#1E293B" }}>{s.equipment}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748B" }}>{s.quantity}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748B" }}>{s.fromLocation}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748B" }}>{s.toLocation}</td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status={s.status} /></td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#94A3B8", whiteSpace: "nowrap" }}>{new Date(s.updatedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => navigate(`/shipments/${s.trackingId}`)} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "1px solid #BFDBFE", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontWeight: 600 }}>View</button>
                    </td>
                  </tr>
                ))}
                {shipments.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>No shipments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
