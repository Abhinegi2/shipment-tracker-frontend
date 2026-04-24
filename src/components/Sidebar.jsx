import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

const NAV = [
  { path: "/dashboard", icon: "⊞", label: "Dashboard" },
  { path: "/shipments", icon: "⊠", label: "All Shipments" },
  { path: "/shipments/create", icon: "+", label: "Create Shipment" },
  { path: "/users", icon: "⊙", label: "Users", adminOnly: true },
  { path: "/reports", icon: "≡", label: "Reports" },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const go = (path) => { navigate(path); onClose?.(); };

  return (
    <>
      {isOpen && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40, display: "none" }} className="sidebar-overlay" />
      )}
      <aside style={{
        width: 200, minHeight: "100vh", background: "#0F172A",
        display: "flex", flexDirection: "column",
        position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 50,
        transform: "translateX(0)", transition: "transform 0.25s ease",
      }} className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <style>{`
          @media (max-width: 768px) {
            .sidebar { transform: translateX(-100%) !important; }
            .sidebar.sidebar-open { transform: translateX(0) !important; }
            .sidebar-overlay { display: block !important; }
          }
        `}</style>

        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "#2563EB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🚚</div>
            <div>
              <div style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>Shipment</div>
              <div style={{ color: "#94A3B8", fontSize: 11 }}>Tracking</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV.filter(item => !item.adminOnly || user?.role === "admin").map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => go(item.path)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", background: isActive ? "#2563EB" : "transparent",
                color: isActive ? "#fff" : "#94A3B8", border: "none", borderRadius: 8,
                cursor: "pointer", fontSize: 13, fontWeight: isActive ? 600 : 400,
                marginBottom: 2, textAlign: "left",
              }}>
                <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: 8, borderTop: "1px solid #1E293B" }}>
          <div style={{ padding: "8px 12px", marginBottom: 4 }}>
            <div style={{ fontSize: 12, color: "#F8FAFC", fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>{user?.role}</div>
          </div>
          <button onClick={logout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "transparent", color: "#94A3B8", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>↩</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
