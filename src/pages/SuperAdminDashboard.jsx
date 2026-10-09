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
RefreshCw,
School,
Search,
Settings,
ShieldCheck,
Users,
UserCog,
X,
XCircle,
} from "lucide-react";
import "./SuperAdminDashboard.css";
import { useAuth } from "../context/authcontext";
import {
  getSchools,
  getSchoolApplications,
  getPlatformOverview,
  approveSchool,
  rejectSchool,
  setupSchoolAdminCredentials,
} from "../api/school.api";
// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({ isActive, status }) {
const normalizedStatus = String(status || "").toLowerCase();

const active = isActive === true && normalizedStatus !== "rejected";
const pending = normalizedStatus === "pending";
const rejected = normalizedStatus === "rejected";

const label = rejected
? "Rejected"
: pending
? "Pending"
: active
? "Approved"
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
{active ? ( <CheckCircle2 size={13} />
) : rejected ? ( <XCircle size={13} />
) : ( <Clock3 size={13} />
)}
{label} </span>
);
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({ title, value, icon: Icon, description }) {
return ( <div className="sa-stat-card"> <div className="sa-stat-top"> <div className="sa-stat-icon"> <Icon size={21} /> </div> <span className="sa-stat-arrow"> <ChevronRight size={18} /> </span> </div>

```
  <div className="sa-stat-value">{value}</div>
  <div className="sa-stat-title">{title}</div>

  {description && (
    <div className="sa-stat-description">{description}</div>
  )}
</div>


);
}

// =========================================================
// SUPER ADMIN DASHBOARD
// =========================================================

function SuperAdminDashboard() {
const { user, logout } = useAuth();
const navigate = useNavigate();

const [schools, setSchools] = useState([]);
const [platformSummary, setPlatformSummary] = useState({});
const [overviewLoading, setOverviewLoading] = useState(true);
const [overviewError, setOverviewError] = useState("");
const [pendingApplications, setPendingApplications] = useState([]);

const [loading, setLoading] = useState(true);
const [applicationsLoading, setApplicationsLoading] = useState(true);

const [error, setError] = useState("");
const [applicationsError, setApplicationsError] = useState("");

const [searchTerm, setSearchTerm] = useState("");
const [showAllSchools, setShowAllSchools] = useState(false);
const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

const [processingSchoolId, setProcessingSchoolId] = useState(null);
const [reviewSchool, setReviewSchool] = useState(null);
const [credentialsSchool, setCredentialsSchool] = useState(null);

const [adminFullName, setAdminFullName] = useState("");
const [adminEmail, setAdminEmail] = useState("");
const [adminPassword, setAdminPassword] = useState("");
const [credentialsLoading, setCredentialsLoading] = useState(false);

/// =========================================================
// LOAD SCHOOLS AND THEIR STATISTICS
// =========================================================

const loadSchools = async () => {
  try {
    setLoading(true);
    setOverviewLoading(true);
    setError("");
    setOverviewError("");

    const [schoolsResponse, overviewResponse] = await Promise.allSettled([
      getSchools(),
      getPlatformOverview(),
    ]);

    // Load the regular school list.
    if (schoolsResponse.status === "fulfilled") {
      const response = schoolsResponse.value;

      const schoolData = Array.isArray(response?.schools)
        ? response.schools
        : Array.isArray(response?.data?.schools)
          ? response.data.schools
          : Array.isArray(response?.data?.data?.schools)
            ? response.data.data.schools
            : Array.isArray(response?.data)
              ? response.data
              : [];

      setSchools(schoolData);
    } else {
      throw schoolsResponse.reason;
    }

    // Load platform-wide and individual school statistics.
    if (overviewResponse.status === "fulfilled") {
      const response = overviewResponse.value;

      const overview =
        response?.overview ||
        response?.data?.overview ||
        response?.data?.data?.overview ||
        {};

      const overviewSchools = Array.isArray(overview.schools)
        ? overview.schools
        : [];

      setPlatformSummary(overview.summary || {});

      // Include each school's statistics in the dashboard.
      if (overviewSchools.length > 0 || schoolsResponse.status === "fulfilled") {
        setSchools(overviewSchools.length > 0 ? overviewSchools : (
          Array.isArray(schoolsResponse.value?.schools)
            ? schoolsResponse.value.schools
            : Array.isArray(schoolsResponse.value?.data?.schools)
              ? schoolsResponse.value.data.schools
              : Array.isArray(schoolsResponse.value?.data?.data?.schools)
                ? schoolsResponse.value.data.data.schools
                : Array.isArray(schoolsResponse.value?.data)
                  ? schoolsResponse.value.data
                  : []
        ));
      }
    } else {
      console.error(
        "FAILED TO LOAD PLATFORM OVERVIEW:",
        overviewResponse.reason
      );

      setOverviewError(
        overviewResponse.reason?.response?.data?.message ||
          overviewResponse.reason?.message ||
          "Could not load detailed school statistics."
      );
    }
  } catch (err) {
    console.error("FAILED TO LOAD SCHOOLS:", err);

    setError(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to load schools."
    );
  } finally {
    setLoading(false);
    setOverviewLoading(false);
  }
};
// =========================================================
// LOAD PENDING APPLICATIONS
// =========================================================

const loadPendingApplications = async () => {
try {
setApplicationsLoading(true);
setApplicationsError("");


  const response = await getSchoolApplications();

  const applications = Array.isArray(response?.schools)
    ? response.schools
    : Array.isArray(response?.data?.schools)
      ? response.data.schools
      : Array.isArray(response?.data)
        ? response.data
        : [];

  setPendingApplications(applications);
} catch (err) {
  console.error("FAILED TO LOAD SCHOOL APPLICATIONS:", err);

  setApplicationsError(
    err?.response?.data?.message ||
      err?.message ||
      "Failed to load school applications."
  );
} finally {
  setApplicationsLoading(false);
}


};

const loadDashboardData = async () => {
await Promise.all([
loadSchools(),
loadPendingApplications(),
]);
};

useEffect(() => {
loadDashboardData();
}, []);

// =========================================================
// STATISTICS
// =========================================================

const totalSchools = schools.length;

const activeSchools = schools.filter(
(school) =>
school?.isActive === true &&
String(school?.status || "").toLowerCase() !== "rejected"
).length;

const pendingSchools = schools.filter(
(school) =>
String(school?.status || "").toLowerCase() === "pending"
).length;

const primarySchools = schools.filter(
(school) => school?.schoolType === "Primary"
).length;

const secondarySchools = schools.filter(
(school) => school?.schoolType === "Secondary"
).length;

const combinedSchools = schools.filter(
(school) => school?.schoolType === "Primary & Secondary"
).length;

// =========================================================
// RECENT AND FILTERED SCHOOLS
// =========================================================

const recentSchools = useMemo(() => {
return [...schools]
.sort(
(a, b) =>
new Date(b?.createdAt || 0) -
new Date(a?.createdAt || 0)
)
.slice(0, 5);
}, [schools]);

const filteredSchools = useMemo(() => {
const term = searchTerm.trim().toLowerCase();


const source = showAllSchools || term
  ? schools
  : recentSchools;

if (!term) {
  return source;
}

return source.filter((school) => {
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
      String(value).toLowerCase().includes(term)
    );
});


}, [schools, recentSchools, searchTerm, showAllSchools]);

// =========================================================
// ADMIN DETAILS
// =========================================================

const adminName =
user?.fullName || user?.name || "Super Admin";

const adminInitial = adminName.charAt(0).toUpperCase();

// =========================================================
// NAVIGATION
// =========================================================

const openSchools = () => navigate("/schools");
const openUsers = () => navigate("/superadmin/users");

const closeMobileSidebar = () => {
setMobileSidebarOpen(false);
};

// =========================================================
// APPROVE SCHOOL
// =========================================================

const handleApproveSchool = async (school) => {
const schoolId = school?._id || school?.id;


if (!schoolId) {
  alert("School ID is missing.");
  return;
}

try {
  setProcessingSchoolId(schoolId);

  await approveSchool(schoolId);

  setReviewSchool(null);

  await loadDashboardData();

  alert(
    "School approved successfully. You can now create its Admin login."
  );
} catch (err) {
  console.error("FAILED TO APPROVE SCHOOL:", err);

  alert(
    err?.response?.data?.message ||
      err?.message ||
      "Failed to approve school."
  );
} finally {
  setProcessingSchoolId(null);
}


};

// =========================================================
// REJECT SCHOOL
// =========================================================

const handleRejectSchool = async (school) => {
const schoolId = school?._id || school?.id;


if (!schoolId) {
  alert("School ID is missing.");
  return;
}

if (!window.confirm(
  `Are you sure you want to reject ${school?.name || "this school"}?`
)) {
  return;
}

try {
  setProcessingSchoolId(schoolId);

  await rejectSchool(schoolId);

  setReviewSchool(null);

  await loadDashboardData();

  alert("School application rejected.");
} catch (err) {
  console.error("FAILED TO REJECT SCHOOL:", err);

  alert(
    err?.response?.data?.message ||
      err?.message ||
      "Failed to reject school."
  );
} finally {
  setProcessingSchoolId(null);
}


};

// =========================================================
// OPEN ADMIN CREDENTIALS FORM
// =========================================================

const openCredentialsForm = (school) => {
const status = String(school?.status || "").toLowerCase();


if (status !== "approved" || school?.isActive !== true) {
  alert("Approve and activate this school before creating its Admin login.");
  return;
}

setCredentialsSchool(school);
setAdminFullName("");
setAdminEmail("");
setAdminPassword("");


};

// =========================================================
// CREATE ADMIN CREDENTIALS
// =========================================================

const handleSetupCredentials = async (event) => {
event.preventDefault();


if (!credentialsSchool) {
  return;
}

const schoolId =
  credentialsSchool?._id || credentialsSchool?.id;

const normalizedEmail = adminEmail.trim().toLowerCase();

if (!schoolId) {
  alert("School ID is missing.");
  return;
}

if (!adminFullName.trim()) {
  alert("Administrator name is required.");
  return;
}

if (!normalizedEmail) {
  alert("Administrator email is required.");
  return;
}

if (adminPassword.length < 8) {
  alert("Password must contain at least 8 characters.");
  return;
}

try {
  setCredentialsLoading(true);

  await setupSchoolAdminCredentials(schoolId, {
    fullName: adminFullName.trim(),
    email: normalizedEmail,
    password: adminPassword,
  });

  alert(
    `Admin account created successfully.\n\nSchool: ${credentialsSchool.name}\nAdmin email: ${normalizedEmail}\n\nKeep the password secure and share it only with the administrator.`
  );

  setCredentialsSchool(null);
  setAdminFullName("");
  setAdminEmail("");
  setAdminPassword("");

  await loadDashboardData();
} catch (err) {
  console.error("FAILED TO SET ADMIN CREDENTIALS:", err);

  alert(
    err?.response?.data?.message ||
      err?.message ||
      "Failed to create Admin credentials. Check the backend service."
  );
} finally {
  setCredentialsLoading(false);
}


};

// =========================================================
// DATE
// =========================================================

const formatDate = (date) => {
if (!date) {
return "—";
}


const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
  return "—";
}

return parsedDate.toLocaleDateString("en-NG", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});


};

const handleLogout = () => {
logout();
};

// =========================================================
// SCHOOL TABLE ROW
// =========================================================

const renderSchoolRow = (school, showReview = false) => {
const schoolId = school?._id || school?.id;
const status = String(school?.status || "").toLowerCase();
const approvedAndActive =
status === "approved" && school?.isActive === true;


return (
  <tr key={schoolId} className="sa-school-row">
    <td>
      <div className="sa-school-name-cell">
        <div className="sa-school-logo">
          <Building2 size={18} />
        </div>
        <div>
          <strong>{school?.name || "Unnamed School"}</strong>
          <span>{school?.email || "No email"}</span>
        </div>
      </div>
    </td>

    <td>
      <span className="sa-location">
        {[school?.city, school?.state]
          .filter(Boolean)
          .join(", ") || "—"}
      </span>
    </td>

    <td>
      <span className="sa-type-pill">
        {school?.schoolType || "—"}
      </span>
    </td>

    <td>
  <div className="sa-school-statistics">
    <span>
      <strong>{school?.statistics?.students ?? 0}</strong> Students
    </span>

    <span>
      <strong>{school?.statistics?.teachers ?? 0}</strong> Teachers
    </span>

    <span>
      <strong>{school?.statistics?.staff ?? 0}</strong> Staff
    </span>

    <span>
      <strong>{school?.statistics?.parents ?? 0}</strong> Parents
    </span>

    <span>
      <strong>{school?.statistics?.admins ?? 0}</strong> Admins
    </span>

    <span>
      <strong>{school?.statistics?.classes ?? 0}</strong> Classes
    </span>
  </div>
</td>

    <td>{formatDate(school?.createdAt)}</td>

    <td>
      <StatusBadge
        isActive={school?.isActive}
        status={school?.status}
      />
    </td>

    <td>
      {approvedAndActive ? (
        <button
          type="button"
          className="sa-secondary-button"
          onClick={(event) => {
            event.stopPropagation();
            openCredentialsForm(school);
          }}
        >
          <UserCog size={16} />
          Set Up Admin Login
        </button>
      ) : (
        <span>
          {status === "pending"
            ? "Awaiting approval"
            : "School must be approved and active"}
        </span>
      )}
    </td>

    {showReview && (
      <td>
        <button
          type="button"
          className="sa-secondary-button"
          onClick={() => setReviewSchool(school)}
        >
          Review
          <ChevronRight size={16} />
        </button>
      </td>
    )}
  </tr>
);


};

// =========================================================
// DASHBOARD
// =========================================================

return ( <div className="super-admin-dashboard">
{mobileSidebarOpen && ( <div
       className="sa-sidebar-overlay"
       onClick={closeMobileSidebar}
     />
)}

```
  <aside
    className={`sa-sidebar ${
      mobileSidebarOpen ? "sa-sidebar-open" : ""
    }`}
  >
    <div className="sa-sidebar-brand">
      <div className="sa-brand-logo">
        <GraduationCap size={27} />
      </div>

      <div>
        <div className="sa-brand-name">EduNigeria</div>
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

    <div className="sa-sidebar-section">
      <span className="sa-sidebar-label">MAIN MENU</span>

      <nav className="sa-sidebar-nav">
        <NavLink
          to="/super-admin"
          end
          className={({ isActive }) =>
            `sa-nav-item ${isActive ? "sa-nav-active" : ""}`
          }
          onClick={closeMobileSidebar}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/schools"
          className={({ isActive }) =>
            `sa-nav-item ${isActive ? "sa-nav-active" : ""}`
          }
          onClick={closeMobileSidebar}
        >
          <Building2 size={19} />
          <span>Schools</span>
        </NavLink>

        <button
          className="sa-nav-item"
          type="button"
          onClick={() => {
            closeMobileSidebar();
            openUsers();
          }}
        >
          <Users size={19} />
          <span>Users</span>
        </button>

        <button
          className="sa-nav-item"
          type="button"
          onClick={() => navigate("/reports")}
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

    <div className="sa-sidebar-section sa-sidebar-system">
      <span className="sa-sidebar-label">SYSTEM</span>

      <nav className="sa-sidebar-nav">
        <button
          className="sa-nav-item"
          type="button"
          onClick={() => navigate("/settings")}
        >
          <Settings size={19} />
          <span>Settings</span>
        </button>
      </nav>
    </div>

    <div className="sa-sidebar-bottom">
      <div className="sa-sidebar-user">
        <div className="sa-sidebar-avatar">{adminInitial}</div>

        <div className="sa-sidebar-user-info">
          <strong>{adminName}</strong>
          <span>Super Administrator</span>
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

  <div className="sa-main-wrapper">
    <header className="sa-topbar dashboard-topbar">
      <div className="sa-topbar-left">
        <button
          className="sa-mobile-menu"
          onClick={() => setMobileSidebarOpen(true)}
          type="button"
        >
          <Menu size={22} />
        </button>

        <div>
          <span className="sa-topbar-label">
            PLATFORM ADMINISTRATION
          </span>
          <h1>Super Admin Dashboard</h1>
        </div>
      </div>

      <div className="sa-topbar-right">
        <div className="sa-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <button
          className="sa-icon-button"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="sa-notification-dot" />
        </button>

        <div className="sa-topbar-profile">
          <div className="sa-topbar-avatar">{adminInitial}</div>
          <div className="sa-topbar-profile-info">
            <strong>{adminName}</strong>
            <span>Super Admin</span>
          </div>
        </div>
      </div>
    </header>

    <main className="sa-main-content">
      <section className="sa-page-intro">
        <div>
          <span className="sa-page-eyebrow">OVERVIEW</span>
          <h2>Welcome back, {adminName.split(" ")[0]}.</h2>
          <p>
            Monitor schools, review registration applications,
            and create school administrator accounts.
          </p>
        </div>

        <div className="sa-page-actions">
          <button
            className="sa-secondary-button"
            onClick={loadDashboardData}
            disabled={loading || applicationsLoading}
            type="button"
          >
            <RefreshCw
              size={17}
              className={
                loading || applicationsLoading ? "sa-spin" : ""
              }
            />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="sa-error-box">
          <AlertCircle size={19} />
          <div>
            <strong>Unable to load schools</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <section className="sa-stat-grid">
        <StatCard
          title="Total Schools"
          value={loading ? "—" : totalSchools}
          icon={Building2}
          description="Registered on EduNigeria"
        />

        <StatCard
          title="Active Schools"
          value={loading ? "—" : activeSchools}
          icon={CheckCircle2}
          description="Approved and active"
        />

        <StatCard
          title="Pending Schools"
          value={loading ? "—" : pendingSchools}
          icon={Clock3}
          description="Awaiting review"
        />

        <button
          type="button"
          className="sa-stat-card sa-stat-card-button"
          onClick={openUsers}
        >
          <div className="sa-stat-top">
            <div className="sa-stat-icon">
              <Users size={21} />
            </div>
            <span className="sa-stat-arrow">
              <ChevronRight size={18} />
            </span>
          </div>
          <div className="sa-stat-value">—</div>
          <div className="sa-stat-title">Platform Users</div>
          <div className="sa-stat-description">
            User management
          </div>
        </button>
      </section>

      {/* PENDING APPLICATIONS */}

      <section className="sa-section">
        <div className="sa-section-heading">
          <div>
            <span>SCHOOL REGISTRATION</span>
            <h3>Pending Applications</h3>
          </div>
          <span className="sa-text-button">
            {pendingApplications.length} Pending
          </span>
        </div>

        <div className="sa-school-panel">
          {applicationsError ? (
            <div className="sa-empty-state">
              <AlertCircle size={28} />
              <strong>Unable to load applications</strong>
              <span>{applicationsError}</span>
            </div>
          ) : applicationsLoading ? (
            <div className="sa-empty-state">
              <RefreshCw size={25} className="sa-spin" />
              <span>Loading applications...</span>
            </div>
          ) : pendingApplications.length === 0 ? (
            <div className="sa-empty-state">
              <CheckCircle2 size={28} />
              <strong>No pending applications</strong>
              <span>
                There are no school applications waiting for review.
              </span>
            </div>
          ) : (
            <>
              <div className="sa-table-wrapper">
                <table className="sa-school-table">
                  <thead>
                    <tr>
                      <th>School</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>School Statistics</th>
                      <th>Registered</th>
                      <th>Status</th>
                      <th>Admin Account</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApplications.map((school) =>
                      renderSchoolRow(school, true)
                    )}
                  </tbody>
                </table>
              </div>

              <div className="sa-mobile-school-list">
                {pendingApplications.map((school) => (
                  <div
                    className="sa-mobile-school-card"
                    key={school?._id || school?.id}
                  >
                    <div className="sa-mobile-school-top">
                      <div className="sa-school-logo">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <strong>{school?.name || "Unnamed School"}</strong>
                        <span>{school?.email || "No email"}</span>
                      </div>
                    </div>

                    <div className="sa-mobile-school-details">
                      <div>
                        <span>Location</span>
                        <strong>
                          {[school?.city, school?.state]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </strong>
                      </div>
                      <div>
                        <span>Type</span>
                        <strong>{school?.schoolType || "—"}</strong>
                      </div>
                      <div>
                        <span>Registered</span>
                        <strong>{formatDate(school?.createdAt)}</strong>
                      </div>
                    </div>

                    <StatusBadge
                      isActive={school?.isActive}
                      status={school?.status}
                    />

                    {String(school?.status || "").toLowerCase() ===
                      "approved" && school?.isActive === true && (
                      <button
                        type="button"
                        className="sa-secondary-button"
                        onClick={() => openCredentialsForm(school)}
                      >
                        <UserCog size={16} />
                        Set Up Admin Login
                      </button>
                    )}

                    <button
                      type="button"
                      className="sa-secondary-button"
                      onClick={() => setReviewSchool(school)}
                    >
                      Review Application
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* PLATFORM-WIDE STATISTICS */}
<section className="sa-section">
  <div className="sa-section-heading">
    <div>
      <span>PLATFORM OVERVIEW</span>
      <h3>School Community Statistics</h3>
    </div>
  </div>

  {overviewError && (
    <div className="sa-error-box">
      <AlertCircle size={19} />
      <div>
        <strong>Unable to load detailed statistics</strong>
        <p>{overviewError}</p>
      </div>
    </div>
  )}

  <div className="sa-stat-grid">
    <StatCard
      title="Total Students"
      value={
        overviewLoading
          ? "—"
          : platformSummary.totalStudents ?? 0
      }
      icon={GraduationCap}
      description="Across all registered schools"
    />

    <StatCard
      title="Total Teachers"
      value={
        overviewLoading
          ? "—"
          : platformSummary.totalTeachers ?? 0
      }
      icon={Users}
      description="Across all registered schools"
    />

    <StatCard
      title="Total Staff"
      value={
        overviewLoading
          ? "—"
          : platformSummary.totalStaff ?? 0
      }
      icon={UserCog}
      description="School staff members"
    />

    <StatCard
      title="Total Parents"
      value={
        overviewLoading
          ? "—"
          : platformSummary.totalParents ?? 0
      }
      icon={Users}
      description="Registered parent accounts"
    />

    <StatCard
      title="School Administrators"
      value={
        overviewLoading
          ? "—"
          : platformSummary.totalAdmins ?? 0
      }
      icon={ShieldCheck}
      description="School admin accounts"
    />

    <StatCard
      title="Total Bursars"
      value={
        overviewLoading
          ? "—"
          : platformSummary.totalBursars ?? 0
      }
      icon={Users}
      description="School bursar accounts"
    />

    <StatCard
      title="Total Classes"
      value={
        overviewLoading
          ? "—"
          : platformSummary.totalClasses ?? 0
      }
      icon={School}
      description="Across all registered schools"
    />

    <StatCard
      title="Attendance Records"
      value={
        overviewLoading
          ? "—"
          : platformSummary.totalAttendanceRecords ?? 0
      }
      icon={FileBarChart}
      description="Recorded attendance entries"
    />
  </div>
</section>

      {/* SCHOOL BREAKDOWN */}

      <section className="sa-section">
        <div className="sa-section-heading">
          <div>
            <span>REGISTRATION BREAKDOWN</span>
            <h3>Schools by Type</h3>
          </div>
        </div>

        <div className="sa-breakdown-grid">
          <div className="sa-breakdown-card">
            <div className="sa-breakdown-icon">
              <GraduationCap size={21} />
            </div>
            <div>
              <strong>{primarySchools}</strong>
              <span>Primary Schools</span>
            </div>
          </div>

          <div className="sa-breakdown-card">
            <div className="sa-breakdown-icon">
              <School size={21} />
            </div>
            <div>
              <strong>{secondarySchools}</strong>
              <span>Secondary Schools</span>
            </div>
          </div>

          <div className="sa-breakdown-card">
            <div className="sa-breakdown-icon">
              <Building2 size={21} />
            </div>
            <div>
              <strong>{combinedSchools}</strong>
              <span>Primary &amp; Secondary</span>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTERED SCHOOLS */}

      <section className="sa-section">
        <div className="sa-section-heading">
          <div>
            <span>REGISTERED SCHOOLS</span>
            <h3>
              {showAllSchools || searchTerm
                ? "All Schools"
                : "Recent Schools"}
            </h3>
          </div>

          <button
            className="sa-text-button"
            onClick={() => setShowAllSchools((value) => !value)}
            type="button"
          >
            {showAllSchools ? "Show Recent" : "View All"}
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="sa-school-panel">
          {loading ? (
            <div className="sa-empty-state">
              <RefreshCw size={25} className="sa-spin" />
              <span>Loading schools...</span>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="sa-empty-state">
              <Building2 size={28} />
              <strong>No schools found</strong>
              <span>Try another search.</span>
            </div>
          ) : (
            <>
              <div className="sa-table-wrapper">
                <table className="sa-school-table">
                  <thead>
                    <tr>
                      <th>School</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Registered</th>
                      <th>Status</th>
                      <th>Admin Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchools.map((school) =>
                      renderSchoolRow(school)
                    )}
                  </tbody>
                </table>
              </div>

              <div className="sa-mobile-school-list">
                {filteredSchools.map((school) => (
                  <div
                    className="sa-mobile-school-card"
                    key={school?._id || school?.id}
                  >
                    <div className="sa-mobile-school-top">
                      <div className="sa-school-logo">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <strong>{school?.name || "Unnamed School"}</strong>
                        <span>{school?.email || "No email"}</span>
                      </div>
                    </div>

                    <div className="sa-mobile-school-details">
                      <div>
                        <span>Location</span>
                        <strong>
                          {[school?.city, school?.state]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </strong>
                      </div>
                      <div>
                        <span>Type</span>
                        <strong>{school?.schoolType || "—"}</strong>
                      </div>
                      <div>
                        <span>Registered</span>
                        <strong>{formatDate(school?.createdAt)}</strong>
                      </div>
                    </div>

                    <StatusBadge
                      isActive={school?.isActive}
                      status={school?.status}
                    />

                    {String(school?.status || "").toLowerCase() ===
                      "approved" && school?.isActive === true && (
                      <button
                        type="button"
                        className="sa-secondary-button"
                        onClick={() => openCredentialsForm(school)}
                      >
                        <UserCog size={16} />
                        Set Up Admin Login
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* BOTTOM GRID */}

      <section className="sa-bottom-grid">
        <div className="sa-health-panel">
          <div className="sa-panel-heading">
            <div>
              <span>PLATFORM</span>
              <h3>System Status</h3>
            </div>

            <span className="sa-health-indicator">
              <span />
              {error ? "Attention Required" : "Operational"}
            </span>
          </div>

          <div className="sa-health-list">
            <div className="sa-health-row">
              <div>
                <CheckCircle2 size={18} />
                <span>School Data Service</span>
              </div>
              <strong>{error ? "Unavailable" : "Connected"}</strong>
            </div>

            <div className="sa-health-row">
              <div>
                <ShieldCheck size={18} />
                <span>Authentication</span>
              </div>
              <strong>{user ? "Active" : "Inactive"}</strong>
            </div>

            <div className="sa-health-row">
              <div>
                <Activity size={18} />
                <span>Platform Activity</span>
              </div>
              <strong>Available</strong>
            </div>
          </div>
        </div>

        <div className="sa-actions-panel">
          <div className="sa-panel-heading">
            <div>
              <span>QUICK ACCESS</span>
              <h3>Platform Management</h3>
            </div>
          </div>

          <div className="sa-management-grid">
            <button
              className="sa-management-card"
              type="button"
              onClick={openSchools}
            >
              <div className="sa-management-icon">
                <Building2 size={20} />
              </div>
              <div>
                <strong>Manage Schools</strong>
                <span>View registered schools</span>
              </div>
              <ChevronRight size={17} />
            </button>

            <button
              className="sa-management-card"
              type="button"
              onClick={openUsers}
            >
              <div className="sa-management-icon">
                <UserCog size={20} />
              </div>
              <div>
                <strong>School Administrators</strong>
                <span>Manage school admins</span>
              </div>
              <ChevronRight size={17} />
            </button>

            <button
              className="sa-management-card"
              type="button"
              onClick={openUsers}
            >
              <div className="sa-management-icon">
                <Users size={20} />
              </div>
              <div>
                <strong>Platform Users</strong>
                <span>Manage system users</span>
              </div>
              <ChevronRight size={17} />
            </button>

            <button
              className="sa-management-card"
              type="button"
              onClick={() => navigate("/reports")}
            >
              <div className="sa-management-icon">
                <Activity size={20} />
              </div>
              <div>
                <strong>Platform Activity</strong>
                <span>Review system activity</span>
              </div>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>

  {/* REVIEW APPLICATION MODAL */}

  {reviewSchool && (
    <div
      className="sa-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setReviewSchool(null);
        }
      }}
    >
      <div className="sa-modal">
        <div className="sa-modal-header">
          <div>
            <span>SCHOOL REGISTRATION</span>
            <h2>Review Application</h2>
            <p>
              Review the school information before approving or
              rejecting the application.
            </p>
          </div>

          <button
            className="sa-modal-close"
            onClick={() => setReviewSchool(null)}
            type="button"
            aria-label="Close review"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sa-review-details">
          <div className="sa-review-item">
            <span>School Name</span>
            <strong>{reviewSchool.name || "—"}</strong>
          </div>
          <div className="sa-review-item">
            <span>School Type</span>
            <strong>{reviewSchool.schoolType || "—"}</strong>
          </div>
          <div className="sa-review-item">
            <span>School Email</span>
            <strong>{reviewSchool.email || "—"}</strong>
          </div>
          <div className="sa-review-item">
            <span>Phone</span>
            <strong>{reviewSchool.phone || "—"}</strong>
          </div>
          <div className="sa-review-item">
            <span>Address</span>
            <strong>{reviewSchool.address || "—"}</strong>
          </div>
          <div className="sa-review-item">
            <span>City</span>
            <strong>{reviewSchool.city || "—"}</strong>
          </div>
          <div className="sa-review-item">
            <span>State</span>
            <strong>{reviewSchool.state || "—"}</strong>
          </div>
          <div className="sa-review-item">
            <span>Country</span>
            <strong>{reviewSchool.country || "Nigeria"}</strong>
          </div>
          <div className="sa-review-item">
            <span>Application Date</span>
            <strong>{formatDate(reviewSchool.createdAt)}</strong>
          </div>
          <div className="sa-review-item">
            <span>Status</span>
            <StatusBadge
              isActive={reviewSchool.isActive}
              status={reviewSchool.status}
            />
          </div>
        </div>

        <div className="sa-modal-actions">
          <button
            type="button"
            className="sa-cancel-button"
            onClick={() => setReviewSchool(null)}
            disabled={processingSchoolId !== null}
          >
            Close
          </button>

          {String(reviewSchool.status || "").toLowerCase() ===
            "pending" && (
            <>
              <button
                type="button"
                className="sa-cancel-button"
                onClick={() => handleRejectSchool(reviewSchool)}
                disabled={processingSchoolId !== null}
              >
                {processingSchoolId ===
                (reviewSchool._id || reviewSchool.id)
                  ? "Processing..."
                  : "Reject"}
              </button>

              <button
                type="button"
                className="sa-primary-button"
                onClick={() => handleApproveSchool(reviewSchool)}
                disabled={processingSchoolId !== null}
              >
                {processingSchoolId ===
                (reviewSchool._id || reviewSchool.id)
                  ? "Processing..."
                  : "Approve School"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )}

  {/* CREATE ADMIN CREDENTIALS MODAL */}

  {credentialsSchool && (
    <div
      className="sa-modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !credentialsLoading
        ) {
          setCredentialsSchool(null);
        }
      }}
    >
      <div className="sa-modal">
        <div className="sa-modal-header">
          <div>
            <span>SCHOOL ADMINISTRATION</span>
            <h2>Create Admin Login</h2>
            <p>
              Create a separate administrator account for this school.
            </p>
          </div>

          <button
            className="sa-modal-close"
            onClick={() => setCredentialsSchool(null)}
            type="button"
            disabled={credentialsLoading}
            aria-label="Close credentials form"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sa-review-details">
          <div className="sa-review-item">
            <span>School</span>
            <strong>{credentialsSchool.name || "—"}</strong>
          </div>
          <div className="sa-review-item">
            <span>Registered School Email</span>
            <strong>{credentialsSchool.email || "—"}</strong>
          </div>
        </div>

        <form onSubmit={handleSetupCredentials}>
          <div
            style={{
              display: "grid",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <div>
              <label
                htmlFor="adminFullName"
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: 600,
                }}
              >
                Administrator Full Name
              </label>

              <input
                id="adminFullName"
                type="text"
                value={adminFullName}
                onChange={(event) =>
                  setAdminFullName(event.target.value)
                }
                placeholder="Enter administrator's full name"
                autoComplete="name"
                required
                disabled={credentialsLoading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="adminEmail"
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: 600,
                }}
              >
                Admin Login Email
              </label>

              <input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(event) =>
                  setAdminEmail(event.target.value)
                }
                placeholder="Enter a separate admin email"
                autoComplete="email"
                required
                disabled={credentialsLoading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
              />

              <small style={{ display: "block", marginTop: "6px" }}>
                Use an email address that is different from the school's
                registration email.
              </small>
            </div>

            <div>
              <label
                htmlFor="adminPassword"
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: 600,
                }}
              >
                Admin Login Password
              </label>

              <input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(event) =>
                  setAdminPassword(event.target.value)
                }
                placeholder="Create a strong password"
                autoComplete="new-password"
                minLength={8}
                required
                disabled={credentialsLoading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
              />

              <small style={{ display: "block", marginTop: "6px" }}>
                Use at least 8 characters. Do not reuse the SuperAdmin
                password.
              </small>
            </div>
          </div>

          <div className="sa-modal-actions">
            <button
              type="button"
              className="sa-cancel-button"
              onClick={() => setCredentialsSchool(null)}
              disabled={credentialsLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="sa-primary-button"
              disabled={credentialsLoading}
            >
              {credentialsLoading ? (
                <>
                  <RefreshCw size={17} className="sa-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <ShieldCheck size={17} />
                  Create Admin Account
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
