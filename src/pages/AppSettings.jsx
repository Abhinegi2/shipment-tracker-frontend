import { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { inputStyle, FormField } from "../components/UI";

const ColorPicker = ({ label, value, onChange }) => (
  <FormField label={label}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: 44, height: 38, border: "1.5px solid #E2E8F0", borderRadius: 8, cursor: "pointer", padding: 2, background: "#fff" }} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="#2563EB"
        style={{ ...inputStyle, fontFamily: "monospace", maxWidth: 140 }} />
    </div>
  </FormField>
);

export default function AppSettings() {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setForm({ ...settings }); }, [settings]);

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: typeof v === "string" ? v : v.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess(false);
    try {
      await updateSettings(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const EMOJIS = ["🚚", "📦", "🏭", "🚛", "✈️", "🚢", "🏪", "⚙️", "🎯", "🔷"];

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1E293B" }}>App Settings</h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>Customize the app name, logo, and theme colors</p>
      </div>

      {success && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#15803D", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>Settings saved successfully!</div>}
      {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSave}>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Branding</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <FormField label="App Name" required>
              <input value={form.appName || ""} onChange={set("appName")} required placeholder="Shipment Tracker" style={inputStyle} />
            </FormField>
            <FormField label="Sidebar Subtitle">
              <input value={form.appSubtitle || ""} onChange={set("appSubtitle")} placeholder="Tracking" style={inputStyle} />
            </FormField>
          </div>

          <FormField label="Logo Image URL (PNG, SVG, or any image link)">
            <input value={form.logoUrl || ""} onChange={set("logoUrl")} placeholder="https://example.com/logo.svg" style={inputStyle} />
          </FormField>
          {form.logoUrl ? (
            <div style={{ margin: "8px 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, background: form.sidebarColor || "#0F172A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img src={form.logoUrl} alt="logo preview" style={{ width: 28, height: 28, objectFit: "contain" }}
                  onError={e => { e.target.style.display = "none"; }} />
              </div>
              <span style={{ fontSize: 12, color: "#64748B" }}>Preview on sidebar background</span>
            </div>
          ) : (
            <p style={{ fontSize: 11, color: "#94A3B8", margin: "6px 0 16px" }}>Leave empty to use emoji logo below</p>
          )}

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Logo Emoji</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {EMOJIS.map(em => (
                <button key={em} type="button" onClick={() => setForm(f => ({ ...f, logoEmoji: em }))}
                  style={{ width: 44, height: 44, fontSize: 22, border: "2px solid", borderColor: form.logoEmoji === em ? "var(--color-primary, #2563EB)" : "#E2E8F0", borderRadius: 10, background: form.logoEmoji === em ? "#EFF6FF" : "#fff", cursor: "pointer" }}>
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Theme Colors</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            <ColorPicker label="Primary Color (buttons, active nav)" value={form.primaryColor || "#2563EB"} onChange={set("primaryColor")} />
            <ColorPicker label="Sidebar Background" value={form.sidebarColor || "#0F172A"} onChange={set("sidebarColor")} />
            <ColorPicker label="Accent / Gradient Color" value={form.accentColor || "#1E3A5F"} onChange={set("accentColor")} />
          </div>
          <div style={{ marginTop: 20, padding: 16, borderRadius: 10, border: "1px solid #E2E8F0", background: "#F9FAFB" }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: "#374151" }}>Preview</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ background: form.primaryColor, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Primary Button</div>
              <div style={{ background: form.sidebarColor, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Sidebar BG</div>
              <div style={{ background: `linear-gradient(135deg, ${form.accentColor}, ${form.primaryColor})`, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Gradient</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" disabled={saving} style={{ padding: "10px 28px", background: saving ? "#93C5FD" : "var(--color-primary, #2563EB)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
