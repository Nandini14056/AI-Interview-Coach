import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import Landing from "@/pages/Landing/Landing";
import Auth from "@/pages/Auth/Auth";
import Setup from "@/pages/Setup/Setup";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Interview from "@/pages/Interview/Interview";
import Results from "@/pages/Results/Results";
import History from "@/pages/History/History";
import Analytics from "@/pages/Analytics/Analytics";
import Settings from "@/pages/Settings/Settings";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/setup" element={<Setup />} />
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/interview/:id" element={<Interview />} />
            <Route path="/results/:id" element={<Results />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
