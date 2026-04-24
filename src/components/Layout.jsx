import { useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../AuthContext";
import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/shipments": "All Shipments",
  "/shipments/create": "Create Shipment",
  "/users": "Users",
  "/reports": "Reports",
  "/roles": "Roles & Permissions",
  "/app-settings": "App Settings",
};

export default function Layout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = Object.entries(PAGE_TITLES).find(([path]) => location.pathname === path)?.[1]
    || (location.pathname.startsWith("/shipments/") ? "Shipment Details" : "Shipment Tracker");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content" style={{ marginLeft: 200, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ height: 56, background: "#fff", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", padding: "0 24px", position: "sticky", top: 0, zIndex: 30, gap: 12 }}>
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(o => !o)}
            style={{ display: "none", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, color: "#374151" }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", flex: 1 }}>{title}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {user?.avatar
              ? <img src={user.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
              : <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#1D4ED8" }}>
                  {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
            }
            <span style={{ fontSize: 12, color: "#64748B" }}>{user?.name}</span>
          </div>
        </div>
        <div style={{ flex: 1, padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}
