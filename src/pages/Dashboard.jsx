import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { shipmentsAPI } from "../api";
import { StatusBadge, Spinner } from "../components/UI";

const StatCard = ({ label, value, color, icon }) => (
  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 140 }}>
    <div style={{ width: 44, height: 44, borderRadius: 10, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#1E293B", lineHeight: 1.1 }}>{value ?? "—"}</div>
      <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([shipmentsAPI.stats(), shipmentsAPI.getAll({ limit: 6 })])
      .then(([statsRes, shipmentsRes]) => {
        setStats(statsRes.data);
        setShipments(shipmentsRes.data.shipments);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getCount = (status) => stats?.byStatus?.find(s => s._id === status)?.count || 0;

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total Shipments" value={stats?.total} color="#2563EB" icon="📦" />
        <StatCard label="In Transit" value={getCount("In Transit")} color="#F59E0B" icon="🚛" />
        <StatCard label="Delivered" value={getCount("Delivered")} color="#22C55E" icon="✅" />
        <StatCard label="Pending" value={getCount("Created")} color="#EF4444" icon="⏳" />
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Recent Shipments</span>
          <button onClick={() => navigate("/shipments")} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View All →</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Tracking ID", "Equipment", "From", "To", "Status", "Updated"].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shipments.map(s => (
                <tr key={s._id} style={{ borderTop: "1px solid #F1F5F9", cursor: "pointer" }} onClick={() => navigate(`/shipments/${s.trackingId}`)}>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#2563EB", fontWeight: 600 }}>{s.trackingId}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#1E293B" }}>{s.equipment}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#64748B" }}>{s.fromLocation}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#64748B" }}>{s.toLocation}</td>
                  <td style={{ padding: "12px 20px" }}><StatusBadge status={s.status} /></td>
                  <td style={{ padding: "12px 20px", fontSize: 12, color: "#94A3B8", whiteSpace: "nowrap" }}>{new Date(s.updatedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
