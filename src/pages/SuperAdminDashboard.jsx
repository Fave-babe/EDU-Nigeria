
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Activity,
  AlertCircle,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  School,
  Search,
  Settings,
  ShieldCheck,
  Users,
  UserCog,
  X,
} from "lucide-react";

import "./SuperAdminDashboard.css";

import { useAuth } from "../context/AuthContext";
import {
  getSchools,
  createSchool,
} from "../api/school.api";


/* =========================================================================
   STATUS BADGE
   ========================================================================= */

function StatusBadge({ isActive, status }) {
  const normalizedStatus = String(status || "").toLowerCase();

  const active =
    isActive === true ||
    normalizedStatus === "active";

  const pending =
    normalizedStatus === "pending";

  const label = active
    ? "Active"
    : pending
    ? "Pending"
    : "Inactive";

  return (
    <span
      className={`sa-status-badge ${
        active
          ? "sa-status-active"
          : pending
          ? "sa-status-pending"
          : "sa-status-inactive"
      }`}
    >
      {active ? (
        <CheckCircle2 size={13} />
      ) : (
        <Clock3 size={13} />
      )}

      {label}
    </span>
  );
}


/* =========================================================================
   STAT CARD
   ========================================================================= */

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}) {
  return (
    <div className="sa-stat-card">
      <div className="sa-stat-top">
        <div className="sa-stat-icon">
          <Icon size={21} />
        </div>

        <span className="sa-stat-arrow">
          <ChevronRight size={18} />
        </span>
      </div>

      <div className="sa-stat-value">
        {value}
      </div>

      <div className="sa-stat-title">
        {title}
      </div>

      {description && (
        <div className="sa-stat-description">
          {description}
        </div>
      )}
    </div>
  );
}


/* =========================================================================
   SUPER ADMIN DASHBOARD
   ========================================================================= */

