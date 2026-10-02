import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

import {
  GraduationCap,
  CalendarDays,
  Wallet,
  Trophy,
  ChevronRight,
  Clock3,
  Bell,
  MessageCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  getMyParentDashboard,
  getStudentsBySchool,
  linkChildToParent,
} from "../api/parent.api";
import "./ParentDashboard.css";

function ParentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [linkingChild, setLinkingChild] = useState(false);

  useEffect(() => {
    const loadParentDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyParentDashboard();

        console.log("PARENT DASHBOARD RESPONSE:", response);

        const parentDashboard = response?.dashboard || null;

        setDashboard(parentDashboard);

        // Load students from the parent's school
        const schoolId = parentDashboard?.parent?.school?._id;

        if (schoolId) {
          const studentsResponse = await getStudentsBySchool(schoolId);

          console.log("PARENT SCHOOL STUDENTS:", studentsResponse);

          setAvailableStudents(studentsResponse?.students || []);
        }
      } catch (err) {
        console.error("PARENT DASHBOARD ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load parent dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    loadParentDashboard();
  }, []);

  const parentName =
    dashboard?.parent?.firstName ||
    user?.firstName ||
    user?.fullName ||
    user?.name ||
    "Parent";

  const children = dashboard?.children || [];

  const getChildName = (child) => {
    const fullName = `${child?.firstName || ""} ${
      child?.lastName || ""
    }`.trim();

    return fullName || "Student";
  };

  const getChildClass = (child) => {
    if (typeof child?.class === "string") {
      return child.class;
    }

    if (child?.class?.name) {
      return child.class.name;
    }

    if (child?.className) {
      return child.className;
    }

    return "Class not assigned";
  };

  const getChildArm = (child) => {
    if (child?.class?.arm) {
      return child.class.arm;
    }

    if (child?.arm) {
      return child.arm;
    }

    return "";
  };

  const getChildInitials = (child) => {
    const name = getChildName(child);

    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="parent-dashboard">
        <div className="parent-loading">
          <div className="parent-loading-spinner" />
          <p>Loading parent dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="parent-dashboard">
        <div className="parent-error">
          <AlertCircle size={20} />
          <div>
            <strong>Unable to load dashboard</strong>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }
  const handleLinkStudent = async () => {
    if (!selectedStudentId) {
      alert("Please select your child.");
      return;
    }

    if (!dashboard?.parent?._id) {
      alert("Parent account information is missing.");
      return;
    }

    try {
      setLinkingChild(true);

      await linkChildToParent(dashboard.parent._id, selectedStudentId);

      alert("Student linked successfully.");

      // Reload dashboard so the child appears immediately
      const response = await getMyParentDashboard();

      setDashboard(response?.dashboard || null);

      setSelectedStudentId("");
    } catch (err) {
      console.error("LINK STUDENT ERROR:", err);

      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to link student",
      );
    } finally {
      setLinkingChild(false);
    }
  };

  return (
    <div className="parent-dashboard">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="parent-header">
        <div>
          <span className="parent-eyebrow">Parent Portal</span>

          <h1>Welcome back, {parentName.split(" ")[0]} 👋</h1>

          <p>
            Keep track of your children's academic progress, attendance and
            school activities.
          </p>
        </div>

        <div className="parent-header-actions">
          <button
            type="button"
            className="parent-icon-btn"
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="notification-dot" />
          </button>

          <button
            type="button"
            className="parent-icon-btn"
            onClick={() => navigate("/messages")}
            aria-label="Messages"
          >
            <MessageCircle size={19} />
          </button>
        </div>
      </div>

      {/* ==================================================
          OVERVIEW CARDS
      ================================================== */}

      <div className="parent-stat-grid">
        {/* CHILDREN */}

        <div className="parent-stat-card">
          <div className="parent-stat-icon green">
            <GraduationCap size={21} />
          </div>

          <div>
            <span>Children</span>

            <strong>{children.length}</strong>

            <small>Enrolled students</small>
          </div>
        </div>

        {/* ATTENDANCE */}

        <div className="parent-stat-card">
          <div className="parent-stat-icon blue">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>Attendance</span>

            <strong>—</strong>

            <small>Overall attendance</small>
          </div>
        </div>

        {/* FEES */}

        <div className="parent-stat-card">
          <div className="parent-stat-icon gold">
            <Wallet size={21} />
          </div>

          <div>
            <span>Fees</span>

            <strong>—</strong>

            <small>Outstanding balance</small>
          </div>
        </div>

        {/* AVERAGE */}

        <div className="parent-stat-card">
          <div className="parent-stat-icon purple">
            <Trophy size={21} />
          </div>

          <div>
            <span>Average Result</span>

            <strong>—</strong>

            <small>Latest term average</small>
          </div>
        </div>
      </div>

      {/* ==================================================
          CHILDREN
      ================================================== */}

      <section className="parent-section">
        <div className="parent-section-heading">
          <div>
            <span className="parent-section-label">My Children</span>

            <h2>Children overview</h2>
          </div>

          <button
            type="button"
            className="parent-view-btn"
            onClick={() => navigate("/students")}
          >
            View all
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="children-grid">
          {children.length === 0 ? (
            <div className="parent-link-child-card">
              <div className="parent-link-child-icon">
                <GraduationCap size={28} />
              </div>

              <div className="parent-link-child-content">
                <span className="parent-link-child-label">CHILD ACCOUNT</span>

                <h3>Link your child</h3>

                <p>
                  Select your child from the students registered at your school
                  to connect their academic information to your parent account.
                </p>

                {availableStudents.length > 0 ? (
                  <div className="parent-link-child-form">
                    <div className="parent-select-wrapper">
                      <label htmlFor="student-select">Select student</label>

                      <select
                        id="student-select"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        disabled={linkingChild}
                      >
                        <option value="">Choose your child</option>

                        {availableStudents.map((student) => (
                          <option key={student._id} value={student._id}>
                            {getChildName(student)}
                            {student.registrationNumber
                              ? ` — ${student.registrationNumber}`
                              : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      className="parent-link-child-btn"
                      onClick={handleLinkStudent}
                      disabled={linkingChild || !selectedStudentId}
                    >
                      {linkingChild ? (
                        <>
                          <span className="parent-button-spinner" />
                          Linking...
                        </>
                      ) : (
                        <>
                          Link Student
                          <ChevronRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="parent-no-students">
                    <AlertCircle size={17} />

                    <span>No students were found in your school.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            children.map((child) => {
              const childName = getChildName(child);
              const className = getChildClass(child);
              const arm = getChildArm(child);

              return (
                <div className="child-card" key={child._id || child.id}>
                  <div className="child-card-top">
                    <div className="child-avatar">
                      {getChildInitials(child)}
                    </div>

                    <div className="child-info">
                      <h3>{childName}</h3>

                      <p>
                        {className}

                        {arm && <> · Arm {arm}</>}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="child-arrow"
                      onClick={() => navigate("/students")}
                      aria-label={`View ${childName}`}
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>

                  <div className="child-progress-row">
                    <div>
                      <span>Attendance</span>
                      <strong>—</strong>
                    </div>

                    <div>
                      <span>Average</span>
                      <strong>—</strong>
                    </div>
                  </div>

                  <div className="child-progress">
                    <div style={{ width: "0%" }} />
                  </div>

                  <div className="child-status">
                    <CheckCircle2 size={14} />
                    Linked student
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ==================================================
          RESULTS + ATTENDANCE
      ================================================== */}

      <div className="parent-main-grid">
        {/* RESULTS */}

        <section className="parent-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">Academic Performance</span>

              <h2>Latest results</h2>
            </div>

            <button
              type="button"
              className="panel-link"
              onClick={() => navigate("/results")}
            >
              Results
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="parent-empty-state">
            <FileText size={30} />

            <h3>Results will appear here</h3>

            <p>
              Student results will be connected to the parent dashboard next.
            </p>
          </div>
        </section>

        {/* ATTENDANCE */}

        <section className="parent-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">Attendance</span>

              <h2>This term</h2>
            </div>

            <CalendarDays size={19} />
          </div>

          <div className="attendance-summary">
            <div className="attendance-circle">
              <div>
                <strong>—</strong>
                <span>Present</span>
              </div>
            </div>

            <div className="attendance-details">
              <div>
                <span className="attendance-dot present" />
                <p>Present</p>
                <strong>—</strong>
              </div>

              <div>
                <span className="attendance-dot late" />
                <p>Late</p>
                <strong>—</strong>
              </div>

              <div>
                <span className="attendance-dot absent" />
                <p>Absent</p>
                <strong>—</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ==================================================
          FEES + ANNOUNCEMENTS
      ================================================== */}

      <div className="parent-main-grid">
        {/* FEES */}

        <section className="parent-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">School Fees</span>

              <h2>Payment status</h2>
            </div>

            <Wallet size={19} />
          </div>

          <div className="parent-empty-state">
            <Wallet size={30} />

            <h3>Fee information</h3>

            <p>Your children's fee information will be connected here.</p>

            <button
              type="button"
              className="fee-button"
              onClick={() => navigate("/finance")}
            >
              View fee details
              <ChevronRight size={15} />
            </button>
          </div>
        </section>

        {/* ANNOUNCEMENTS */}

        <section className="parent-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">School Updates</span>

              <h2>Announcements</h2>
            </div>

            <Bell size={19} />
          </div>

          <div className="parent-empty-state">
            <Bell size={30} />

            <h3>No announcements yet</h3>

            <p>School announcements will appear here when available.</p>
          </div>
        </section>
      </div>

      {/* ==================================================
          MESSAGES
      ================================================== */}

      <section className="parent-panel messages-panel">
        <div className="panel-heading">
          <div>
            <span className="panel-label">Communication</span>

            <h2>Recent messages</h2>
          </div>

          <button
            type="button"
            className="panel-link"
            onClick={() => navigate("/messages")}
          >
            View messages
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="parent-empty-state">
          <MessageCircle size={30} />

          <h3>No recent messages</h3>

          <p>Messages from teachers and the school will appear here.</p>
        </div>
      </section>
    </div>
  );
}

export default ParentDashboard;
