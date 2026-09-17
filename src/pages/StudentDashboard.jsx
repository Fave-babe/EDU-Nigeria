
import React, { useEffect, useMemo, useState } from "react";

import {
  Bell,
  CalendarDays,
  ClipboardList,
  FileText,
  WalletCards,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  GraduationCap,
  BarChart3,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getStudentAcademicInfo } from "../api/enrollement.api";
import { getMyStudentProfile } from "../api/student.api";

import "./StudentDashboard.css";

// =========================================================
// DEMO ACADEMIC DATA
// =========================================================

const subjects = [
  {
    code: "MTH",
    name: "Mathematics",
    instructor: "Mr. Okonkwo",
    grade: "A",
    score: 88,
    color: "orange",
  },
  {
    code: "ENG",
    name: "English Language & Lit.",
    instructor: "Ms. Adeyemi",
    grade: "B+",
    score: 79,
    color: "green",
  },
  {
    code: "PHY",
    name: "Physics",
    instructor: "Mr. Mensah",
    grade: "A-",
    score: 85,
    color: "blue",
  },
  {
    code: "CHM",
    name: "Chemistry",
    instructor: "Mrs. Asante",
    grade: "B",
    score: 74,
    color: "purple",
  },
  {
    code: "BIO",
    name: "Biology",
    instructor: "Mrs. Nwosu",
    grade: "A",
    score: 90,
    color: "red",
  },
  {
    code: "SST",
    name: "Social Studies",
    instructor: "Mr. Bello",
    grade: "B+",
    score: 78,
    color: "teal",
  },
];

// =========================================================
// TIMETABLE
// =========================================================

const timetable = [
  {
    time: "7:30 AM – 8:20 AM",
    code: "MTH",
    subject: "Mathematics",
    teacher: "Mr. Okonkwo",
    room: "Room 12",
    color: "orange",
  },
  {
    time: "8:25 AM – 9:15 AM",
    code: "ENG",
    subject: "English Language",
    teacher: "Ms. Adeyemi",
    room: "Room 8",
    color: "green",
  },
  {
    time: "10:00 AM – 10:50 AM",
    code: "PHY",
    subject: "Physics",
    teacher: "Mr. Mensah",
    room: "Lab 2",
    color: "blue",
  },
];

// =========================================================
// ASSIGNMENTS
// =========================================================

const assignments = [
  {
    month: "AUG",
    day: "26",
    title: "Exercise 7 — Quadratic Equations",
    subject: "Mathematics",
    code: "MTH",
    color: "orange",
  },
  {
    month: "AUG",
    day: "27",
    title: "Comprehension Passage & Summary",
    subject: "English",
    code: "ENG",
    color: "green",
  },
  {
    month: "AUG",
    day: "29",
    title: "Lab Report: Motion on an Incline",
    subject: "Physics",
    code: "PHY",
    color: "blue",
  },
];

// =========================================================
// ANNOUNCEMENTS
// =========================================================

const announcements = [
  {
    title: "School resumes next week",
    date: "August 20, 2026",
    source: "Admin",
    color: "green",
  },
  {
    title: "Science Fair registration is open",
    date: "August 18, 2026",
    source: "Science Department",
    color: "blue",
  },
  {
    title: "New library resources available",
    date: "August 15, 2026",
    source: "Librarian",
    color: "orange",
  },
];

// =========================================================
// HELPERS
// =========================================================

function getUserName(user) {
  if (!user) return "Student";

  return (
    user.fullName ||
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    "Student"
  );
}

function getFirstName(user) {
  return getUserName(user).split(" ")[0] || "Student";
}

function getInitials(name) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "ST"
  );
}

// =========================================================
// SUBJECT CODE
// =========================================================

function SubjectCode({ code, color }) {
  return (
    <span className={`subject-code subject-${color}`}>
      {code}
    </span>
  );
}

// =========================================================
// GRADE BADGE
// =========================================================

function GradeBadge({ grade, color }) {
  return (
    <span className={`grade-badge grade-${color}`}>
      {grade}
    </span>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
}) {
  return (
    <div className="student-stat-card">
      <div className={`stat-icon stat-${color}`}>
        <Icon size={23} />
      </div>

      <div className="stat-content">
        <span className="stat-title">
          {title}
        </span>

        <strong>{value}</strong>

        <span className="stat-subtitle">
          {subtitle}
        </span>
      </div>

      <ChevronRight
        size={17}
        className="stat-arrow"
      />
    </div>
  );
}

