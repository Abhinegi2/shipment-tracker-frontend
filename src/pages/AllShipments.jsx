import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { shipmentsAPI } from "../api";
import { StatusBadge, Spinner, STATUSES } from "../components/UI";

const PAGE_SIZE = 20;

function exportCSV(shipments) {
  const headers = ["Tracking ID", "Equipment", "Category", "Quantity", "Weight (kg)", "From", "To", "Status", "Sender", "Recipient", "Est. Delivery", "Created On"];
  const rows = shipments.map(s => [
    s.trackingId, s.equipment, s.category || "", s.quantity, s.weight || "",
    s.fromLocation, s.toLocation, s.status,
    s.senderName || "", s.recipientName || "",
    s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString("en-IN") : "",
    new Date(s.createdAt).toLocaleDateString("en-IN"),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `shipments-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function AllShipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const fetchShipments = async (s, st, p) => {
    setLoading(true);
    try {
      const res = await shipmentsAPI.getAll({ search: s, status: st, page: p, limit: PAGE_SIZE });
      setShipments(res.data.shipments);
      setTotal(res.data.total);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchShipments(search, status, page), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, status, page]);

  const onSearch = (val) => { setSearch(val); setPage(1); };
  const onStatus = (val) => { setStatus(val); setPage(1); };

  const btnStyle = (active) => ({
    padding: "5px 10px", border: "1px solid #E2E8F0", borderRadius: 6, background: active ? "#2563EB" : "#fff",
    color: active ? "#fff" : "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer",
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1E293B" }}>
          All Shipments <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 400 }}>({total})</span>
        </h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => exportCSV(shipments)} style={{ background: "#F1F5F9", color: "#374151", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            ↓ Export CSV
          </button>
          <button onClick={() => navigate("/shipments/create")} style={{ background: "var(--color-primary,#2563EB)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            + Create Shipment
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 12, padding: "16px 20px", borderBottom: "1px solid #F1F5F9", flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search} onChange={e => onSearch(e.target.value)}
            placeholder="Search by Tracking ID, Equipment, Location..."
            style={{ flex: 1, minWidth: 200, padding: "8px 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, outline: "none", color: "#1E293B" }}
          />
          <select value={status} onChange={e => onStatus(e.target.value)} style={{ padding: "8px 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, color: "#374151", background: "#fff", outline: "none", cursor: "pointer" }}>
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
                  <tr key={s._id} style={{ borderTop: "1px solid #F1F5F9" }} onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#2563EB", fontWeight: 600, cursor: "pointer" }} onClick={() => navigate(`/shipments/${s.trackingId}`)}>{s.trackingId}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: 13, color: "#1E293B", fontWeight: 500 }}>{s.equipment}</div>
                      {s.category && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{s.category}</div>}
                    </td>
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
                  <tr>
                    <td colSpan={8} style={{ padding: 48, textAlign: "center" }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>📦</div>
                      <div style={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>No shipments found</div>
                      <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Try adjusting your search or filters</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 13, color: "#64748B" }}>Page {page} of {pages} · {total} total</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={btnStyle(false)}>← Prev</button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const p = Math.max(1, Math.min(pages - 4, page - 2)) + i;
                return <button key={p} onClick={() => setPage(p)} style={btnStyle(p === page)}>{p}</button>;
              })}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={btnStyle(false)}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
