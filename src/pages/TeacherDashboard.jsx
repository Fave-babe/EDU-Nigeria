import React, { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardCheck,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { teacherApi } from "../api/teacher.api";
import Header from "../components/Header";
import "./TeacherDashboard.css";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [teacher, setTeacher] = useState(user || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  // =========================================================
  // LOAD TEACHER DASHBOARD
  // =========================================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await teacherApi.getDashboard();

        console.log(
          "TEACHER DASHBOARD RESPONSE:",
          JSON.stringify(response, null, 2),
        );

        setTeacher(response?.teacher || user || null);
        setDashboard(response || null);
      } catch (err) {
        console.error("Teacher dashboard error:", err);

        setError(
          err?.response?.data?.message || "Failed to load teacher dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  // =========================================================
  // TEACHER NAME
  // =========================================================

  const teacherName =
    teacher?.fullName ||
    `${teacher?.firstName || ""} ${teacher?.lastName || ""}`.trim() ||
    "Teacher";

  // =========================================================
  // SCHOOL NAME
  // =========================================================

  const schoolName =
    teacher?.school?.name || user?.school?.name || "EduNigeria School";

  // =========================================================
  // CURRENT DATE
  // =========================================================

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // =========================================================
  // DASHBOARD DATA
  // =========================================================

  const stats = [
    {
      title: "My Students",
      value: dashboard?.stats?.students ?? 0,
      icon: Users,
      className: "blue",
    },
    {
      title: "Subjects",
      value: dashboard?.stats?.subjects ?? 0,
      icon: BookOpen,
      className: "green",
    },
    {
      title: "Today's Classes",
      value: dashboard?.stats?.todayClasses ?? 0,
      icon: Calendar,
      className: "orange",
    },
    {
      title: "Attendance",
      value: dashboard?.attendance?.total ?? 0,
      icon: ClipboardCheck,
      className: "purple",
    },
  ];

  const classes = dashboard?.classes || [];
  const timetable = dashboard?.todayTimetable || [];

  // =========================================================
  // RECENT ACTIVITIES
  // =========================================================

  const activities = [];

  // =========================================================
  // QUICK ACTIONS
  // =========================================================

  const actions = [
    {
      title: "Mark Attendance",
      description: "Record today's attendance",
      icon: ClipboardCheck,
      path: "/Tattendance",
    },
    {
      title: "Enter Scores",
      description: "Add student results",
      icon: FileText,
      path: "/results",
    },
    {
      title: "Assignments",
      description: "Create or manage assignments",
      icon: BookOpen,
      path: "/assignments",
    },
    {
      title: "Lesson Notes",
      description: "Manage your lesson notes",
      icon: Calendar,
      path: "/lesson-notes",
    },
  ];

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="teacher-dashboard">
      <Header title="Teacher Dashboard" subtitle={schoolName} />
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <section className="teacher-hero">
        <div className="teacher-hero-content">
          <div className="teacher-hero-text">
            <div className="teacher-welcome-badge">
              <GraduationCap size={16} />
              Teacher Portal
            </div>

            <h1>
              Welcome back, <span>{teacherName}</span>
            </h1>

            <p>
              Manage your classes, students, attendance and academic activities
              from one place.
            </p>

            <div className="teacher-date">
              <Calendar size={17} />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="teacher-profile-summary">
            <div className="teacher-avatar">
              {teacherName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3>{teacherName}</h3>

              <p>{teacher?.email || "No email available"}</p>

              <span>{schoolName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="teacher-dashboard-error">
          <AlertCircle size={20} />

          <div>
            <strong>Unable to load teacher information</strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="teacher-dashboard-loading">
          <div className="teacher-loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      ) : (
        <div className="teacher-dashboard-content">
          {/* =================================================
              STATISTICS
          ================================================= */}

          <section className="teacher-stats">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div key={stat.title} className="teacher-stat-card">
                  <div className={`teacher-stat-icon ${stat.className}`}>
                    <Icon size={22} />
                  </div>

                  <div className="teacher-stat-info">
                    <p>{stat.title}</p>
                    <h2>{stat.value}</h2>
                  </div>
                </div>
              );
            })}
          </section>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <section className="teacher-main-grid">
            {/* =================================================
                MY CLASSES
            ================================================= */}

            <div className="teacher-panel">
              <div className="teacher-panel-header">
                <div>
                  <h2>My Classes</h2>
                  <p>Classes assigned to you</p>
                </div>

                <button
                  className="teacher-panel-link"
                  onClick={() => navigate("/Tstudents")}
                >
                  View All
                  <ArrowRight size={16} />
                </button>
              </div>

              {classes.length === 0 ? (
                <div className="teacher-empty-state">
                  <div className="teacher-empty-icon">
                    <Users size={25} />
                  </div>

                  <h3>No classes assigned yet</h3>

                  <p>
                    Your assigned classes will appear here once they are
                    available.
                  </p>
                </div>
              ) : (
                <div className="teacher-classes-list">
                  {classes.map((item) => (
                    <div key={item.id} className="teacher-class-item">
                      <div className="teacher-class-icon">
                        <BookOpen size={20} />
                      </div>

                      <div>
                        <h3>{item.name}</h3>

                        <p>
                          {item.level} • Arm {item.arm}
                        </p>
                      </div>

                      <span>{item.students} Students</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* =================================================
                TODAY'S TIMETABLE
            ================================================= */}

            <div className="teacher-panel">
              <div className="teacher-panel-header">
                <div>
                  <h2>Today's Timetable</h2>
                  <p>Your classes for today</p>
                </div>

                <Calendar size={20} />
              </div>

              {timetable.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={24} />
                  <p>No classes scheduled for today.</p>
                </div>
              ) : (
                <div className="timetable-list">
                  {timetable.map((item) => (
                    <div className="timetable-item" key={item._id}>
                      <div>
                        <strong>{item.subject?.name || "Subject"}</strong>

                        <p>
                          {item.class?.name || "Class"}

                          {item.class?.arm ? ` • Arm ${item.class.arm}` : ""}
                        </p>
                      </div>

                      <div>
                        <strong>
                          {item.startTime} - {item.endTime}
                        </strong>

                        {item.room && <p>{item.room}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              BOTTOM GRID
          ================================================= */}

          <section className="teacher-bottom-grid">
            {/* =================================================
                RECENT ACTIVITIES
            ================================================= */}

            <div className="teacher-panel">
              <div className="teacher-panel-header">
                <div>
                  <h2>Recent Activities</h2>
                  <p>Your latest academic activities</p>
                </div>
              </div>

              {activities.length === 0 ? (
                <div className="teacher-empty-state compact">
                  <div className="teacher-empty-icon">
                    <CheckCircle size={23} />
                  </div>

                  <h3>No recent activities</h3>

                  <p>Your recent activities will appear here.</p>
                </div>
              ) : (
                <div className="teacher-activities-list">
                  {activities.map((activity) => (
                    <div key={activity.id} className="teacher-activity-item">
                      <div className="teacher-activity-dot"></div>

                      <div>
                        <p>{activity.title}</p>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="teacher-panel">
              <div className="teacher-panel-header">
                <div>
                  <h2>Quick Actions</h2>
                  <p>Common teacher activities</p>
                </div>
              </div>

              <div className="teacher-actions-grid">
                {actions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.title}
                      className="teacher-action-btn"
                      onClick={() => navigate(action.path)}
                    >
                      <div className="teacher-action-icon">
                        <Icon size={20} />
                      </div>

                      <div>
                        <strong>{action.title}</strong>
                        <span>{action.description}</span>
                      </div>

                      <ArrowRight size={17} className="teacher-action-arrow" />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
