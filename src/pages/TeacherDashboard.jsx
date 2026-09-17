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
  Clock,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { teacherApi } from "../api/teacher.api";

import "./TeacherDashboard.css";

export default function TeacherDashboard() {
  const { user } = useAuth();

  const [teacher, setTeacher] = useState(user || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD TEACHER
  // =========================================================

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        setLoading(true);
        setError("");

        if (!user?._id) {
          setLoading(false);
          return;
        }

        const response = await teacherApi.getTeacher(user._id);

        console.log("TEACHER RESPONSE:", response);

        if (response?.teacher) {
          setTeacher(response.teacher);
        }
      } catch (err) {
        console.error("TEACHER DASHBOARD ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load teacher information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTeacher();
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
    teacher?.school?.name ||
    user?.school?.name ||
    "EduNigeria School";

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
  // PLACEHOLDER DATA
  // =========================================================
  // These will later be replaced with backend data.

  const stats = [
    {
      title: "My Students",
      value: "—",
      icon: Users,
      className: "blue",
    },
    {
      title: "Subjects",
      value: "—",
      icon: BookOpen,
      className: "green",
    },
    {
      title: "Today's Classes",
      value: "—",
      icon: Calendar,
      className: "orange",
    },
    {
      title: "Attendance",
      value: "—",
      icon: CheckCircle,
      className: "purple",
    },
  ];

  const classes = [];

  const timetable = [];

  const activities = [];

  // =========================================================
  // QUICK ACTIONS
  // =========================================================

  const actions = [
    {
      title: "Mark Attendance",
      description: "Record today's attendance",
      icon: ClipboardCheck,
    },
    {
      title: "Enter Scores",
      description: "Add student results",
      icon: FileText,
    },
    {
      title: "Assignments",
      description: "Create or manage assignments",
      icon: BookOpen,
    },
    {
      title: "Lesson Notes",
      description: "Manage your lesson notes",
      icon: Calendar,
    },
  ];

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="teacher-dashboard">

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
              Welcome back,{" "}
              <span>{teacherName}</span>
            </h1>

            <p>
              Manage your classes, students, attendance and
              academic activities from one place.
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
                <div
                  key={stat.title}
                  className="teacher-stat-card"
                >
                  <div
                    className={`teacher-stat-icon ${stat.className}`}
                  >
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

            {/* ===============================================
                MY CLASSES
            =============================================== */}

            <div className="teacher-panel">

              <div className="teacher-panel-header">
                <div>
                  <h2>My Classes</h2>
                  <p>Classes assigned to you</p>
                </div>

                <button className="teacher-panel-link">
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
                    Your assigned classes will appear here
                    once they are available.
                  </p>
                </div>
              ) : (
                <div className="teacher-classes-list">
                  {classes.map((item) => (
                    <div
                      key={item.id}
                      className="teacher-class-item"
                    >
                      <div className="teacher-class-icon">
                        <BookOpen size={20} />
                      </div>

                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.subject}</p>
                      </div>

                      <span>
                        {item.students} Students
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* ===============================================
                TODAY'S TIMETABLE
            =============================================== */}

            <div className="teacher-panel">

              <div className="teacher-panel-header">
                <div>
                  <h2>Today's Timetable</h2>
                  <p>Your classes for today</p>
                </div>

                <Calendar size={20} />
              </div>

              {timetable.length === 0 ? (
                <div className="teacher-empty-state">
                  <div className="teacher-empty-icon">
                    <Clock size={25} />
                  </div>

                  <h3>No timetable available</h3>

                  <p>
                    Your timetable will appear here when
                    it has been configured.
                  </p>
                </div>
              ) : (
                <div className="teacher-timetable-list">
                  {timetable.map((item) => (
                    <div
                      key={item.id}
                      className="teacher-timetable-item"
                    >
                      <div className="teacher-time">
                        {item.time}
                      </div>

                      <div>
                        <h3>{item.subject}</h3>
                        <p>{item.className}</p>
                      </div>

                      <span>{item.room}</span>
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

            {/* ===============================================
                RECENT ACTIVITIES
            =============================================== */}

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

                  <p>
                    Your recent activities will appear here.
                  </p>
                </div>
              ) : (
                <div className="teacher-activities-list">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="teacher-activity-item"
                    >
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

            {/* ===============================================
                QUICK ACTIONS
            =============================================== */}

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
                    >
                      <div className="teacher-action-icon">
                        <Icon size={20} />
                      </div>

                      <div>
                        <strong>{action.title}</strong>
                        <span>{action.description}</span>
                      </div>

                      <ArrowRight
                        size={17}
                        className="teacher-action-arrow"
                      />
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