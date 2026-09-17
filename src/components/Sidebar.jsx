import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserCog,
  GraduationCap,
  School,
  BookOpen,
  ClipboardCheck,
  FileText,
  CalendarDays,
  WalletCards,
  Megaphone,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserRound,
  HeartHandshake,
} from "lucide-react";

import {
  useAuth,
  getEffectiveRole,
} from "../context/AuthContext";

import "./Sidebar.css";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // =========================================================
  // EFFECTIVE ROLE
  // =========================================================

  const role = getEffectiveRole(user);

  // =========================================================
  // DASHBOARD PATH
  // =========================================================

  const getDashboardPath = () => {
    if (!user) {
      return "/login";
    }

    switch (role) {
      case "admin":
        return "/dashboard";

      case "super_admin":
      case "superadmin":
        return "/superadmin";

      case "teacher":
        return "/Tdashboard";

      case "student":
        return "/Stdashboard";

      case "parent":
        return "/Pdashboard";

      case "staff":
        return "/Sdashboard";

      case "counsellor":
        return "/Cdashboard";

      case "bursar":
        return "/Bdashboard";

      default:
        return "/login";
    }
  };

  // =========================================================
  // ROLE-BASED NAVIGATION
  // =========================================================

  const roleNavigation = {
    // =======================================================
    // ADMIN
    // =======================================================

    admin: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Students",
        path: "/students",
        icon: GraduationCap,
      },
      {
        label: "Staff",
        path: "/staff",
        icon: Users,
      },
      {
        label: "Teachers",
        path: "/teachers",
        icon: School,
      },
      {
        label: "Academics",
        path: "/academics",
        icon: BookOpen,
      },
      {
        label: "Attendance",
        path: "/attendance",
        icon: ClipboardCheck,
      },
      {
        label: "Results",
        path: "/results",
        icon: FileText,
      },
      {
        label: "Assignments",
        path: "/assignments",
        icon: BookOpen,
      },
      {
        label: "Timetable",
        path: "/timetable",
        icon: CalendarDays,
      },
      {
        label: "Fees & Finance",
        path: "/finance",
        icon: WalletCards,
      },
      {
        label: "Counselling",
        path: "/counselling",
        icon: HeartHandshake,
      },
      {
        label: "Communications",
        path: "/communications",
        icon: Megaphone,
      },
      {
        label: "Announcements",
        path: "/announcements",
        icon: Megaphone,
      },
      {
        label: "Notifications",
        path: "/notifications",
        icon: Bell,
      },
      {
        label: "Reports",
        path: "/reports",
        icon: BarChart3,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
// =======================================================
// SUPER ADMIN
// =======================================================

super_admin: [
  {
    label: "Dashboard",
    path: "/superadmin",
    icon: LayoutDashboard,
  },
  {
    label: "Schools",
    path: "/schools",
    icon: School,
  },
  {
    label: "Super Admins",
    path: "/superadmin/admins",
    icon: UserCog,
  },
],

superadmin: [
  {
    label: "Dashboard",
    path: "/superadmin",
    icon: LayoutDashboard,
  },
  {
    label: "Schools",
    path: "/schools",
    icon: School,
  },
  {
    label: "Super Admins",
    path: "/superadmin/admins",
    icon: UserCog,
  },
],

    // =======================================================
    // TEACHER
    // =======================================================

    teacher: [
      {
        label: "Dashboard",
        path: "/Tdashboard",
        icon: LayoutDashboard,
      },
      {
        label: "My Students",
        path: "/students",
        icon: Users,
      },
      {
        label: "Attendance",
        path: "/attendance",
        icon: ClipboardCheck,
      },
      {
        label: "Results",
        path: "/results",
        icon: FileText,
      },
      {
        label: "Assignments",
        path: "/assignments",
        icon: BookOpen,
      },
      {
        label: "Lesson Notes",
        path: "/lesson-notes",
        icon: FileText,
      },
      {
        label: "Timetable",
        path: "/timetable",
        icon: CalendarDays,
      },
      {
        label: "Announcements",
        path: "/announcements",
        icon: Megaphone,
      },
      {
        label: "Notifications",
        path: "/notifications",
        icon: Bell,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],

    // =======================================================
    // STUDENT
    // =======================================================

    student: [
      {
        label: "Dashboard",
        path: "/Stdashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Grade Summary",
        path: "/grades",
        icon: BarChart3,
      },
      {
        label: "Subjects",
        path: "/subjects",
        icon: BookOpen,
      },
      {
        label: "Assignments",
        path: "/assignments",
        icon: FileText,
      },
      {
        label: "Schedule",
        path: "/timetable",
        icon: CalendarDays,
      },
      {
        label: "Announcements",
        path: "/announcements",
        icon: Megaphone,
      },
      {
        label: "Notifications",
        path: "/notifications",
        icon: Bell,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],

    // =======================================================
    // PARENT
    // =======================================================

    parent: [
      {
        label: "Dashboard",
        path: "/Pdashboard",
        icon: LayoutDashboard,
      },
      {
        label: "My Children",
        path: "/students",
        icon: Users,
      },
      {
        label: "Results",
        path: "/results",
        icon: BarChart3,
      },
      {
        label: "Attendance",
        path: "/attendance",
        icon: ClipboardCheck,
      },
      {
        label: "Fees & Finance",
        path: "/finance",
        icon: WalletCards,
      },
      {
        label: "Announcements",
        path: "/announcements",
        icon: Megaphone,
      },
      {
        label: "Notifications",
        path: "/notifications",
        icon: Bell,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],

    // =======================================================
    // STAFF
    // =======================================================

    staff: [
      {
        label: "Dashboard",
        path: "/Sdashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Students",
        path: "/students",
        icon: GraduationCap,
      },
      {
        label: "Teachers",
        path: "/teachers",
        icon: School,
      },
      {
        label: "Attendance",
        path: "/attendance",
        icon: ClipboardCheck,
      },
      {
        label: "Announcements",
        path: "/announcements",
        icon: Megaphone,
      },
      {
        label: "Notifications",
        path: "/notifications",
        icon: Bell,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],

    // =======================================================
    // COUNSELLOR
    // =======================================================

    counsellor: [
      {
        label: "Dashboard",
        path: "/Cdashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Students",
        path: "/students",
        icon: GraduationCap,
      },
      {
        label: "Counselling",
        path: "/counselling",
        icon: HeartHandshake,
      },
      {
        label: "Announcements",
        path: "/announcements",
        icon: Megaphone,
      },
      {
        label: "Notifications",
        path: "/notifications",
        icon: Bell,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],

    // =======================================================
    // BURSAR
    // =======================================================

    bursar: [
      {
        label: "Dashboard",
        path: "/Bdashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Students",
        path: "/students",
        icon: GraduationCap,
      },
      {
        label: "Fees & Finance",
        path: "/finance",
        icon: WalletCards,
      },
      {
        label: "Reports",
        path: "/reports",
        icon: BarChart3,
      },
      {
        label: "Notifications",
        path: "/notifications",
        icon: Bell,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
  };

  // =========================================================
  // GET CURRENT ROLE NAVIGATION
  // =========================================================

  const visibleItems = roleNavigation[role] || [];

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    setProfileOpen(false);
    setIsOpen(false);

    logout();

    navigate("/login");
  };

  // =========================================================
  // USER NAME
  // =========================================================

  const getUserName = () => {
    if (!user) {
      return "User";
    }

    if (user.fullName) {
      return user.fullName;
    }

    const name = `${user.firstName || ""} ${
      user.lastName || ""
    }`.trim();

    return name || "User";
  };

  // =========================================================
  // USER ROLE
  // =========================================================

  const getUserRole = () => {
    if (!user) {
      return "User";
    }

    if (role === "counsellor") {
      return "Counsellor";
    }

    if (user.staffRole) {
      return user.staffRole;
    }

    if (user.role) {
      return user.role;
    }

    return "User";
  };

  // =========================================================
  // USER INITIAL
  // =========================================================

  const getInitial = () => {
    const name = getUserName();

    return name.charAt(0).toUpperCase();
  };

  // =========================================================
  // CLOSE MOBILE SIDEBAR
  // =========================================================

  const closeMobileSidebar = () => {
    setIsOpen(false);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      {/* =====================================================
          MOBILE MENU BUTTON
      ===================================================== */}

      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu size={24} />
      </button>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <GraduationCap size={25} />
            </div>

            <div>
              <h2>EduNigeria</h2>

              <span>School Management</span>
            </div>
          </div>

          <button
            className="close-sidebar"
            onClick={closeMobileSidebar}
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* ===================================================
            SCHOOL INFORMATION
        =================================================== */}

        <div className="school-section">
          <div className="school-avatar">
            <School size={20} />
          </div>

          <div className="school-info">
            <strong>
              {role === "super_admin" ||
              role === "superadmin"
                ? "EduNigeria Platform"
                : user?.school?.name ||
                  user?.schoolName ||
                  "My School"}
            </strong>

            <span>
              {role === "super_admin" ||
              role === "superadmin"
                ? "Platform Administration"
                : "School Portal"}
            </span>
          </div>
        </div>

        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav className="sidebar-nav">
          <p className="nav-title">MAIN MENU</p>

          {visibleItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.label === "Dashboard"}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={20} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* ===================================================
            BOTTOM PROFILE
        =================================================== */}

        <div className="sidebar-bottom">
          <div className="profile-wrapper">
            <button
              className="profile-button"
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
            >
              <div className="profile-avatar">
                {getInitial()}
              </div>

              <div className="profile-info">
                <strong>{getUserName()}</strong>

                <span>{getUserRole()}</span>
              </div>

              <ChevronDown
                size={17}
                className={
                  profileOpen ? "rotate" : ""
                }
              />
            </button>

            {/* =================================================
                PROFILE MENU
            ================================================= */}

            {profileOpen && (
              <div className="profile-menu">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                >
                  <UserRound size={17} />

                  My Profile
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/settings");
                  }}
                >
                  <Settings size={17} />

                  Settings
                </button>

                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />

                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}