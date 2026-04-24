import { useState, useEffect } from "react";
import { usersAPI, rolesAPI } from "../api";
import { Spinner, inputStyle, INDIAN_STATES } from "../components/UI";
import { useToast } from "../components/Toast";

const emptyForm = { name: "", email: "", password: "", role: "location_user", state: "", district: "", pincode: "" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  useEffect(() => {
    Promise.all([usersAPI.getAll(), rolesAPI.getAll()])
      .then(([uRes, rRes]) => { setUsers(uRes.data); setRoles(rRes.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const location = [form.district, form.state, form.pincode].filter(Boolean).join(", ");
      const res = await usersAPI.create({ ...form, location });
      setUsers(u => [res.data, ...u]);
      setShowModal(false);
      setForm(emptyForm);
      toast.success("User created successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally { setSaving(false); }
  };

  const toggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await usersAPI.update(user._id, { status: newStatus });
      setUsers(u => u.map(x => x._id === user._id ? { ...x, status: newStatus } : x));
      toast.success(`User ${newStatus === "active" ? "activated" : "deactivated"}`);
    } catch { toast.error("Failed to update status"); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const pendingUsers = users.filter(u => u.status === "pending");
  const activeUsers = users.filter(u => u.status !== "pending");

  const approveUser = async (user) => {
    try {
      await usersAPI.update(user._id, { status: "active" });
      setUsers(u => u.map(x => x._id === user._id ? { ...x, status: "active" } : x));
      toast.success(`${user.name} approved`);
    } catch { toast.error("Failed to approve user"); }
  };

  const rejectUser = async (user) => {
    if (!window.confirm(`Reject and deactivate "${user.name}"?`)) return;
    try {
      await usersAPI.update(user._id, { status: "inactive" });
      setUsers(u => u.map(x => x._id === user._id ? { ...x, status: "inactive" } : x));
      toast.info(`${user.name} rejected`);
    } catch { toast.error("Failed to reject user"); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1E293B" }}>Users</h2>
        <button onClick={() => { setForm(emptyForm); setError(""); setShowModal(true); }} style={{ background: "var(--color-primary,#2563EB)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add User</button>
      </div>

      {pendingUsers.length > 0 && (
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 16 }}>⏳</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#92400E" }}>Pending Approval ({pendingUsers.length})</span>
            <span style={{ fontSize: 12, color: "#B45309" }}>— These users signed in with Google and are awaiting your approval</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pendingUsers.map(u => (
              <div key={u._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #FDE68A", borderRadius: 8, padding: "12px 16px", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {u.avatar
                    ? <img src={u.avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                    : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FDE68A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#92400E" }}>{u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                  }
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{u.email} · Google SSO</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => approveUser(u)} style={{ padding: "6px 16px", background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Approve</button>
                  <button onClick={() => rejectUser(u)} style={{ padding: "6px 16px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        {loading ? <Spinner /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {[["Name",false],["Email",true],["Role",false],["Location",true],["Status",false],["Action",false]].map(([h, hide]) => (
                    <th key={h} className={hide ? "col-hide-mobile" : ""} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeUsers.map(u => (
                  <tr key={u._id} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#1D4ED8" }}>
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{u.name}</span>
                      </div>
                    </td>
                    <td className="col-hide-mobile" style={{ padding: "12px 20px", fontSize: 13, color: "#64748B" }}>{u.email}</td>
                    <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151", textTransform: "capitalize" }}>
                      {u.role === "location_user" ? "Location User" : u.role}
                    </td>
                    <td className="col-hide-mobile" style={{ padding: "12px 20px", fontSize: 13, color: "#64748B" }}>{u.location || "—"}</td>
                    <td style={{ padding: "12px 20px" }}>
                      <span style={{ background: u.status === "active" ? "#F0FDF4" : "#FEF2F2", color: u.status === "active" ? "#15803D" : "#DC2626", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                        {u.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <button onClick={() => toggleStatus(u)} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "1px solid #BFDBFE", borderRadius: 6, padding: "4px 12px", fontWeight: 600, cursor: "pointer" }}>
                        {u.status === "active" ? "Deactivate" : "Activate"}
                      </button>
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
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#1E293B" }}>Add New User</span>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, color: "#94A3B8", cursor: "pointer" }}>×</button>
            </div>

            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "8px 12px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>}

            <form onSubmit={handleCreate}>
              {[["Name", "name", "text"], ["Email", "email", "email"], ["Password", "password", "password"]].map(([label, key, type]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{label} *</label>
                  <input required type={type} value={form[key]} onChange={set(key)} style={{ ...inputStyle, display: "block" }} />
                </div>
              ))}

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Role</label>
                <select value={form.role} onChange={set("role")} style={{ ...inputStyle, display: "block", cursor: "pointer" }}>
                  <option value="admin">Admin</option>
                  <option value="location_user">Location User</option>
                  {roles.map(r => <option key={r._id} value={r.name}>{r.name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>Location</label>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>State</label>
                  <select value={form.state} onChange={set("state")} style={{ ...inputStyle, display: "block", cursor: "pointer" }}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>District</label>
                    <input value={form.district} onChange={set("district")} placeholder="e.g. Dehradun" style={{ ...inputStyle, display: "block" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>Pincode</label>
                    <input value={form.pincode} onChange={set("pincode")} placeholder="6-digit" maxLength={6} style={{ ...inputStyle, display: "block" }} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "9px 20px", background: "#F1F5F9", color: "#374151", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: "9px 20px", background: saving ? "#93C5FD" : "var(--color-primary,#2563EB)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
