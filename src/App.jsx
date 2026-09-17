
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import { PERMISSIONS } from "./config/permissions";

import Layout from "./components/Layout";

// =========================================================
// PUBLIC PAGES
// =========================================================

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EntranceExam from "./pages/EntranceExam";
import CareerApplication from "./pages/CareerApplication";
import TeachingOpportunities from "./pages/TeachingOpportunities";

// =========================================================
// DASHBOARDS
// =========================================================

import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import CounsellorDashboard from "./pages/CounsellorDashboard";
import BursarDashboard from "./pages/BursarDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";

// =========================================================
// SCHOOL MODULES
// =========================================================

import Students, {
  StudentProfile,
} from "./pages/Students";

import SchoolsPage from "./pages/SchoolsPage";
import Staff from "./pages/Staff";
import Teacher from "./pages/Teacher";
import Counsellor from "./pages/Counsellor";
import Academics from "./pages/Academics";
import Attendance from "./pages/Attendance";
import Timetable from "./pages/Timetable";
import Finance from "./pages/Finance";
import Communications from "./pages/Communications";
import Reports from "./pages/Reports";
import Results from "./pages/Results";
import Assignments from "./pages/Assignments";
import Announcements from "./pages/Announcements";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

// =========================================================
// SUPER ADMIN
// =========================================================

import SuperAdminDashboard from "./pages/SuperAdminDashboard";

// =========================================================
// PROTECTED ROUTE
// =========================================================

function ProtectedRoute({ children }) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="route-loading">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

// =========================================================
// ROLE ROUTE
// =========================================================

