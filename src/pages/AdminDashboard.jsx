
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import {
  useAuth,
  getEffectiveRole,
} from "../context/AuthContext";

import { getAdminDashboardOverview } from "../api/admin.dashboard.api";

import {
  Users,
  UserCog,
  GraduationCap,
  Wallet,
  Clock3,
  CalendarCheck,
  Award,
  ClipboardCheck,
  Megaphone,
  Bell,
  FileText,
  UserPlus,
  BookOpen,
  ArrowUpRight,
  MoreHorizontal,
  ShieldOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UserRound,
} from "lucide-react";

import "./AdminDashboard.css";

/* =========================================================
   ROLE GUARD
========================================================= */

function RequireRole({ children }) {
  const { user } = useAuth();

  if (!user || getEffectiveRole(user) !== "admin") {
    return (
      <div className="admin-denied">
        <ShieldOff size={36} />

        <h2>Access Restricted</h2>

        <p>
          This dashboard is only available to school
          administrators.
        </p>
      </div>
    );
  }

  return children;
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  title,
  value,
  description,
  iconClass = "blue",
}) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-top">
        <div className={`admin-stat-icon ${iconClass}`}>
          <Icon size={21} />
        </div>

        <button
          type="button"
          className="admin-more-button"
          aria-label={`${title} options`}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="admin-stat-value">
        {value}
      </div>

      <div className="admin-stat-title">
        {title}
      </div>

      <div className="admin-stat-footer">
        <span className="admin-stat-description">
          {description}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      className="quick-action"
      onClick={onClick}
    >
      <div className="quick-action-icon">
        <Icon size={19} />
      </div>

      <div className="quick-action-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <ArrowUpRight
        size={17}
        className="quick-action-arrow"
      />
    </button>
  );
}

/* =========================================================
   PROGRESS BAR
========================================================= */

