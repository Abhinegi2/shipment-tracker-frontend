import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    setError("");
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.pending) {
        setError("Your account is awaiting admin approval. You'll be notified once approved.");
      } else {
        setError(err.response?.data?.message || "Google sign-in failed. Please try again.");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{`
        @media (max-width: 640px) {
          .login-panel { display: none !important; }
          .login-card { max-width: 100% !important; }
          .login-form-side { padding: 32px 24px !important; }
        }
      `}</style>
      <div className="login-card" style={{ display: "flex", width: "100%", maxWidth: 860, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
        <div className="login-panel" style={{ flex: 1, background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)", padding: 48, display: "flex", flexDirection: "column", justifyContent: "center", color: "#fff", minWidth: 0 }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>🚚</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.3 }}>Track Every Shipment<br />Real-Time, Always</h1>
          <p style={{ fontSize: 13, opacity: 0.8, margin: 0, lineHeight: 1.7 }}>Monitor equipment shipments across all locations with real-time status updates and full timeline tracking.</p>
          <div style={{ marginTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["Real-time Updates", "Timeline View", "Multi-location"].map(t => (
              <div key={t} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600 }}>{t}</div>
            ))}
          </div>
        </div>

        <div className="login-form-side" style={{ flex: 1, padding: 48, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
          <div style={{ fontSize: 32, marginBottom: 8, display: "none" }} className="mobile-logo">🚚</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1E293B", margin: "0 0 6px" }}>Sign in to your account</h2>
          <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 24px" }}>Enter your credentials to continue</p>

          {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <div style={{ marginBottom: 20 }}>
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => setError("Google sign-in failed.")}
              width="100%"
              theme="outline"
              size="large"
              text="signin_with"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
            <span style={{ fontSize: 12, color: "#94A3B8" }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="Enter your email" style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, outline: "none", color: "#1E293B", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="Enter your password" style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, outline: "none", color: "#1E293B", boxSizing: "border-box" }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "11px 0", background: loading ? "#93C5FD" : "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", marginTop: 20 }}>Default: admin@shiptrack.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
