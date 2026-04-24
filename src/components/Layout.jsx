import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
          .main-content .page-pad { padding-top: 60px !important; }
        }
      `}</style>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content" style={{ marginLeft: 200, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            display: "none",
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 35,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 8,
            cursor: "pointer",
            color: "#374151",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="page-pad" style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