function ProgressBar({
  label,
  value,
  percentage,
}) {
  return (
    <div className="progress-item">
      <div className="progress-header">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(
              Math.max(Number(percentage) || 0,
              0),
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   ACTIVITY ITEM
========================================================= */

function ActivityItem({
  icon: Icon,
  title,
  description,
  time,
  type = "default",
}) {
  return (
    <div className="activity-item">
      <div className={`activity-icon ${type}`}>
        <Icon size={17} />
      </div>

      <div className="activity-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <time>{time}</time>
    </div>
  );
}

/* =========================================================
   ADMIN DASHBOARD BODY
========================================================= */

function AdminDashboardBody() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     SCHOOL
  ======================================================= */

  const schoolName =
    user?.school?.name ||
    user?.schoolName ||
    "My School";

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminDashboardOverview();

      /*
       * api.success() normally returns:
       *
       * {
       *   success: true,
       *   data: {...},
       *   message: "..."
       * }
       */

      const data = response?.data ?? response;

      setDashboard(data);
    } catch (err) {
      console.error(
        "Failed to load admin dashboard:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  /* =======================================================
     SAFE DASHBOARD DATA
  ======================================================= */

  const overview = dashboard?.overview || {};

  const students = dashboard?.students || {};

  const teachers = dashboard?.teachers || {};

  const staff = dashboard?.staff || {};

  const classes = dashboard?.classes || {};

  const parents = dashboard?.parents || {};

  const enrollment = dashboard?.enrollment || {};

  const attendance = dashboard?.attendance || {};

  const recentStudents =
    dashboard?.recentStudents || [];

  const recentEnrollments =
    dashboard?.recentEnrollments || [];

  /* =======================================================
     ATTENDANCE
  ======================================================= */

  const attendanceTotal =
    Number(attendance.present || 0) +
    Number(attendance.absent || 0) +
    Number(attendance.late || 0) +
    Number(attendance.excused || 0);

  const attendancePercentage = useMemo(() => {
    if (!attendanceTotal) return 0;

    return Math.round(
      ((Number(attendance.present || 0) +
        Number(attendance.late || 0)) /
        attendanceTotal) *
        100
    );
  }, [attendanceTotal, attendance.present, attendance.late]);

  /* =======================================================
     PAYMENT
  ======================================================= */

  const paidStudents =
    Number(students.payments?.paid || 0);

  const unpaidStudents =
    Number(students.payments?.unpaid || 0);

  const refundedStudents =
    Number(students.payments?.refunded || 0);

  const paymentTotal =
    paidStudents +
    unpaidStudents +
    refundedStudents;

  const feeCollectionPercentage =
    paymentTotal > 0
      ? Math.round(
          (paidStudents / paymentTotal) * 100
        )
      : 0;

  /* =======================================================
     ADMISSIONS
  ======================================================= */

  const pendingAdmissions =
    Number(
      students.registration?.initiated || 0
    ) +
    Number(
      students.registration?.incomplete || 0
    );

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading && !dashboard) {
    return (
      <div className="admin-dashboard">
       <Header
  title={schoolName}
  subtitle="Admin Dashboard"
/>

        <div className="admin-dashboard-loading">
          <RefreshCw
            size={28}
            className="admin-spin"
          />

          <h3>Loading dashboard...</h3>

          <p>
            We're getting your school's latest information.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (error && !dashboard) {
    return (
      <div className="admin-dashboard">
        <Header
          title="Admin Dashboard"
          subtitle={`Welcome back. Here's what's happening at ${schoolName}.`}
        />

        <div className="admin-dashboard-error">
          <AlertCircle size={32} />

          <h3>Unable to load dashboard</h3>

          <p>{error}</p>

          <button
            type="button"
            className="secondary-button"
            onClick={loadDashboardData}
          >
            <RefreshCw size={15} />

            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="admin-dashboard">

      {/* ===================================================
          HEADER
      =================================================== */}

      <Header
        title="Admin Dashboard"
        subtitle={`Welcome back. Here's what's happening at ${schoolName}.`}
      />

      <div className="admin-dashboard-content">

        {/* =================================================
            OVERVIEW
        ================================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">
            <div>
              <h2>Overview</h2>

              <p>
                A quick look at your school's current activity.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={loadDashboardData}
              disabled={loading}
            >
              <RefreshCw
                size={15}
                className={
                  loading
                    ? "admin-spin"
                    : ""
                }
              />

              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="admin-inline-error">
              <AlertCircle size={17} />

              <span>{error}</span>
            </div>
          )}

          <div className="admin-stats-grid">

            <StatCard
              icon={Users}
              title="Total Students"
              value={
                overview.students ?? 0
              }
              description="Students registered in your school"
              iconClass="blue"
            />

            <StatCard
              icon={GraduationCap}
              title="Teachers"
              value={
                overview.teachers ?? 0
              }
              description={`${teachers.active ?? 0} active teachers`}
              iconClass="green"
            />

            <StatCard
              icon={UserCog}
              title="Staff Members"
              value={
                overview.staff ?? 0
              }
              description={`${staff.active ?? 0} active staff`}
              iconClass="purple"
            />

            <StatCard
              icon={BookOpen}
              title="Classes"
              value={
                overview.classes ?? 0
              }
              description={`${classes.active ?? 0} active classes`}
              iconClass="orange"
            />

            <StatCard
              icon={UserRound}
              title="Parents"
              value={
                overview.parents ?? 0
              }
              description="Parents connected to students"
              iconClass="blue"
            />

            <StatCard
              icon={ClipboardCheck}
              title="Enrollments"
              value={
                enrollment.active ?? 0
              }
              description="Currently active enrollments"
              iconClass="green"
            />

          </div>

        </section>

        {/* =================================================
            FINANCE + ATTENDANCE
        ================================================= */}

        <section className="admin-two-column">

          {/* FINANCE */}

          <div className="admin-panel">

            <div className="panel-header">

              <div>
                <h3>Fee Overview</h3>

                <p>
                  Current student payment status
                </p>
              </div>

              <Wallet size={20} />

            </div>

            <div className="finance-summary">

              <div className="finance-main">

                <span>
                  Paid Students
                </span>

                <strong>
                  {paidStudents}
                </strong>

              </div>

              <div className="finance-divider" />

              <div className="finance-row">

                <div>

                  <span>
                    Unpaid
                  </span>

                  <strong>
                    {unpaidStudents}
                  </strong>

                </div>

                <Clock3 size={20} />

              </div>

            </div>

            <div className="collection-progress">

              <div className="progress-header">

                <span>
                  Payment Completion
                </span>

                <strong>
                  {feeCollectionPercentage}%
                </strong>

              </div>

              <div className="progress-track">

                <div
                  className="progress-fill finance"
                  style={{
                    width: `${feeCollectionPercentage}%`,
                  }}
                />

              </div>

              <p className="panel-small-text">
                {refundedStudents} refunded
              </p>

            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/finance")
              }
            >
              View Finance

              <ArrowUpRight size={15} />
            </button>

          </div>

          {/* ATTENDANCE */}

          <div className="admin-panel">

            <div className="panel-header">

              <div>
                <h3>Attendance Today</h3>

                <p>
                  Today's student attendance
                </p>
              </div>

              <CalendarCheck size={20} />

            </div>

            <div className="attendance-layout">

              <div
                className="attendance-circle"
                style={{
                  "--attendance":
                    `${attendancePercentage}%`,
                }}
              >

                <div>

                  <strong>
                    {attendancePercentage}%
                  </strong>

                  <span>
                    Present
                  </span>

                </div>

              </div>

              <div className="attendance-details">

                <div className="attendance-item">

                  <span>
                    <i className="attendance-dot present" />

                    Present
                  </span>

                  <strong>
                    {attendance.present ?? 0}
                  </strong>

                </div>

                <div className="attendance-item">

                  <span>
                    <i className="attendance-dot absent" />

                    Absent
                  </span>

                  <strong>
                    {attendance.absent ?? 0}
                  </strong>

                </div>

                <div className="attendance-item">

                  <span>
                    <i className="attendance-dot late" />

                    Late
                  </span>

                  <strong>
                    {attendance.late ?? 0}
                  </strong>

                </div>

                <div className="attendance-item">

                  <span>
                    <i className="attendance-dot excused" />

                    Excused
                  </span>

                  <strong>
                    {attendance.excused ?? 0}
                  </strong>

                </div>

              </div>

            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/attendance")
              }
            >
              View Attendance

              <ArrowUpRight size={15} />
            </button>

          </div>

        </section>

        {/* =================================================
            STUDENT STATUS
        ================================================= */}

        <section className="admin-panel">

          <div className="panel-header">

            <div>
              <h3>Student Status</h3>

              <p>
                Registration and verification overview
              </p>
            </div>

            <Users size={20} />

          </div>

          <div className="academic-grid">

            <div className="academic-card">

              <div className="academic-icon blue">
                <UserPlus size={21} />
              </div>

              <div>
                <span>
                  Completed Registration
                </span>

                <strong>
                  {students.registration?.complete ?? 0}
                </strong>
              </div>

            </div>

            <div className="academic-card">

              <div className="academic-icon green">
                <CheckCircle2 size={21} />
              </div>

              <div>
                <span>
                  Verified Students
                </span>

                <strong>
                  {students.registration?.verified ?? 0}
                </strong>
              </div>

            </div>

            <div className="academic-card">

              <div className="academic-icon orange">
                <AlertCircle size={21} />
              </div>

              <div>
                <span>
                  Pending Registration
                </span>

                <strong>
                  {pendingAdmissions}
                </strong>
              </div>

            </div>

            <div className="academic-card">

              <div className="academic-icon purple">
                <ClipboardCheck size={21} />
              </div>

              <div>
                <span>
                  Biometric Verified
                </span>

                <strong>
                  {students.biometric?.verified ?? 0}
                </strong>
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            ENROLLMENT + CLASSES
        ================================================= */}

        <section className="admin-two-column">

          {/* ENROLLMENT */}

          <div className="admin-panel">

            <div className="panel-header">

              <div>
                <h3>Enrollment Overview</h3>

                <p>
                  Current enrollment status
                </p>
              </div>

              <ClipboardCheck size={20} />

            </div>

            <div className="academic-grid">

              <div className="academic-card">

                <div className="academic-icon green">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <span>Active</span>

                  <strong>
                    {enrollment.active ?? 0}
                  </strong>
                </div>

              </div>

              <div className="academic-card">

                <div className="academic-icon blue">
                  <Award size={21} />
                </div>

                <div>
                  <span>Completed</span>

                  <strong>
                    {enrollment.completed ?? 0}
                  </strong>
                </div>

              </div>

              <div className="academic-card">

                <div className="academic-icon orange">
                  <ArrowUpRight size={21} />
                </div>

                <div>
                  <span>Transferred</span>

                  <strong>
                    {enrollment.transferred ?? 0}
                  </strong>
                </div>

              </div>

              <div className="academic-card">

                <div className="academic-icon purple">
                  <AlertCircle size={21} />
                </div>

                <div>
                  <span>Withdrawn</span>

                  <strong>
                    {enrollment.withdrawn ?? 0}
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* CLASS OVERVIEW */}

          <div className="admin-panel">

            <div className="panel-header">

              <div>
                <h3>Class Overview</h3>

                <p>
                  Students currently assigned to classes
                </p>
              </div>

              <BookOpen size={20} />

            </div>

            <div className="class-overview-list">

              {classes.studentsPerClass?.length ? (
                classes.studentsPerClass
                  .slice(0, 5)
                  .map((item) => (
                    <div
                      className="attendance-item"
                      key={item.classId}
                    >
                      <span>
                        {item.className || "Unnamed Class"}
                        {item.arm
                          ? ` - ${item.arm}`
                          : ""}
                      </span>

                      <strong>
                        {item.studentCount ?? 0}
                      </strong>
                    </div>
                  ))
              ) : (
                <div className="admin-empty-state">
                  <BookOpen size={24} />

                  <span>
                    No class enrollment data available.
                  </span>
                </div>
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            RECENT STUDENTS
        ================================================= */}

        <section className="admin-panel">

          <div className="panel-header">

            <div>
              <h3>Recent Students</h3>

              <p>
                Recently registered students
              </p>
            </div>

            <button
              type="button"
              className="panel-link"
              onClick={() =>
                navigate("/students")
              }
            >
              View All

              <ArrowUpRight size={15} />
            </button>

          </div>

          <div className="activity-list">

            {recentStudents.length > 0 ? (
              recentStudents.map((student) => (
                <ActivityItem
                  key={student._id}
                  icon={UserPlus}
                  title={
                    `${student.firstName || ""} ${
                      student.lastName || ""
                    }`.trim() ||
                    "Student"
                  }
                  description={
                    student.registrationNumber ||
                    student.registrationStatus ||
                    "Recently registered"
                  }
                  time={formatDate(student.createdAt)}
                  type="blue"
                />
              ))
            ) : (
              <div className="admin-empty-state">
                <Users size={24} />

                <span>
                  No students found.
                </span>
              </div>
            )}

          </div>

        </section>

        {/* =================================================
            RECENT ENROLLMENTS
        ================================================= */}

        <section className="admin-panel">

          <div className="panel-header">

            <div>
              <h3>Recent Enrollments</h3>

              <p>
                Latest student class enrollments
              </p>
            </div>

            <ClipboardCheck size={20} />

          </div>

          <div className="activity-list">

            {recentEnrollments.length > 0 ? (
              recentEnrollments.map((item) => (
                <ActivityItem
                  key={item._id}
                  icon={BookOpen}
                  title={
                    item.student
                      ? `${item.student.firstName || ""} ${
                          item.student.lastName || ""
                        }`.trim()
                      : "Student enrollment"
                  }
                  description={
                    item.class
                      ? `${item.class.name || "Class"}${
                          item.class.arm
                            ? ` - ${item.class.arm}`
                            : ""
                        }`
                      : "Class enrollment"
                  }
                  time={formatDate(
                    item.enrollmentDate ||
                      item.createdAt
                  )}
                  type="purple"
                />
              ))
            ) : (
              <div className="admin-empty-state">
                <ClipboardCheck size={24} />

                <span>
                  No recent enrollments found.
                </span>
              </div>
            )}

          </div>

        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <h2>Quick Actions</h2>

              <p>
                Common tasks you can access quickly.
              </p>
            </div>

          </div>

          <div className="quick-actions-grid">

            <QuickAction
              icon={UserPlus}
              title="Add Student"
              description="Register a new student"
              onClick={() =>
                navigate("/students")
              }
            />

            <QuickAction
              icon={UserCog}
              title="Manage Staff"
              description="View and manage staff"
              onClick={() =>
                navigate("/staff")
              }
            />

            <QuickAction
              icon={CalendarCheck}
              title="Attendance"
              description="Manage attendance"
              onClick={() =>
                navigate("/attendance")
              }
            />

            <QuickAction
              icon={Award}
              title="Results"
              description="Manage student results"
              onClick={() =>
                navigate("/results")
              }
            />

            <QuickAction
              icon={Megaphone}
              title="Announcement"
              description="Create an announcement"
              onClick={() =>
                navigate("/announcements")
              }
            />

            <QuickAction
              icon={Wallet}
              title="Finance"
              description="Manage school finances"
              onClick={() =>
                navigate("/finance")
              }
            />

          </div>

        </section>

        {/* =================================================
            SCHOOL PERFORMANCE
        ================================================= */}

        <section className="admin-panel">

          <div className="panel-header">

            <div>

              <h3>
                School Performance
              </h3>

              <p>
                Key indicators for your school.
              </p>

            </div>

            <MoreHorizontal size={18} />

          </div>

          <div className="performance-grid">

            <ProgressBar
              label="Attendance"
              value={`${attendancePercentage}%`}
              percentage={attendancePercentage}
            />

            <ProgressBar
              label="Fee Payment"
              value={`${feeCollectionPercentage}%`}
              percentage={feeCollectionPercentage}
            />

            <ProgressBar
              label="Enrollment"
              value={`${enrollment.active ?? 0}`}
              percentage={
                overview.students
                  ? Math.round(
                      ((enrollment.active || 0) /
                        overview.students) *
                        100
                    )
                  : 0
              }
            />

          </div>

        </section>

      </div>
    </div>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export default function AdminDashboard() {
  return (
    <RequireRole>
      <AdminDashboardBody />
    </RequireRole>
  );
}

