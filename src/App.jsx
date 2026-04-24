import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllShipments from "./pages/AllShipments";
import CreateShipment from "./pages/CreateShipment";
import ShipmentDetails from "./pages/ShipmentDetails";
import Users from "./pages/Users";
import Reports from "./pages/Reports";

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
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/shipments" element={<ProtectedRoute><AllShipments /></ProtectedRoute>} />
        <Route path="/shipments/create" element={<ProtectedRoute><CreateShipment /></ProtectedRoute>} />
        <Route path="/shipments/:id" element={<ProtectedRoute><ShipmentDetails /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