function RoleRoute({
  allowed,
  children,
}) {
  const {
    user,
    loading,
    canAccess,
    getRedirectPath,
  } = useAuth();

  if (loading) {
    return (
      <div className="route-loading">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!canAccess(allowed)) {
    return (
      <Navigate
        to={getRedirectPath(user)}
        replace
      />
    );
  }

  return children;
}

// =========================================================
// GUEST ROUTE
// =========================================================

function GuestRoute({
  children,
}) {
  const {
    user,
    loading,
    getRedirectPath,
  } = useAuth();

  if (loading) {
    return (
      <div className="route-loading">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <Navigate
        to={getRedirectPath(user)}
        replace
      />
    );
  }

  return children;
}

// =========================================================
// APPLICATION ROUTES
// =========================================================

function AppRoutes() {
  return (
    <Routes>

      {/* ===================================================
          PUBLIC ROUTES
      =================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/entrance"
        element={<EntranceExam />}
      />

      <Route
        path="/careers/apply"
        element={<CareerApplication />}
      />

      <Route
        path="/careers/teaching"
        element={<TeachingOpportunities />}
      />

      {/* ===================================================
          AUTH
      =================================================== */}

      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      {/* ===================================================
          SUPER ADMIN
      =================================================== */}

      <Route
        path="/super-admin"
        element={
          <RoleRoute allowed={["super_admin"]}>
            <SuperAdminDashboard />
          </RoleRoute>
        }
      />

      {/* ===================================================
          SUPER ADMIN SCHOOLS
      =================================================== */}

      <Route
        path="/schools"
        element={
          <RoleRoute allowed={["super_admin"]}>
            <SchoolsPage />
          </RoleRoute>
        }
      />

      {/* ===================================================
          SUPER ADMIN ADMINS
          Kept for existing project compatibility.
      =================================================== */}

      <Route
        path="/superadmin/admins"
        element={
          <RoleRoute allowed={["super_admin"]}>
            <SuperAdminDashboard />
          </RoleRoute>
        }
      />

      {/* ===================================================
          RESULTS
      =================================================== */}

      <Route
        path="/results"
        element={
          <RoleRoute allowed={PERMISSIONS.results}>
            <Results />
          </RoleRoute>
        }
      />

      {/* ===================================================
          ASSIGNMENTS
      =================================================== */}

      <Route
        path="/assignments"
        element={
          <RoleRoute allowed={PERMISSIONS.assignments}>
            <Assignments />
          </RoleRoute>
        }
      />

      {/* ===================================================
          ANNOUNCEMENTS
      =================================================== */}

      <Route
        path="/announcements"
        element={
          <RoleRoute allowed={PERMISSIONS.announcements}>
            <Announcements />
          </RoleRoute>
        }
      />

      {/* ===================================================
          NOTIFICATIONS
      =================================================== */}

      <Route
        path="/notifications"
        element={
          <RoleRoute allowed={PERMISSIONS.notifications}>
            <Notifications />
          </RoleRoute>
        }
      />

      {/* ===================================================
          SETTINGS
      =================================================== */}

      <Route
        path="/settings"
        element={
          <RoleRoute allowed={PERMISSIONS.settings}>
            <Settings />
          </RoleRoute>
        }
      />

      {/* ===================================================
          PROFILE
      =================================================== */}

      <Route
        path="/profile"
        element={
          <RoleRoute allowed={PERMISSIONS.profile}>
            <Profile />
          </RoleRoute>
        }
      />

      {/* ===================================================
          PROTECTED APPLICATION
      =================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >

        {/* =================================================
            ADMIN DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <RoleRoute allowed={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* =================================================
            STAFF DASHBOARD
        ================================================= */}

        <Route
          path="/Sdashboard"
          element={
            <RoleRoute allowed={["staff"]}>
              <StaffDashboard />
            </RoleRoute>
          }
        />

        {/* =================================================
            COUNSELLOR DASHBOARD
        ================================================= */}

        <Route
          path="/Cdashboard"
          element={
            <RoleRoute allowed={["counsellor"]}>
              <CounsellorDashboard />
            </RoleRoute>
          }
        />

        {/* =================================================
            TEACHER DASHBOARD
        ================================================= */}

        <Route
          path="/Tdashboard"
          element={
            <RoleRoute allowed={["teacher"]}>
              <TeacherDashboard />
            </RoleRoute>
          }
        />

        {/* =================================================
            BURSAR DASHBOARD
        ================================================= */}

        <Route
          path="/Bdashboard"
          element={
            <RoleRoute allowed={["bursar"]}>
              <BursarDashboard />
            </RoleRoute>
          }
        />

        {/* =================================================
            STUDENT DASHBOARD
        ================================================= */}

        <Route
          path="/Stdashboard"
          element={
            <RoleRoute allowed={["student"]}>
              <StudentDashboard />
            </RoleRoute>
          }
        />

        {/* =================================================
            PARENT DASHBOARD
        ================================================= */}

        <Route
          path="/Pdashboard"
          element={
            <RoleRoute allowed={["parent"]}>
              <ParentDashboard />
            </RoleRoute>
          }
        />

        {/* =================================================
            STUDENTS
        ================================================= */}

        <Route
          path="/students"
          element={
            <RoleRoute allowed={PERMISSIONS.students}>
              <Students />
            </RoleRoute>
          }
        />

        <Route
          path="/students/:id"
          element={
            <RoleRoute allowed={PERMISSIONS.students}>
              <StudentProfile />
            </RoleRoute>
          }
        />

        {/* =================================================
            STAFF
        ================================================= */}

        <Route
          path="/staff"
          element={
            <RoleRoute allowed={PERMISSIONS.staff}>
              <Staff />
            </RoleRoute>
          }
        />

        {/* =================================================
            TEACHERS
        ================================================= */}

        <Route
          path="/teachers"
          element={
            <RoleRoute allowed={PERMISSIONS.teachers}>
              <Teacher />
            </RoleRoute>
          }
        />

        {/* =================================================
            ACADEMICS
        ================================================= */}

        <Route
          path="/academics"
          element={
            <RoleRoute allowed={PERMISSIONS.academics}>
              <Academics />
            </RoleRoute>
          }
        />

        {/* =================================================
            ATTENDANCE
        ================================================= */}

        <Route
          path="/attendance"
          element={
            <RoleRoute allowed={PERMISSIONS.attendance}>
              <Attendance />
            </RoleRoute>
          }
        />

        {/* =================================================
            TIMETABLE
        ================================================= */}

        <Route
          path="/timetable"
          element={
            <RoleRoute allowed={PERMISSIONS.timetable}>
              <Timetable />
            </RoleRoute>
          }
        />

        {/* =================================================
            FINANCE
        ================================================= */}

        <Route
          path="/finance"
          element={
            <RoleRoute allowed={PERMISSIONS.finance}>
              <Finance />
            </RoleRoute>
          }
        />

        {/* =================================================
            COUNSELLING
        ================================================= */}

        <Route
          path="/counselling"
          element={
            <RoleRoute allowed={PERMISSIONS.counselling}>
              <Counsellor />
            </RoleRoute>
          }
        />

        {/* =================================================
            COMMUNICATIONS
        ================================================= */}

        <Route
          path="/communications"
          element={
            <RoleRoute allowed={PERMISSIONS.communications}>
              <Communications />
            </RoleRoute>
          }
        />

        {/* =================================================
            REPORTS
        ================================================= */}

        <Route
          path="/reports"
          element={
            <RoleRoute allowed={PERMISSIONS.reports}>
              <Reports />
            </RoleRoute>
          }
        />

        {/* =================================================
            TEACHING OPPORTUNITIES
        ================================================= */}

        <Route
          path="/opportunities"
          element={
            <RoleRoute allowed={["admin", "staff"]}>
              <TeachingOpportunities />
            </RoleRoute>
          }
        />

      </Route>

      {/* ===================================================
          CATCH ALL
      =================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

// =========================================================
// APP
// =========================================================

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

