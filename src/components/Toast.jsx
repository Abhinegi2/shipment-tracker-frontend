import { useState, useCallback, useRef, createContext, useContext } from "react";

const ToastContext = createContext(null);

const ICONS = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
const COLORS = {
  success: { bg: "#F0FDF4", border: "#BBF7D0", color: "#15803D", icon: "#22C55E" },
  error:   { bg: "#FEF2F2", border: "#FECACA", color: "#DC2626", icon: "#EF4444" },
  info:    { bg: "#EFF6FF", border: "#BFDBFE", color: "#1D4ED8", icon: "#3B82F6" },
  warning: { bg: "#FFFBEB", border: "#FDE68A", color: "#92400E", icon: "#F59E0B" },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timerRef = useRef({});

  const dismiss = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
    clearTimeout(timerRef.current[id]);
  }, []);

  const toast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    timerRef.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  toast.success = (msg, d) => toast(msg, "success", d);
  toast.error   = (msg, d) => toast(msg, "error", d);
  toast.info    = (msg, d) => toast(msg, "info", d);
  toast.warning = (msg, d) => toast(msg, "warning", d);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, maxWidth: 360 }}>
        {toasts.map(t => {
          const c = COLORS[t.type] || COLORS.info;
          return (
            <div key={t.id} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", animation: "slideIn 0.2s ease" }}>
              <style>{`@keyframes slideIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: c.icon, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{ICONS[t.type]}</span>
              <span style={{ fontSize: 13, color: c.color, fontWeight: 500, flex: 1, lineHeight: 1.4 }}>{t.message}</span>
              <button onClick={() => dismiss(t.id)} style={{ background: "none", border: "none", color: c.color, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0, opacity: 0.6 }}>×</button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
