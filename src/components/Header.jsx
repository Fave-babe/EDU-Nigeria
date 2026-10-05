import { useAuth, getEffectiveRole } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

export default function Header({ title, subtitle }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = getEffectiveRole(user);

  const userName =
    user?.fullName ||
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "User";

  const roleLabel =
    role === "counsellor"
      ? "Counsellor"
      : role === "super_admin"
        ? "Super Admin"
        : role
          ? role.charAt(0).toUpperCase() + role.slice(1)
          : "User";

  return (
    <header className="app-header dashboard-topbar">
      {/* Page information */}
      <div className="header-left">
        <h1 className="page-title">{title}</h1>

        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      {/* Header actions */}
      <div className="header-actions">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button
          type="button"
          className="notification-bell"
          onClick={() => navigate("/notifications")}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />

          <span className="notification-dot"></span>
        </button>

        {/* User */}
        <div className="header-user">
          <div className="header-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="header-user-info">
            <span className="header-user-name">{userName}</span>

            <span className="header-user-role">{roleLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