function SuperAdminDashboard() {
  console.log("SUPER ADMIN DASHBOARD RENDERED");

  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();


  /* =========================================================================
     STATE
     ========================================================================= */

  const [schools, setSchools] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showAddSchool, setShowAddSchool] =
    useState(false);

  const [showAllSchools, setShowAllSchools] =
    useState(false);

  const [creatingSchool, setCreatingSchool] =
    useState(false);

  const [createSchoolError, setCreateSchoolError] =
    useState("");

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [schoolForm, setSchoolForm] =
    useState({
      name: "",
      schoolType: "Primary",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
    });


  /* =========================================================================
     LOAD SCHOOLS
     ========================================================================= */

  const loadSchools = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSchools();

      console.log("SCHOOLS RESPONSE:", response);

      const schoolData =
        Array.isArray(response?.schools)
          ? response.schools
          : [];

      setSchools(schoolData);
    } catch (err) {
      console.error(
        "FAILED TO LOAD SCHOOLS:",
        err
      );

      setError(
        err?.message ||
        "Failed to load schools."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadSchools();
  }, []);


  /* =========================================================================
     STATISTICS
     ========================================================================= */

  const totalSchools =
    schools.length;

  const activeSchools =
    schools.filter(
      (school) =>
        school?.isActive === true ||
        String(
          school?.status || ""
        ).toLowerCase() === "active"
    ).length;

  const pendingSchools =
    schools.filter(
      (school) =>
        String(
          school?.status || ""
        ).toLowerCase() === "pending"
    ).length;

  const primarySchools =
    schools.filter(
      (school) =>
        school?.schoolType === "Primary"
    ).length;

  const secondarySchools =
    schools.filter(
      (school) =>
        school?.schoolType === "Secondary"
    ).length;

  const combinedSchools =
    schools.filter(
      (school) =>
        school?.schoolType ===
        "Primary & Secondary"
    ).length;


  /* =========================================================================
     RECENT SCHOOLS
     ========================================================================= */

  const recentSchools = useMemo(() => {
    return [...schools]
      .sort(
        (a, b) =>
          new Date(
            b?.createdAt || 0
          ) -
          new Date(
            a?.createdAt || 0
          )
      )
      .slice(0, 5);
  }, [schools]);


  /* =========================================================================
     FILTERED SCHOOLS
     ========================================================================= */

  const filteredSchools = useMemo(() => {
    const term =
      searchTerm
        .trim()
        .toLowerCase();

    if (!term) {
      return showAllSchools
        ? schools
        : recentSchools;
    }

    return schools.filter((school) => {
      const values = [
        school?.name,
        school?.email,
        school?.schoolType,
        school?.city,
        school?.state,
        school?.country,
      ];

      return values
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(term)
        );
    });
  }, [
    schools,
    recentSchools,
    searchTerm,
    showAllSchools,
  ]);


  /* =========================================================================
     ADMIN DETAILS
     ========================================================================= */

  const adminName =
    user?.fullName ||
    user?.name ||
    "Super Admin";

  const adminInitial =
    adminName
      .charAt(0)
      .toUpperCase();


  /* =========================================================================
     SCHOOL NAVIGATION
     ========================================================================= */

  const openSchool = () => {
    navigate("/schools");
  };


  /* =========================================================================
     FORM
     ========================================================================= */

  const handleSchoolFormChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setSchoolForm((previous) => ({
        ...previous,
        [name]: value,
      }));
    };


  /* =========================================================================
     CREATE SCHOOL
     ========================================================================= */

  const handleCreateSchool =
    async (event) => {
      event.preventDefault();

      try {
        setCreatingSchool(true);
        setCreateSchoolError("");

        await createSchool(schoolForm);

        setSchoolForm({
          name: "",
          schoolType: "Primary",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          country: "Nigeria",
        });

        setShowAddSchool(false);

        await loadSchools();
      } catch (err) {
        console.error(
          "FAILED TO CREATE SCHOOL:",
          err
        );

        setCreateSchoolError(
          err?.message ||
          "Failed to create school."
        );
      } finally {
        setCreatingSchool(false);
      }
    };


  /* =========================================================================
     LOGOUT
     ========================================================================= */

  const handleLogout = () => {
    logout();
  };


  /* =========================================================================
     DATE
     ========================================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  /* =========================================================================
     MOBILE SIDEBAR
     ========================================================================= */

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };


  /* =========================================================================
     RENDER
     ========================================================================= */

  return (
    <div className="super-admin-dashboard">

      {/* MOBILE OVERLAY */}

      {mobileSidebarOpen && (
        <div
          className="sa-sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}


      {/* SIDEBAR */}

      <aside
        className={`sa-sidebar ${
          mobileSidebarOpen
            ? "sa-sidebar-open"
            : ""
        }`}
      >

        <div className="sa-sidebar-brand">

          <div className="sa-brand-logo">
            <GraduationCap size={27} />
          </div>

          <div>
            <div className="sa-brand-name">
              EduNigeria
            </div>

            <div className="sa-brand-subtitle">
              Platform Administration
            </div>
          </div>

          <button
            className="sa-mobile-close"
            onClick={closeMobileSidebar}
            type="button"
          >
            <X size={21} />
          </button>

        </div>


        <div className="sa-sidebar-divider" />


        {/* MAIN MENU */}

        <div className="sa-sidebar-section">

          <span className="sa-sidebar-label">
            MAIN MENU
          </span>

          <nav className="sa-sidebar-nav">

            <NavLink
              to="/super-admin"
              end
              className={({ isActive }) =>
                `sa-nav-item ${
                  isActive
                    ? "sa-nav-active"
                    : ""
                }`
              }
              onClick={closeMobileSidebar}
            >
              <LayoutDashboard size={19} />
              <span>Dashboard</span>
            </NavLink>


            <NavLink
              to="/schools"
              className={({ isActive }) =>
                `sa-nav-item ${
                  isActive
                    ? "sa-nav-active"
                    : ""
                }`
              }
              onClick={closeMobileSidebar}
            >
              <Building2 size={19} />
              <span>Schools</span>
            </NavLink>


            <button
              className="sa-nav-item"
              type="button"
              onClick={() =>
                navigate("/superadmin/admins")
              }
            >
              <Users size={19} />
              <span>Users</span>
            </button>


            <button
              className="sa-nav-item"
              type="button"
              onClick={() =>
                navigate("/reports")
              }
            >
              <FileBarChart size={19} />
              <span>Reports</span>
            </button>


            <button
              className="sa-nav-item"
              type="button"
              onClick={closeMobileSidebar}
            >
              <Activity size={19} />
              <span>Activity</span>
            </button>

          </nav>

        </div>


        {/* SYSTEM */}

        <div className="sa-sidebar-section sa-sidebar-system">

          <span className="sa-sidebar-label">
            SYSTEM
          </span>

          <nav className="sa-sidebar-nav">

            <button
              className="sa-nav-item"
              type="button"
              onClick={() =>
                navigate("/settings")
              }
            >
              <Settings size={19} />
              <span>Settings</span>
            </button>

          </nav>

        </div>


        {/* SIDEBAR USER */}

        <div className="sa-sidebar-bottom">

          <div className="sa-sidebar-user">

            <div className="sa-sidebar-avatar">
              {adminInitial}
            </div>

            <div className="sa-sidebar-user-info">

              <strong>
                {adminName}
              </strong>

              <span>
                Super Administrator
              </span>

            </div>

          </div>


          <button
            className="sa-sidebar-logout"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* MAIN WRAPPER */}

      <div className="sa-main-wrapper">


        {/* TOPBAR */}

        <header className="sa-topbar">

          <div className="sa-topbar-left">

            <button
              className="sa-mobile-menu"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
              type="button"
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="sa-topbar-label">
                PLATFORM ADMINISTRATION
              </span>

              <h1>
                Super Admin Dashboard
              </h1>
            </div>

          </div>


          <div className="sa-topbar-right">

            <div className="sa-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search schools..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

            </div>


            <button
              className="sa-icon-button"
              type="button"
            >
              <Bell size={19} />
              <span className="sa-notification-dot" />
            </button>


            <div className="sa-topbar-profile">

              <div className="sa-topbar-avatar">
                {adminInitial}
              </div>

              <div className="sa-topbar-profile-info">

                <strong>
                  {adminName}
                </strong>

                <span>
                  Super Admin
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* MAIN CONTENT */}

        <main className="sa-main-content">


          {/* PAGE INTRO */}

          <section className="sa-page-intro">

            <div>

              <span className="sa-page-eyebrow">
                OVERVIEW
              </span>

              <h2>
                Welcome back,{" "}
                {adminName.split(" ")[0]}.
              </h2>

              <p>
                Monitor schools, users
                and platform activity
                from one central
                dashboard.
              </p>

            </div>


            <div className="sa-page-actions">

              <button
                className="sa-secondary-button"
                onClick={loadSchools}
                disabled={loading}
                type="button"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? "sa-spin"
                      : ""
                  }
                />

                Refresh
              </button>


              <button
                className="sa-primary-button"
                onClick={() => {
                  setCreateSchoolError("");
                  setShowAddSchool(true);
                }}
                type="button"
              >
                <Plus size={18} />
                Add School
              </button>

            </div>

          </section>


          {/* ERROR */}

          {error && (
            <div className="sa-error-box">

              <AlertCircle size={19} />

              <div>

                <strong>
                  Unable to load schools
                </strong>

                <p>
                  {error}
                </p>

              </div>

            </div>
          )}


          {/* STAT CARDS */}

          <section className="sa-stat-grid">

            <StatCard
              title="Total Schools"
              value={
                loading
                  ? "—"
                  : totalSchools
              }
              icon={Building2}
              description="Registered on EduNigeria"
            />

            <StatCard
              title="Active Schools"
              value={
                loading
                  ? "—"
                  : activeSchools
              }
              icon={CheckCircle2}
              description="Currently active"
            />

            <StatCard
              title="Pending Schools"
              value={
                loading
                  ? "—"
                  : pendingSchools
              }
              icon={Clock3}
              description="Awaiting activation"
            />

            <StatCard
              title="Platform Users"
              value="—"
              icon={Users}
              description="User management"
            />

          </section>


          {/* SCHOOL BREAKDOWN */}

          <section className="sa-section">

            <div className="sa-section-heading">

              <div>

                <span>
                  REGISTRATION BREAKDOWN
                </span>

                <h3>
                  Schools by Type
                </h3>

              </div>

            </div>


            <div className="sa-breakdown-grid">

              <div className="sa-breakdown-card">

                <div className="sa-breakdown-icon">
                  <GraduationCap size={21} />
                </div>

                <div>
                  <strong>
                    {primarySchools}
                  </strong>

                  <span>
                    Primary Schools
                  </span>
                </div>

              </div>


              <div className="sa-breakdown-card">

                <div className="sa-breakdown-icon">
                  <School size={21} />
                </div>

                <div>
                  <strong>
                    {secondarySchools}
                  </strong>

                  <span>
                    Secondary Schools
                  </span>
                </div>

              </div>


              <div className="sa-breakdown-card">

                <div className="sa-breakdown-icon">
                  <Building2 size={21} />
                </div>

                <div>
                  <strong>
                    {combinedSchools}
                  </strong>

                  <span>
                    Primary & Secondary
                  </span>
                </div>

              </div>

            </div>

          </section>


          {/* SCHOOLS */}

          <section className="sa-section">

            <div className="sa-section-heading">

              <div>

                <span>
                  REGISTERED SCHOOLS
                </span>

                <h3>
                  {showAllSchools ||
                  searchTerm
                    ? "All Schools"
                    : "Recent Schools"}
                </h3>

              </div>


              <button
                className="sa-text-button"
                onClick={() =>
                  setShowAllSchools(
                    (value) => !value
                  )
                }
                type="button"
              >
                {showAllSchools
                  ? "Show Recent"
                  : "View All"}

                <ChevronRight size={16} />
              </button>

            </div>


            <div className="sa-school-panel">

              {loading ? (

                <div className="sa-empty-state">

                  <RefreshCw
                    size={25}
                    className="sa-spin"
                  />

                  <span>
                    Loading schools...
                  </span>

                </div>

              ) : filteredSchools.length === 0 ? (

                <div className="sa-empty-state">

                  <Building2 size={28} />

                  <strong>
                    No schools found
                  </strong>

                  <span>
                    Try another search or
                    add a new school.
                  </span>

                </div>

              ) : (

                <>

                  {/* DESKTOP TABLE */}

                  <div className="sa-table-wrapper">

                    <table className="sa-school-table">

                      <thead>
                        <tr>
                          <th>School</th>
                          <th>Location</th>
                          <th>Type</th>
                          <th>Registered</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>

                        {filteredSchools.map(
                          (school) => {

                            const schoolId =
                              school?._id ||
                              school?.id;

                            return (
                              <tr
                                key={schoolId}
                                className="sa-school-row"
                                onClick={openSchool}
                              >

                                <td>

                                  <div className="sa-school-name-cell">

                                    <div className="sa-school-logo">
                                      <Building2 size={18} />
                                    </div>

                                    <div>

                                      <strong>
                                        {school?.name ||
                                          "Unnamed School"}
                                      </strong>

                                      <span>
                                        {school?.email ||
                                          "No email"}
                                      </span>

                                    </div>

                                  </div>

                                </td>


                                <td>

                                  <span className="sa-location">

                                    {[
                                      school?.city,
                                      school?.state,
                                    ]
                                      .filter(Boolean)
                                      .join(", ") ||
                                      "—"}

                                  </span>

                                </td>


                                <td>

                                  <span className="sa-type-pill">
                                    {school?.schoolType ||
                                      "—"}
                                  </span>

                                </td>


                                <td>
                                  {formatDate(
                                    school?.createdAt
                                  )}
                                </td>


                                <td>

                                  <StatusBadge
                                    isActive={
                                      school?.isActive
                                    }
                                    status={
                                      school?.status
                                    }
                                  />

                                </td>

                              </tr>
                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>


                  {/* MOBILE SCHOOL LIST */}

                  <div className="sa-mobile-school-list">

                    {filteredSchools.map(
                      (school) => {

                        const schoolId =
                          school?._id ||
                          school?.id;

                        return (
                          <div
                            className="sa-mobile-school-card"
                            key={schoolId}
                            onClick={openSchool}
                          >

                            <div className="sa-mobile-school-top">

                              <div className="sa-school-logo">
                                <Building2 size={18} />
                              </div>

                              <div>

                                <strong>
                                  {school?.name ||
                                    "Unnamed School"}
                                </strong>

                                <span>
                                  {school?.email ||
                                    "No email"}
                                </span>

                              </div>

                            </div>


                            <div className="sa-mobile-school-details">

                              <div>

                                <span>
                                  Location
                                </span>

                                <strong>
                                  {[
                                    school?.city,
                                    school?.state,
                                  ]
                                    .filter(Boolean)
                                    .join(", ") ||
                                    "—"}
                                </strong>

                              </div>


                              <div>

                                <span>
                                  Type
                                </span>

                                <strong>
                                  {school?.schoolType ||
                                    "—"}
                                </strong>

                              </div>


                              <div>

                                <span>
                                  Registered
                                </span>

                                <strong>
                                  {formatDate(
                                    school?.createdAt
                                  )}
                                </strong>

                              </div>

                            </div>


                            <StatusBadge
                              isActive={
                                school?.isActive
                              }
                              status={
                                school?.status
                              }
                            />

                          </div>
                        );
                      }
                    )}

                  </div>

                </>

              )}

            </div>

          </section>


          {/* BOTTOM GRID */}

          <section className="sa-bottom-grid">


            {/* PLATFORM HEALTH */}

            <div className="sa-health-panel">

              <div className="sa-panel-heading">

                <div>

                  <span>
                    PLATFORM
                  </span>

                  <h3>
                    System Status
                  </h3>

                </div>

                <span className="sa-health-indicator">

                  <span />

                  {error
                    ? "Attention Required"
                    : "Operational"}

                </span>

              </div>


              <div className="sa-health-list">

                <div className="sa-health-row">

                  <div>
                    <CheckCircle2 size={18} />

                    <span>
                      School Data Service
                    </span>
                  </div>

                  <strong>
                    {error
                      ? "Unavailable"
                      : "Connected"}
                  </strong>

                </div>


                <div className="sa-health-row">

                  <div>
                    <ShieldCheck size={18} />

                    <span>
                      Authentication
                    </span>
                  </div>

                  <strong>
                    {user
                      ? "Active"
                      : "Inactive"}
                  </strong>

                </div>


                <div className="sa-health-row">

                  <div>
                    <Activity size={18} />

                    <span>
                      Platform Activity
                    </span>
                  </div>

                  <strong>
                    Available
                  </strong>

                </div>

              </div>

            </div>


            {/* QUICK ACTIONS */}

            <div className="sa-actions-panel">

              <div className="sa-panel-heading">

                <div>

                  <span>
                    QUICK ACCESS
                  </span>

                  <h3>
                    Platform Management
                  </h3>

                </div>

              </div>


              <div className="sa-management-grid">

                <button
                  className="sa-management-card"
                  type="button"
                  onClick={() =>
                    navigate("/schools")
                  }
                >

                  <div className="sa-management-icon">
                    <Building2 size={20} />
                  </div>

                  <div>

                    <strong>
                      Manage Schools
                    </strong>

                    <span>
                      View registered schools
                    </span>

                  </div>

                  <ChevronRight size={17} />

                </button>


                <button
                  className="sa-management-card"
                  type="button"
                  onClick={() =>
                    navigate(
                      "/superadmin/admins"
                    )
                  }
                >

                  <div className="sa-management-icon">
                    <UserCog size={20} />
                  </div>

                  <div>

                    <strong>
                      School Administrators
                    </strong>

                    <span>
                      Manage school admins
                    </span>

                  </div>

                  <ChevronRight size={17} />

                </button>


                <button
                  className="sa-management-card"
                  type="button"
                  onClick={() =>
                    navigate(
                      "/superadmin/admins"
                    )
                  }
                >

                  <div className="sa-management-icon">
                    <Users size={20} />
                  </div>

                  <div>

                    <strong>
                      Platform Users
                    </strong>

                    <span>
                      Manage system users
                    </span>

                  </div>

                  <ChevronRight size={17} />

                </button>


                <button
                  className="sa-management-card"
                  type="button"
                >

                  <div className="sa-management-icon">
                    <Activity size={20} />
                  </div>

                  <div>

                    <strong>
                      Platform Activity
                    </strong>

                    <span>
                      Review system activity
                    </span>

                  </div>

                  <ChevronRight size={17} />

                </button>

              </div>

            </div>

          </section>

        </main>

      </div>


      {/* ADD SCHOOL MODAL */}

      {showAddSchool && (

        <div
          className="sa-modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              setShowAddSchool(false);
            }

          }}
        >

          <div className="sa-modal">

            <div className="sa-modal-header">

              <div>

                <span>
                  PLATFORM ADMINISTRATION
                </span>

                <h2>
                  Add New School
                </h2>

                <p>
                  Register a school on the
                  EduNigeria platform.
                </p>

              </div>


              <button
                className="sa-modal-close"
                onClick={() =>
                  setShowAddSchool(false)
                }
                type="button"
              >
                <X size={20} />
              </button>

            </div>


            {createSchoolError && (

              <div className="sa-modal-error">

                <AlertCircle size={18} />

                {createSchoolError}

              </div>

            )}


            <form
              className="sa-school-form"
              onSubmit={handleCreateSchool}
            >

              <div className="sa-form-grid">


                <div className="sa-form-field sa-form-full">

                  <label>
                    School Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      schoolForm.name
                    }
                    onChange={
                      handleSchoolFormChange
                    }
                    placeholder="Enter school name"
                    required
                  />

                </div>


                <div className="sa-form-field">

                  <label>
                    School Type
                  </label>

                  <select
                    name="schoolType"
                    value={
                      schoolForm.schoolType
                    }
                    onChange={
                      handleSchoolFormChange
                    }
                    required
                  >

                    <option value="Primary">
                      Primary
                    </option>

                    <option value="Secondary">
                      Secondary
                    </option>

                    <option value="Primary & Secondary">
                      Primary & Secondary
                    </option>

                  </select>

                </div>


                <div className="sa-form-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      schoolForm.email
                    }
                    onChange={
                      handleSchoolFormChange
                    }
                    placeholder="school@example.com"
                    required
                  />

                </div>


                <div className="sa-form-field">

                  <label>
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={
                      schoolForm.phone
                    }
                    onChange={
                      handleSchoolFormChange
                    }
                    placeholder="School phone number"
                  />

                </div>


                <div className="sa-form-field">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={
                      schoolForm.city
                    }
                    onChange={
                      handleSchoolFormChange
                    }
                    placeholder="City"
                  />

                </div>


                <div className="sa-form-field">

                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={
                      schoolForm.state
                    }
                    onChange={
                      handleSchoolFormChange
                    }
                    placeholder="State"
                  />

                </div>


                <div className="sa-form-field sa-form-full">

                  <label>
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={
                      schoolForm.address
                    }
                    onChange={
                      handleSchoolFormChange
                    }
                    placeholder="School address"
                  />

                </div>


                <div className="sa-form-field">

                  <label>
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={
                      schoolForm.country
                    }
                    onChange={
                      handleSchoolFormChange
                    }
                    placeholder="Country"
                  />

                </div>

              </div>


              <div className="sa-modal-actions">

                <button
                  type="button"
                  className="sa-cancel-button"
                  onClick={() =>
                    setShowAddSchool(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="sa-primary-button"
                  disabled={creatingSchool}
                >

                  {creatingSchool ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="sa-spin"
                      />

                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />

                      Create School
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default SuperAdminDashboard;

