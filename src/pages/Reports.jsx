import { useState, useEffect } from "react";
import { shipmentsAPI } from "../api";
import { STATUS_COLORS, Spinner } from "../components/UI";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shipmentsAPI.stats().then(res => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const total = stats?.total || 0;
  const byStatus = stats?.byStatus || [];

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#1E293B" }}>Reports</h2>
      <div className="grid-2">
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1E293B", marginBottom: 20 }}>Shipments by Status</div>
          {byStatus.map(({ _id: status, count }) => {
            const s = STATUS_COLORS[status] || STATUS_COLORS["Created"];
            return (
              <div key={status} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#374151" }}>{status}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1E293B" }}>{count}</span>
                </div>
                <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: total ? `${(count / total) * 100}%` : "0%", background: s.dot, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1E293B", marginBottom: 20 }}>Summary</div>
          {[
            ["Total Shipments", total, "#2563EB"],
            ["Delivered", byStatus.find(s => s._id === "Delivered")?.count || 0, "#22C55E"],
            ["In Transit", byStatus.find(s => s._id === "In Transit")?.count || 0, "#F59E0B"],
            ["Created / Pending", byStatus.find(s => s._id === "Created")?.count || 0, "#9CA3AF"],
          ].map(([label, val, color]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ fontSize: 13, color: "#64748B" }}>{label}</span>
              <span style={{ fontSize: 20, fontWeight: 800, color }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
