import { useState, useEffect } from "react";
import { usersAPI } from "../api";
import { Spinner, inputStyle, LOCATIONS } from "../components/UI";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "location_user", location: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    usersAPI.getAll().then(res => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const res = await usersAPI.create(form);
      setUsers(u => [res.data, ...u]);
      setShowModal(false);
      setForm({ name: "", email: "", password: "", role: "location_user", location: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally { setSaving(false); }
  };

  const toggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await usersAPI.update(user._id, { status: newStatus });
      setUsers(u => u.map(x => x._id === user._id ? { ...x, status: newStatus } : x));
    } catch { alert("Failed to update status"); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1E293B" }}>Users</h2>
        <button onClick={() => setShowModal(true)} style={{ background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600 }}>+ Add User</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        {loading ? <Spinner /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Name", "Email", "Role", "Location", "Status", "Action"].map(h => (
                    <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#1D4ED8" }}>{u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#64748B" }}>{u.email}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151" }}>{u.role === "admin" ? "Admin" : "Location User"}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#64748B" }}>{u.location || "—"}</td>
                    <td style={{ padding: "12px 20px" }}>
                      <span style={{ background: u.status === "active" ? "#F0FDF4" : "#FEF2F2", color: u.status === "active" ? "#15803D" : "#DC2626", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{u.status === "active" ? "Active" : "Inactive"}</span>
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <button onClick={() => toggleStatus(u)} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "1px solid #BFDBFE", borderRadius: 6, padding: "4px 12px", fontWeight: 600 }}>{u.status === "active" ? "Deactivate" : "Activate"}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#1E293B" }}>Add New User</span>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, color: "#94A3B8", cursor: "pointer" }}>×</button>
            </div>
            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "8px 12px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>}
            <form onSubmit={handleCreate}>
              {[["Name", "name", "text"], ["Email", "email", "email"], ["Password", "password", "password"]].map(([label, key, type]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{label} *</label>
                  <input required type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ ...inputStyle, display: "block" }} />
                </div>
              ))}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ ...inputStyle, display: "block" }}>
                  <option value="location_user">Location User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Location</label>
                <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={{ ...inputStyle, display: "block" }}>
                  <option value="">Select location</option>
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "9px 20px", background: "#F1F5F9", color: "#374151", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: "9px 20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{saving ? "Creating..." : "Create User"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
