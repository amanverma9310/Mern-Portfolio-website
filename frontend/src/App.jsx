import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import PortfolioPage from "./pages/PortfolioPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import MessagesPage from "./pages/admin/MessagesPage";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import SkillsAdmin from "./pages/admin/SkillsAdmin";
import PlanetsAdmin from "./pages/admin/PlanetsAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import ProtectedRoute from "./components/admin/ProtectedRoute";

export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <Routes>
      {/* Public portfolio — unchanged design, now backend-connected */}
      <Route path="/" element={<PortfolioPage dark={dark} setDark={setDark} />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="skills" element={<SkillsAdmin />} />
        <Route path="journey" element={<PlanetsAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
    </Routes>
  );
}