// =========================================================
// ACADEMIC RESULTS
// =========================================================

function AcademicResults({ student, subjects }) {
  const studentClass =
    student?.formLevel ||
    student?.className ||
    student?.class ||
    "Form 3";

  const track =
    student?.track ||
    student?.department ||
    "Science";

  return (
    <section className="dashboard-card results-card">
      <div className="card-header">
        <div>
          <h2>Academic Results</h2>

          <p>
            Your academic performance for the
            current term.
          </p>
        </div>

        <button className="view-all-btn">
          View Results
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="term-info">
        <div>
          <span>CLASS</span>
          <strong>{studentClass}</strong>
        </div>

        <div>
          <span>TRACK</span>
          <strong>{track}</strong>
        </div>

        <div>
          <span>TERM</span>
          <strong>Term 1 - 2026</strong>
        </div>
      </div>

      <div className="results-table">
        <div className="results-table-header">
          <span>SUBJECT</span>
          <span>INSTRUCTOR</span>
          <span>GRADE</span>
          <span>SCORE</span>
        </div>

        {subjects.length > 0 ? (
          subjects.map((item) => (
            <div
              className="results-row"
              key={item._id || item.code}
            >
              <div className="result-subject">
                <SubjectCode
                  code={
                    item.subject?.code ||
                    item.code ||
                    "SUB"
                  }
                  color={item.color || "blue"}
                />

                <span>
                  {item.subject?.name ||
                    item.name ||
                    "Unknown Subject"}
                </span>
              </div>

              <span className="result-instructor">
                {item.teacher
                  ? `${item.teacher.firstName || ""} ${
                      item.teacher.lastName || ""
                    }`.trim()
                  : item.instructor ||
                    "Not assigned"}
              </span>

              <GradeBadge
                grade={item.grade || "—"}
                color={item.color || "blue"}
              />

              <div className="result-score">
                <strong>
                  {item.score !== undefined &&
                  item.score !== null
                    ? `${item.score}%`
                    : "—"}
                </strong>

                <div className="result-progress">
                  <span
                    className={`progress-${
                      item.color || "blue"
                    }`}
                    style={{
                      width:
                        item.score !== undefined &&
                        item.score !== null
                          ? `${item.score}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="results-empty">
            No subjects have been assigned to your
            class yet.
          </div>
        )}
      </div>
    </section>
  );
}

// =========================================================
// TODAY'S TIMETABLE
// =========================================================

function TodayTimetable() {
  return (
    <section className="dashboard-card">
      <div className="small-card-header">
        <div className="small-card-title">
          <CalendarDays size={20} />
          <h3>Today's Timetable</h3>
        </div>

        <button className="text-link">
          View All
          <ChevronRight size={14} />
        </button>
      </div>

      <p className="card-description">
        3 classes today
      </p>

      <div className="timetable-list">
        {timetable.map((item) => (
          <div
            className="timetable-item"
            key={item.code}
          >
            <span className="class-time">
              {item.time}
            </span>

            <div className="class-information">
              <SubjectCode
                code={item.code}
                color={item.color}
              />

              <div>
                <strong>{item.subject}</strong>

                <span>
                  {item.teacher} • {item.room}
                </span>
              </div>
            </div>

            <ChevronRight
              size={16}
              className="item-arrow"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// =========================================================
// ASSIGNMENTS
// =========================================================

function UpcomingAssignments() {
  return (
    <section className="dashboard-card">
      <div className="small-card-header">
        <div className="small-card-title">
          <ClipboardList size={20} />
          <h3>Upcoming Assignments</h3>
        </div>

        <button className="text-link">
          View All
          <ChevronRight size={14} />
        </button>
      </div>

      <p className="card-description">
        Assignments that need your attention.
      </p>

      <div className="assignment-list">
        {assignments.map((assignment) => (
          <div
            className="assignment-item"
            key={assignment.day}
          >
            <div className="assignment-date">
              <span>{assignment.month}</span>
              <strong>{assignment.day}</strong>
            </div>

            <div className="assignment-information">
              <strong>{assignment.title}</strong>

              <span>
                {assignment.subject}
              </span>
            </div>

            <SubjectCode
              code={assignment.code}
              color={assignment.color}
            />

            <ChevronRight
              size={16}
              className="item-arrow"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// =========================================================
// ATTENDANCE
// =========================================================

function AttendanceCard({ student }) {
  const attendance =
    student?.attendancePercentage ??
    student?.attendance ??
    null;

  const hasAttendance =
    attendance !== null &&
    attendance !== undefined;

  const displayAttendance = hasAttendance
    ? `${attendance}%`
    : "—";

  return (
    <section className="dashboard-card attendance-card">
      <div className="small-card-header">
        <div className="small-card-title">
          <TrendingUp size={20} />
          <h3>Attendance</h3>
        </div>

        <button className="text-link">
          View Details
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="attendance-content">
        <div className="attendance-circle">
          <div className="attendance-inner">
            <strong>{displayAttendance}</strong>

            <span>
              {hasAttendance
                ? "Attendance"
                : "Not available"}
            </span>
          </div>
        </div>

        <div className="attendance-details">
          <div>
            <CheckCircle2 size={17} />
            <span>Present</span>

            <strong>
              {student?.daysPresent ?? "—"}
            </strong>
          </div>

          <div>
            <AlertCircle size={17} />
            <span>Absent</span>

            <strong>
              {student?.daysAbsent ?? "—"}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

// =========================================================
// FEE STATUS
// =========================================================

function FeeStatus({ student }) {
  const feeStatus =
    student?.feeStatus ||
    student?.fees?.status ||
    null;

  const outstanding =
    student?.outstandingFees ??
    student?.fees?.outstanding ??
    null;

  const hasFeeData =
    feeStatus !== null ||
    outstanding !== null;

  return (
    <section className="dashboard-card fee-card">
      <div className="small-card-header">
        <div className="small-card-title">
          <WalletCards size={20} />
          <h3>Fee Status</h3>
        </div>

        <button className="text-link">
          View Fees
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="fee-content">
        <div className="fee-status-icon">
          {hasFeeData &&
          String(feeStatus).toLowerCase() ===
            "paid" ? (
            <CheckCircle2 size={28} />
          ) : (
            <WalletCards size={27} />
          )}
        </div>

        <div className="fee-information">
          <span>Status</span>

          <strong>
            {hasFeeData
              ? feeStatus || "Outstanding"
              : "Fee information unavailable"}
          </strong>

          {outstanding !== null && (
            <small>
              Outstanding: ₦
              {Number(outstanding).toLocaleString()}
            </small>
          )}
        </div>
      </div>
    </section>
  );
}

// =========================================================
// ANNOUNCEMENTS
// =========================================================

function Announcements() {
  return (
    <section className="dashboard-card announcements-card">
      <div className="small-card-header">
        <div className="small-card-title">
          <Megaphone size={20} />
          <h3>Latest Announcements</h3>
        </div>

        <button className="text-link">
          View All
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="announcement-list">
        {announcements.map((announcement) => (
          <div
            className="announcement-item"
            key={announcement.title}
          >
            <span
              className={`announcement-dot dot-${announcement.color}`}
            />

            <div>
              <strong>
                {announcement.title}
              </strong>

              <span>
                {announcement.date}
                {" • "}
                {announcement.source}
              </span>
            </div>

            <ChevronRight
              size={16}
              className="item-arrow"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// =========================================================
// REPORT CARD
// =========================================================

function ReportCard() {
  return (
    <section className="dashboard-card report-card">
      <div className="small-card-header">
        <div className="small-card-title">
          <FileText size={20} />
          <h3>Report Card</h3>
        </div>
      </div>

      <div className="report-content">
        <div className="report-icon">
          <GraduationCap size={28} />
        </div>

        <div className="report-information">
          <strong>
            Term 1 Report Card
          </strong>

          <span>
            View your complete academic report,
            grades and teacher remarks.
          </span>

          <button className="report-btn">
            View Report Card
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

// =========================================================
// MAIN STUDENT DASHBOARD
// =========================================================

export default function StudentDashboard() {
  const { user } = useAuth();

  const studentId = user?._id || user?.id;

  const [student, setStudent] = useState(null);
  const [academicInfo, setAcademicInfo] =
    useState(null);
  const [loading, setLoading] = useState(true);

  // =======================================================
  // LOAD STUDENT DATA
  // =======================================================

  useEffect(() => {
    let mounted = true;

    async function loadStudentProfile() {
      try {
        setLoading(true);

        // Get student profile
        const response =
          await getMyStudentProfile();

        const studentData =
          response?.data?.student ||
          response?.student ||
          response?.data ||
          null;

        if (mounted) {
          setStudent(studentData);
        }

        // Get academic information
        if (studentId) {
          try {
            const academicResponse =
              await getStudentAcademicInfo(
                studentId
              );

            const academicData =
              academicResponse?.data?.academicInfo ||
              academicResponse?.academicInfo ||
              null;

            if (mounted) {
              setAcademicInfo(academicData);
            }
          } catch (error) {
            console.error(
              "Failed to load student academic information:",
              error
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to load student profile:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStudentProfile();

    return () => {
      mounted = false;
    };
  }, [studentId]);

  // =======================================================
  // CURRENT USER
  // =======================================================

  const currentUser = student || user;

  const studentName =
    getUserName(currentUser);

  const firstName =
    getFirstName(currentUser);

  const initials =
    getInitials(studentName);

  // =======================================================
  // REAL SUBJECTS
  // =======================================================

  const realSubjects =
    academicInfo?.subjects || [];

  // =======================================================
  // AVERAGE SCORE
  // =======================================================

  const averageScore = useMemo(() => {
    if (!realSubjects.length) {
      return 0;
    }

    const subjectsWithScores =
      realSubjects.filter(
        (item) =>
          item.score !== undefined &&
          item.score !== null
      );

    if (!subjectsWithScores.length) {
      return 0;
    }

    const total =
      subjectsWithScores.reduce(
        (sum, item) =>
          sum + Number(item.score),
        0
      );

    return Math.round(
      total / subjectsWithScores.length
    );
  }, [realSubjects]);

  // =======================================================
  // OTHER DASHBOARD DATA
  // =======================================================

  const pendingAssignments =
    assignments.length;

  const attendance =
    student?.attendancePercentage ??
    student?.attendance ??
    null;

  const feeStatus =
    student?.feeStatus ||
    student?.fees?.status ||
    "View status";

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="student-dashboard-loading">
        <div className="loading-spinner" />

        <p>
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // =======================================================
  // DASHBOARD
  // =======================================================

  return (
    <div className="student-dashboard">

      {/* ===================================================
          TOP HEADER
      =================================================== */}

      <header className="student-header">
        <div className="student-header-right">
          <button
            className="student-notification"
            aria-label="Notifications"
          >
            <Bell size={21} />
            <span>3</span>
          </button>

          <div className="student-avatar">
            {initials}
          </div>
        </div>
      </header>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div className="student-dashboard-container">

        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="student-welcome">
          <div className="welcome-left">
            <span className="welcome-emoji">
              👋
            </span>

            <div>
              <h1>
                Welcome back, {firstName}
              </h1>

              <p>
                Here's what's happening with
                your studies today.
              </p>
            </div>
          </div>

          <div className="welcome-illustration">
            <GraduationCap size={74} />
          </div>
        </section>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="student-stat-grid">

          <StatCard
            icon={TrendingUp}
            title="Attendance"
            value={
              attendance !== null
                ? `${attendance}%`
                : "—"
            }
            subtitle="Current term"
            color="green"
          />

          <StatCard
            icon={BarChart3}
            title="Average Result"
            value={`${averageScore}%`}
            subtitle="Current term"
            color="purple"
          />

          <StatCard
            icon={ClipboardList}
            title="Assignments"
            value={pendingAssignments}
            subtitle="Upcoming"
            color="orange"
          />

          <StatCard
            icon={WalletCards}
            title="Fee Status"
            value={feeStatus}
            subtitle="School fees"
            color="blue"
          />

        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <section className="student-content-grid">

          {/* LEFT COLUMN */}

          <div className="student-main-column">

            <AcademicResults
              student={currentUser}
              subjects={realSubjects}
            />

            <UpcomingAssignments />

          </div>

          {/* RIGHT COLUMN */}

          <div className="student-side-column">

            <TodayTimetable />

            <AttendanceCard
              student={currentUser}
            />

            <FeeStatus
              student={currentUser}
            />

          </div>

        </section>

        {/* =================================================
            BOTTOM GRID
        ================================================= */}

        <section className="student-bottom-grid">

          <Announcements />

          <ReportCard />

        </section>

      </div>
    </div>
  );
}
