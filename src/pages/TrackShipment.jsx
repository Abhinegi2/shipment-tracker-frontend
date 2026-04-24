import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StatusBadge } from "../components/UI";
import api from "../api";

export default function TrackShipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(id || "");

  const track = async (trackingId) => {
    if (!trackingId) return;
    setLoading(true); setError("");
    try {
      const res = await api.get(`/shipments/public/${trackingId.trim().toUpperCase()}`);
      setShipment(res.data);
    } catch {
      setShipment(null);
      setError("No shipment found with this tracking ID.");
    } finally { setLoading(false); }
  };

  useEffect(() => { if (id) track(id); else setLoading(false); }, [id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/track/${query.trim().toUpperCase()}`);
  };

  const steps = ["Created", "Dispatched", "In Transit", "Reached", "Out for Delivery", "Delivered"];
  const currentStep = shipment ? steps.indexOf(shipment.status) : -1;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)" }}>
      <div style={{ background: "#0F172A", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/login")}>
          <div style={{ width: 32, height: 32, background: "#2563EB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🚚</div>
          <span style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 700 }}>Shipment Tracker</span>
        </div>
        <button onClick={() => navigate("/login")} style={{ padding: "7px 16px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sign In</button>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1E293B", margin: "0 0 10px" }}>Track Your Shipment</h1>
          <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>Enter your tracking ID to get real-time status updates</p>
        </div>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 40 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter tracking ID (e.g. TRK10001)"
            style={{ flex: 1, padding: "13px 18px", border: "2px solid #E2E8F0", borderRadius: 10, fontSize: 14, outline: "none", color: "#1E293B", background: "#fff" }}
          />
          <button type="submit" style={{ padding: "13px 28px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Track
          </button>
        </form>

        {loading && id && (
          <div style={{ textAlign: "center", padding: 48, color: "#64748B" }}>
            <div style={{ width: 36, height: 36, border: "3px solid #E2E8F0", borderTop: "3px solid #2563EB", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Looking up shipment...
          </div>
        )}

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
            <p style={{ color: "#DC2626", fontWeight: 600, margin: "0 0 6px" }}>{error}</p>
            <p style={{ color: "#94A3B8", fontSize: 13, margin: 0 }}>Check your tracking ID and try again.</p>
          </div>
        )}

        {shipment && (
          <div>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 28, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>TRACKING ID</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#1E293B", fontFamily: "monospace" }}>{shipment.trackingId}</div>
                </div>
                <StatusBadge status={shipment.status} />
              </div>

              <div className="grid-auto" style={{ marginBottom: 24 }}>
                {[
                  ["Item", shipment.equipment],
                  ["Category", shipment.category || "—"],
                  ["Quantity", shipment.quantity],
                  ["Weight", shipment.weight ? `${shipment.weight} kg` : "—"],
                  ["From", shipment.fromLocation],
                  ["To", shipment.toLocation],
                  ["Est. Delivery", shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"],
                  ["Dispatched On", shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: "#F8FAFC", borderRadius: 10, padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 14, color: "#1E293B", fontWeight: 600 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 16 }}>SHIPMENT PROGRESS</div>
                <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
                  {steps.map((step, i) => (
                    <div key={step} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 80 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: i <= currentStep ? "#2563EB" : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: i <= currentStep ? "#fff" : "#94A3B8", fontWeight: 700, marginBottom: 6, border: i === currentStep ? "3px solid #93C5FD" : "none" }}>
                          {i < currentStep ? "✓" : i + 1}
                        </div>
                        <div style={{ fontSize: 10, color: i <= currentStep ? "#2563EB" : "#94A3B8", fontWeight: i === currentStep ? 700 : 500, textAlign: "center", lineHeight: 1.3 }}>{step}</div>
                      </div>
                      {i < steps.length - 1 && (
                        <div style={{ flex: 1, height: 2, background: i < currentStep ? "#2563EB" : "#E2E8F0", margin: "0 4px", marginBottom: 20 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {shipment.timeline?.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 20 }}>TIMELINE</div>
                {[...shipment.timeline].reverse().map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < shipment.timeline.length - 1 ? 20 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563EB", marginTop: 4, flexShrink: 0 }} />
                      {i < shipment.timeline.length - 1 && <div style={{ width: 2, flex: 1, background: "#E2E8F0", margin: "4px 0" }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: i < shipment.timeline.length - 1 ? 4 : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                        <StatusBadge status={t.status} />
                        <span style={{ fontSize: 12, color: "#64748B" }}>{t.location}</span>
                      </div>
                      {t.notes && <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94A3B8" }}>{t.notes}</p>}
                      <p style={{ margin: "4px 0 0", fontSize: 11, color: "#CBD5E1" }}>{new Date(t.createdAt).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
