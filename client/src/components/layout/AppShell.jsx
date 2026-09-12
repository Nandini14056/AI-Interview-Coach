import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  BrainCircuit,
  History,
  LayoutDashboard,
  LogOut,
  Play,
  Settings,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "Interview History", icon: History },
  { to: "/analytics", label: "Performance Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <BrainCircuit size={18} />
          </div>
          <div>
            <strong>AI Interview</strong>
            <span>Coach</span>
          </div>
        </div>
        <p className="tagline">Elevate Your Career</p>
        <button
          className="primary-btn sidebar-cta"
          onClick={() => navigate("/setup")}
        >
          <Play size={15} /> Start Interview
        </button>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `side-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={15} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-profile">
            <div className="avatar">
              {(user?.username || "A").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <strong>{user?.username || "Developer"}</strong>
              <span>{user?.email || ""}</span>
            </div>
          </div>
          <button className="side-link logout" onClick={logout}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-brand">
            <Sparkles size={16} /> AI Coach
          </div>
          <button className="outline-btn" onClick={() => navigate("/setup")}>
            <Play size={14} /> Start New Interview
          </button>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
