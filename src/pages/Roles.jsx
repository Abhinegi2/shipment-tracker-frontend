import { useState, useEffect } from "react";
import { rolesAPI } from "../api";
import { inputStyle, FormField } from "../components/UI";

const ALL_PERMISSIONS = [
  { key: "dashboard", label: "Dashboard", icon: "⊞" },
  { key: "shipments", label: "All Shipments", icon: "⊠" },
  { key: "create_shipment", label: "Create Shipment", icon: "+" },
  { key: "users", label: "Users Management", icon: "⊙" },
  { key: "reports", label: "Reports", icon: "≡" },
  { key: "roles", label: "Roles & Permissions", icon: "🔑" },
  { key: "settings", label: "App Settings", icon: "⚙" },
];

const emptyForm = { name: "", description: "", permissions: ["dashboard"] };

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => rolesAPI.getAll().then(r => setRoles(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditing(null); setError(""); setShowModal(true); };
  const openEdit = (role) => { setForm({ name: role.name, description: role.description, permissions: [...role.permissions] }); setEditing(role); setError(""); setShowModal(true); };

  const togglePerm = (key) => setForm(f => ({
    ...f,
    permissions: f.permissions.includes(key) ? f.permissions.filter(p => p !== key) : [...f.permissions, key],
  }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (editing) await rolesAPI.update(editing._id, form);
      else await rolesAPI.create(form);
      await load();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`Delete role "${role.name}"?`)) return;
    try {
      await rolesAPI.delete(role._id);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete role");
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1E293B" }}>Roles & Permissions</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>Define roles and control which screens each role can access</p>
        </div>
        <button onClick={openCreate} style={{ padding: "9px 20px", background: "var(--color-primary, #2563EB)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          + New Role
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: "#94A3B8" }}>Loading...</div>
      ) : roles.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 48, textAlign: "center", color: "#94A3B8" }}>
          No roles created yet. Click "New Role" to get started.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {roles.map(role => (
            <div key={role._id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#1E293B" }}>{role.name}</span>
                    {role.isSystem && <span style={{ fontSize: 10, background: "#EFF6FF", color: "#2563EB", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>SYSTEM</span>}
                  </div>
                  {role.description && <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748B" }}>{role.description}</p>}
                </div>
                {!role.isSystem && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(role)} style={{ padding: "5px 14px", background: "#F1F5F9", color: "#374151", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(role)} style={{ padding: "5px 14px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {ALL_PERMISSIONS.map(p => {
                  const has = role.permissions.includes(p.key);
                  return (
                    <span key={p.key} style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: has ? "#DCFCE7" : "#F1F5F9", color: has ? "#15803D" : "#94A3B8", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {has ? "✓" : "✗"} {p.label}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 700, color: "#1E293B" }}>{editing ? "Edit Role" : "Create New Role"}</h3>
            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "8px 12px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 16 }}>
                <FormField label="Role Name" required>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Warehouse Staff" style={inputStyle} />
                </FormField>
              </div>
              <div style={{ marginBottom: 20 }}>
                <FormField label="Description">
                  <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of this role" style={inputStyle} />
                </FormField>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 10 }}>Screen Permissions</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ALL_PERMISSIONS.map(p => (
                    <label key={p.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1.5px solid", borderColor: form.permissions.includes(p.key) ? "var(--color-primary, #2563EB)" : "#E2E8F0", borderRadius: 8, cursor: "pointer", background: form.permissions.includes(p.key) ? "#EFF6FF" : "#fff" }}>
                      <input type="checkbox" checked={form.permissions.includes(p.key)} onChange={() => togglePerm(p.key)} style={{ accentColor: "var(--color-primary, #2563EB)", width: 15, height: 15 }} />
                      <span style={{ fontSize: 16 }}>{p.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#1E293B" }}>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "9px 20px", background: "#F1F5F9", color: "#374151", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: "9px 20px", background: saving ? "#93C5FD" : "var(--color-primary, #2563EB)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Saving..." : editing ? "Save Changes" : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
