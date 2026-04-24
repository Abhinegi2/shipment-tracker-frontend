import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useToast } from "../components/Toast";
import { inputStyle, FormField } from "../components/UI";
import { usersAPI } from "../api";

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || "", avatar: user?.avatar || "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.warning("Name cannot be empty");
    setSaving(true);
    try {
      const res = await usersAPI.updateProfile({ name: form.name.trim(), avatar: form.avatar });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally { setSaving(false); }
  };

  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1E293B" }}>My Profile</h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>Update your name and profile picture</p>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ position: "relative" }}>
            {form.avatar
              ? <img src={form.avatar} alt="avatar" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid #E2E8F0" }} onError={e => { e.target.style.display = "none"; }} />
              : <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--color-primary,#2563EB)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", border: "3px solid #E2E8F0" }}>{initials}</div>
            }
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{user?.email}</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4, textTransform: "capitalize", background: "#F1F5F9", display: "inline-block", padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>{user?.role === "location_user" ? "Location User" : user?.role}</div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 18 }}>
            <FormField label="Full Name" required>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                placeholder="Enter your full name"
                style={inputStyle}
              />
            </FormField>
          </div>

          <div style={{ marginBottom: 18 }}>
            <FormField label="Email Address">
              <input
                value={user?.email || ""}
                disabled
                style={{ ...inputStyle, background: "#F8FAFC", color: "#94A3B8", cursor: "not-allowed" }}
              />
            </FormField>
            <p style={{ fontSize: 11, color: "#94A3B8", margin: "5px 0 0" }}>Email cannot be changed. Contact your admin if needed.</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <FormField label="Profile Photo URL">
              <input
                value={form.avatar}
                onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
                placeholder="https://example.com/photo.jpg"
                style={inputStyle}
              />
            </FormField>
            {form.avatar && (
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <img src={form.avatar} alt="preview" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid #E2E8F0" }} onError={e => { e.target.style.display = "none"; }} />
                <span style={{ fontSize: 12, color: "#64748B" }}>Preview</span>
              </div>
            )}
          </div>

          <button type="submit" disabled={saving} style={{ width: "100%", padding: "11px 0", background: saving ? "#93C5FD" : "var(--color-primary,#2563EB)", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
