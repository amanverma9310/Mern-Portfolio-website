import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiMail,
  FiFolder,
  FiCode,
  FiGlobe,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiExternalLink,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/dashboard/messages", label: "Messages", icon: FiMail },
  { to: "/admin/dashboard/projects", label: "Projects", icon: FiFolder },
  { to: "/admin/dashboard/skills", label: "Skills", icon: FiCode },
  { to: "/admin/dashboard/journey", label: "Journey", icon: FiGlobe },
  { to: "/admin/dashboard/settings", label: "Settings", icon: FiSettings },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const NavContent = () => (
    <>
      <div className="px-5 py-6 border-b border-white/10">
        <div className="text-sm font-bold text-white tracking-tight">Admin Dashboard</div>
        <div className="text-xs text-white/40 mt-1 truncate">{admin?.email}</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <FiExternalLink size={16} />
          View Live Site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-white/10 bg-[#0c0d10]">
        <NavContent />
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0c0d10] border-b border-white/10">
        <span className="text-sm font-bold">Admin Dashboard</span>
        <button onClick={() => setMobileOpen((v) => !v)} className="text-white/70">
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60" onClick={() => setMobileOpen(false)}>
          <aside
            className="absolute top-0 left-0 h-full w-64 bg-[#0c0d10] border-r border-white/10 flex flex-col pt-14"
            onClick={(e) => e.stopPropagation()}
          >
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-8 py-6 md:py-8 pt-20 md:pt-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
