import { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { useToast } from "../components/Toast";
import { inputStyle, FormField } from "../components/UI";

const ColorPicker = ({ label, value, onChange }) => (
  <FormField label={label}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <input type="color" value={value || "#000000"} onChange={e => onChange(e.target.value)}
        style={{ width: 44, height: 38, border: "1.5px solid #E2E8F0", borderRadius: 8, cursor: "pointer", padding: 2, background: "#fff" }} />
      <input value={value || ""} onChange={e => onChange(e.target.value)} placeholder="#2563EB"
        style={{ ...inputStyle, fontFamily: "monospace", maxWidth: 140 }} />
    </div>
  </FormField>
);

const Tab = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "10px 20px", background: "none", border: "none", borderBottom: `2px solid ${active ? "var(--color-primary,#2563EB)" : "transparent"}`,
    color: active ? "var(--color-primary,#2563EB)" : "#64748B", fontWeight: active ? 700 : 500, fontSize: 14, cursor: "pointer", transition: "all 0.15s",
  }}>{label}</button>
);

const EMOJIS = ["🚚", "📦", "🏭", "🚛", "✈️", "🚢", "🏪", "⚙️", "🎯", "🔷"];

export default function AppSettings() {
  const { settings, updateSettings } = useSettings();
  const toast = useToast();
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("branding");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => { setForm({ ...settings }); }, [settings]);

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: typeof v === "string" ? v : v.target?.value ?? v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(form);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally { setSaving(false); }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    const tags = form.loginTags || [];
    if (!tags.includes(tag)) setForm(f => ({ ...f, loginTags: [...tags, tag] }));
    setTagInput("");
  };

  const removeTag = (t) => setForm(f => ({ ...f, loginTags: (f.loginTags || []).filter(x => x !== t) }));

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1E293B" }}>App Settings</h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>Customize branding, theme colors, and login page</p>
      </div>

      <div style={{ borderBottom: "1px solid #E2E8F0", marginBottom: 24, display: "flex" }}>
        <Tab label="Branding & Theme" active={tab === "branding"} onClick={() => setTab("branding")} />
        <Tab label="Login Page" active={tab === "login"} onClick={() => setTab("login")} />
      </div>

      <form onSubmit={handleSave}>
        {tab === "branding" && (
          <>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>App Identity</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <FormField label="App Name" required>
                  <input value={form.appName || ""} onChange={set("appName")} required placeholder="Shipment Tracker" style={inputStyle} />
                </FormField>
                <FormField label="Sidebar Subtitle">
                  <input value={form.appSubtitle || ""} onChange={set("appSubtitle")} placeholder="Tracking" style={inputStyle} />
                </FormField>
              </div>
              <div style={{ marginBottom: 8 }}>
                <FormField label="Logo Image URL (PNG, SVG, or any image link)">
                  <input value={form.logoUrl || ""} onChange={set("logoUrl")} placeholder="https://example.com/logo.svg" style={inputStyle} />
                </FormField>
              </div>
              {form.logoUrl ? (
                <div style={{ margin: "8px 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 44, height: 44, background: form.sidebarColor || "#0F172A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <img src={form.logoUrl} alt="preview" style={{ width: 30, height: 30, objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
                  </div>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Preview on sidebar background · <button type="button" onClick={() => setForm(f => ({ ...f, logoUrl: "" }))} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 12, padding: 0 }}>Clear</button></span>
                </div>
              ) : (
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Logo Emoji</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {EMOJIS.map(em => (
                      <button key={em} type="button" onClick={() => setForm(f => ({ ...f, logoEmoji: em }))}
                        style={{ width: 44, height: 44, fontSize: 22, border: "2px solid", borderColor: form.logoEmoji === em ? "var(--color-primary,#2563EB)" : "#E2E8F0", borderRadius: 10, background: form.logoEmoji === em ? "#EFF6FF" : "#fff", cursor: "pointer" }}>
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Theme Colors</h3>
              <div className="grid-auto">
                <ColorPicker label="Primary Color (buttons, active nav)" value={form.primaryColor} onChange={set("primaryColor")} />
                <ColorPicker label="Sidebar Background" value={form.sidebarColor} onChange={set("sidebarColor")} />
                <ColorPicker label="Accent / Gradient Color" value={form.accentColor} onChange={set("accentColor")} />
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
          </>
        )}

        {tab === "login" && (
          <>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Login Page Left Panel</h3>
              <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 16px" }}>The logo and colors are shared with branding settings above.</p>
              <div style={{ marginBottom: 16 }}>
                <FormField label="Headline (use new line for line break)">
                  <textarea value={form.loginHeadline || ""} onChange={set("loginHeadline")} rows={2}
                    placeholder={"Track Every Shipment\nReal-Time, Always"} style={{ ...inputStyle, resize: "vertical" }} />
                </FormField>
              </div>
              <div style={{ marginBottom: 20 }}>
                <FormField label="Subtitle">
                  <textarea value={form.loginSubtitle || ""} onChange={set("loginSubtitle")} rows={3}
                    placeholder="Monitor equipment shipments..." style={{ ...inputStyle, resize: "vertical" }} />
                </FormField>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Feature Tags</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  {(form.loginTags || []).map(t => (
                    <span key={t} style={{ background: "#EFF6FF", color: "#2563EB", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6 }}>
                      {t}
                      <button type="button" onClick={() => removeTag(t)} style={{ background: "none", border: "none", color: "#2563EB", cursor: "pointer", padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Add a tag and press Enter" style={{ ...inputStyle, flex: 1 }} />
                  <button type="button" onClick={addTag} style={{ padding: "0 16px", background: "#F1F5F9", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" }}>Add</button>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Live Preview</h3>
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden", maxWidth: 280 }}>
                <div style={{ background: `linear-gradient(135deg, ${form.accentColor || "#1E3A5F"}, ${form.primaryColor || "#2563EB"})`, padding: "24px 20px", color: "#fff" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>
                    {form.logoUrl ? <img src={form.logoUrl} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} /> : (form.logoEmoji || "🚚")}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>
                    {(form.loginHeadline || "Track Every Shipment").split("\n").map((l, i) => <div key={i}>{l}</div>)}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 12, lineHeight: 1.5 }}>{(form.loginSubtitle || "").slice(0, 80)}{form.loginSubtitle?.length > 80 ? "..." : ""}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(form.loginTags || []).map(t => (
                      <span key={t} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "3px 8px", fontSize: 9, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" disabled={saving} style={{ padding: "10px 28px", background: saving ? "#93C5FD" : "var(--color-primary,#2563EB)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
