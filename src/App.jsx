import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ToastProvider } from "./components/Toast";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllShipments from "./pages/AllShipments";
import CreateShipment from "./pages/CreateShipment";
import ShipmentDetails from "./pages/ShipmentDetails";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Roles from "./pages/Roles";
import AppSettings from "./pages/AppSettings";
import TrackShipment from "./pages/TrackShipment";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/shipments" element={<ProtectedRoute><AllShipments /></ProtectedRoute>} />
          <Route path="/shipments/create" element={<ProtectedRoute><CreateShipment /></ProtectedRoute>} />
          <Route path="/shipments/:id" element={<ProtectedRoute><ShipmentDetails /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/roles" element={<ProtectedRoute adminOnly><Roles /></ProtectedRoute>} />
          <Route path="/app-settings" element={<ProtectedRoute adminOnly><AppSettings /></ProtectedRoute>} />
          <Route path="/track/:id" element={<TrackShipment />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </ToastProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
