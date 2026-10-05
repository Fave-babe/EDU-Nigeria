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
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/authcontext";
import { getStudentAcademicInfo } from "../api/enrollement.api";
import { getMyStudentProfile } from "../api/student.api";
import { getSchoolSubjects } from "../api/subject.api";
import "./StudentDashboard.css";
import { getSchoolAssignments } from "../api/assignment.api";
import { getClassTimetable } from "../api/timetable.api";
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
  return <span className={`subject-code subject-${color}`}>{code}</span>;
}

// =========================================================
// GRADE BADGE
// =========================================================

function GradeBadge({ grade, color }) {
  return <span className={`grade-badge grade-${color}`}>{grade}</span>;
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({ icon: Icon, title, value, subtitle, color }) {
  return (
    <div className="student-stat-card">
      <div className={`stat-icon stat-${color}`}>
        <Icon size={23} />
      </div>

      <div className="stat-content">
        <span className="stat-title">{title}</span>

        <strong>{value}</strong>

        <span className="stat-subtitle">{subtitle}</span>
      </div>

      <ChevronRight size={17} className="stat-arrow" />
    </div>
  );
}

// =========================================================
// ACADEMIC RESULTS
// =========================================================

function AcademicResults({ student, subjects }) {
  const studentClass =
    student?.enrollment?.class?.name ||
    [student?.enrollment?.class?.level, student?.enrollment?.class?.arm]
      .filter(Boolean)
      .join(" ") ||
    "Class not assigned";
  const track = student?.enrollment?.class?.level || "Not assigned";

  return (
    <section className="dashboard-card results-card">
      <div className="card-header">
        <div>
          <h2>Academic Results</h2>

          <p>Your academic performance for the current term.</p>
        </div>

        <button className="view-all-btn" onClick={() => navigate("/results")}>
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
          <span>LEVEL</span>
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
            <div className="results-row" key={item._id || item.code}>
              <div className="result-subject">
                <SubjectCode
                  code={item.subject?.code || item.code || "SUB"}
                  color={item.color || "blue"}
                />

                <span>
                  {item.subject?.name || item.name || "Unknown Subject"}
                </span>
              </div>

              <span className="result-instructor">
                {item.teacher
                  ? `${item.teacher.firstName || ""} ${
                      item.teacher.lastName || ""
                    }`.trim()
                  : item.instructor || "Not assigned"}
              </span>

              <GradeBadge
                grade={item.grade || "—"}
                color={item.color || "blue"}
              />

              <div className="result-score">
                <strong>
                  {item.score !== undefined && item.score !== null
                    ? `${item.score}%`
                    : "—"}
                </strong>

                <div className="result-progress">
                  <span
                    className={`progress-${item.color || "blue"}`}
                    style={{
                      width:
                        item.score !== undefined && item.score !== null
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
            No subjects have been assigned to your class yet.
          </div>
        )}
      </div>
    </section>
  );
}

/// =========================================================
// TODAY'S TIMETABLE
function TodayTimetable({ timetable, navigate }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todayTimetable = timetable
    .filter((item) => item.day === today)
    .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));

  return (
    <section className="dashboard-card">
      <div className="small-card-header">
        <div className="small-card-title">
          <CalendarDays size={20} />
          <h3>Today's Timetable</h3>
        </div>

        <button className="text-link" onClick={() => navigate("/timetable")}>
          View All
          <ChevronRight size={14} />
        </button>
      </div>

      <p className="card-description">
        {todayTimetable.length}{" "}
        {todayTimetable.length === 1 ? "class" : "classes"} today
      </p>

      <div className="timetable-list">
        {todayTimetable.length === 0 ? (
          <div className="results-empty">No classes scheduled for today.</div>
        ) : (
          todayTimetable.map((item) => (
            <div className="timetable-item" key={item._id}>
              <div className="class-time">
                {item.startTime || "Time not set"}
                {item.endTime ? ` - ${item.endTime}` : ""}
              </div>

              <div className="class-information">
                <SubjectCode code={item.subject?.code || "SUB"} color="blue" />

                <div className="class-details">
                  <strong>{item.subject?.name || "Subject"}</strong>

                  <span>
                    {item.teacher?.firstName || ""}{" "}
                    {item.teacher?.lastName || ""}
                    {" • "}
                    {item.room || "Room not assigned"}
                  </span>
                </div>
              </div>

              <ChevronRight size={16} className="item-arrow" />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// =========================================================
// ASSIGNMENTS
// =========================================================

function UpcomingAssignments({ navigate, assignments }) {
  const upcomingAssignments = assignments
    .filter((assignment) => {
      if (!assignment?.dueDate) return false;

      return new Date(assignment.dueDate) >= new Date();
    })
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="dashboard-card">
      <div className="small-card-header">
        <div className="small-card-title">
          <ClipboardList size={20} />
          <h3>Upcoming Assignments</h3>
        </div>

        <button className="text-link" onClick={() => navigate("/assignments")}>
          View All
          <ChevronRight size={14} />
        </button>
      </div>

      <p className="card-description">Assignments that need your attention.</p>

      <div className="assignment-list">
        {upcomingAssignments.length === 0 ? (
          <div className="results-empty">No upcoming assignments.</div>
        ) : (
          upcomingAssignments.map((assignment) => {
            const dueDate = new Date(assignment.dueDate);

            const month = dueDate.toLocaleDateString("en-US", {
              month: "short",
            });

            const day = dueDate.toLocaleDateString("en-US", {
              day: "numeric",
            });

            return (
              <div className="assignment-item" key={assignment._id}>
                <div className="assignment-date">
                  <span>{month}</span>
                  <strong>{day}</strong>
                </div>

                <div className="assignment-information">
                  <strong>{assignment.title}</strong>

                  <span>
                    {assignment.subject?.name || "Subject not assigned"}
                  </span>
                </div>

                <SubjectCode
                  code={assignment.subject?.code || "SUB"}
                  color="blue"
                />

                <ChevronRight size={16} className="item-arrow" />
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

// =========================================================
// ATTENDANCE
// =========================================================

function AttendanceCard({ student, navigate }) {
  const attendance =
    student?.attendancePercentage ?? student?.attendance ?? null;

  const hasAttendance = attendance !== null && attendance !== undefined;

  const displayAttendance = hasAttendance ? `${attendance}%` : "—";

  return (
    <section className="dashboard-card attendance-card">
      <div className="small-card-header">
        <div className="small-card-title">
          <TrendingUp size={20} />
          <h3>Attendance</h3>
        </div>

        <button className="text-link" onClick={() => navigate("/attendance")}>
          View Details
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="attendance-content">
        <div className="attendance-circle">
          <div className="attendance-inner">
            <strong>{displayAttendance}</strong>

            <span>{hasAttendance ? "Attendance" : "Not available"}</span>
          </div>
        </div>

        <div className="attendance-details">
          <div>
            <CheckCircle2 size={17} />
            <span>Present</span>

            <strong>{student?.daysPresent ?? "—"}</strong>
          </div>

          <div>
            <AlertCircle size={17} />
            <span>Absent</span>

            <strong>{student?.daysAbsent ?? "—"}</strong>
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
  const feeStatus = student?.feeStatus || student?.fees?.status || null;

  const outstanding =
    student?.outstandingFees ?? student?.fees?.outstanding ?? null;

  const hasFeeData = feeStatus !== null || outstanding !== null;

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
          {hasFeeData && String(feeStatus).toLowerCase() === "paid" ? (
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
            <small>Outstanding: ₦{Number(outstanding).toLocaleString()}</small>
          )}
        </div>
      </div>
    </section>
  );
}

// =========================================================
// ANNOUNCEMENTS
// =========================================================

function Announcements({ navigate }) {
  return (
    <section className="dashboard-card announcements-card">
      <div className="small-card-header">
        <div className="small-card-title">
          <Megaphone size={20} />
          <h3>Latest Announcements</h3>
        </div>

        <button
          className="text-link"
          onClick={() => navigate("/announcements")}
        >
          View All
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="announcement-list">
        {announcements.map((announcement) => (
          <div className="announcement-item" key={announcement.title}>
            <span className={`announcement-dot dot-${announcement.color}`} />

            <div>
              <strong>{announcement.title}</strong>

              <span>
                {announcement.date}
                {" • "}
                {announcement.source}
              </span>
            </div>

            <ChevronRight size={16} className="item-arrow" />
          </div>
        ))}
      </div>
    </section>
  );
}

// =========================================================
// REPORT CARD
// =========================================================

function ReportCard({ navigate }) {
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
          <strong>Term 1 Report Card</strong>

          <span>
            View your complete academic report, grades and teacher remarks.
          </span>

          <button className="report-btn" onClick={() => navigate("/results")}>
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
  const navigate = useNavigate();
  const { user } = useAuth();

  const studentId = user?._id || user?.id;

  const [student, setStudent] = useState(null);
  const [academicInfo, setAcademicInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // =======================================================
  // LOAD STUDENT DATA
  // =======================================================

  useEffect(() => {
    let mounted = true;

    async function loadStudentProfile() {
      try {
        setLoading(true);

        // Get student profile
        const response = await getMyStudentProfile();

        const studentData =
          response?.data?.student ||
          response?.student ||
          response?.data ||
          null;
        const schoolId = studentData?.school?._id;
        console.log("STUDENT PROFILE RESPONSE:", response);
        console.log("STUDENT DATA:", studentData);
        console.log("SCHOOL:", studentData?.school);
        console.log("ENROLLMENT:", studentData?.enrollment);
        console.log("CLASS:", studentData?.enrollment?.class);
        if (mounted) {
          setStudent(studentData);
          const classId = studentData?.enrollment?.class?._id;

          if (classId) {
            try {
              const timetableResponse = await getClassTimetable(
                classId,
                "6aa71820239080fa23f5f8eb",
              );
              console.log("CLASS TIMETABLE RESPONSE:", timetableResponse);

              const timetableData =
                timetableResponse?.timetable ||
                timetableResponse?.entries ||
                timetableResponse?.data?.timetable ||
                timetableResponse?.data ||
                [];

              if (mounted) {
                setTimetable(Array.isArray(timetableData) ? timetableData : []);
              }
            } catch (error) {
              console.error("Failed to load class timetable:", error);
            }
          }
          const schoolId = studentData?.school?._id;

          if (schoolId) {
            try {
              const subjectsResponse = await getSchoolSubjects(schoolId);

              console.log(
                "SCHOOL SUBJECTS:",
                JSON.stringify(
                  subjectsResponse?.data?.subjects ||
                    subjectsResponse?.subjects ||
                    [],
                  null,
                  2,
                ),
              );
            } catch (error) {
              console.error("Failed to load school subjects:", error);
            }
          }
        }
        if (schoolId) {
          try {
            const assignmentsResponse = await getSchoolAssignments(schoolId);

            const schoolAssignments =
              assignmentsResponse?.data?.assignments ||
              assignmentsResponse?.assignments ||
              [];

            const studentClassId = studentData?.enrollment?.class?._id;

            console.log("ALL SCHOOL ASSIGNMENTS:", schoolAssignments);
            console.log("STUDENT CLASS ID:", studentClassId);

            const studentAssignments = schoolAssignments.filter(
              (assignment) => {
                const assignmentClassId =
                  assignment?.class?._id || assignment?.class;

                console.log("ASSIGNMENT:", assignment);
                console.log("ASSIGNMENT CLASS ID:", assignmentClassId);
                console.log("ASSIGNMENT STATUS:", assignment?.status);

                return (
                  studentClassId &&
                  assignmentClassId &&
                  String(assignmentClassId) === String(studentClassId) &&
                  assignment.status === "published"
                );
              },
            );

            if (mounted) {
              setAssignments(studentAssignments);
            }

            console.log("STUDENT ASSIGNMENTS:", studentAssignments);
          } catch (error) {
            console.error("Failed to load student assignments:", error);

            if (mounted) {
              setAssignments([]);
            }
          }
        }

        // Get academic information
        if (studentId) {
          try {
            const academicResponse = await getStudentAcademicInfo(studentId);

            const academicData = academicResponse?.academicInfo || null;
            console.log("ACADEMIC RESPONSE:", academicResponse);
            console.log("ACADEMIC DATA:", academicData);
            console.log("ACADEMIC SUBJECTS:", academicData?.subjects);

            if (mounted) {
              setAcademicInfo(academicData);
            }
          } catch (error) {
            console.error(
              "Failed to load student academic information:",
              error,
            );
          }
        }
      } catch (error) {
        console.error("Failed to load student profile:", error);
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
  const realSubjects = academicInfo?.subjects || [];

  const schoolName = student?.school?.name || "School not assigned";

  const studentClass =
    student?.enrollment?.class?.name ||
    [student?.enrollment?.class?.level, student?.enrollment?.class?.arm]
      .filter(Boolean)
      .join(" ") ||
    "Class not assigned";
  const studentName = getUserName(currentUser);

  const firstName = getFirstName(currentUser);

  const initials = getInitials(studentName);
  const currentDate = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // =======================================================
  // AVERAGE SCORE
  // =======================================================

  const averageScore = useMemo(() => {
    if (!realSubjects.length) {
      return null;
    }

    const subjectsWithScores = realSubjects.filter(
      (item) =>
        item.score !== undefined &&
        item.score !== null &&
        !Number.isNaN(Number(item.score)),
    );

    if (!subjectsWithScores.length) {
      return null;
    }

    const total = subjectsWithScores.reduce(
      (sum, item) => sum + Number(item.score),
      0,
    );

    return Math.round(total / subjectsWithScores.length);
  }, [realSubjects]);

  // =======================================================
  // OTHER DASHBOARD DATA
  // =======================================================

  const pendingAssignments = assignments.length;

  const attendance =
    student?.attendancePercentage ?? student?.attendance ?? null;

  const feeStatus =
    student?.feeStatus || student?.fees?.status || "View status";

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="student-dashboard-loading">
        <div className="loading-spinner" />

        <p>Loading your dashboard...</p>
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

      <header className="student-header dashboard-topbar">
        <div className="student-header-heading">
          <span>STUDENT PORTAL</span>
          <h2>Student Dashboard</h2>
          <p>{currentDate}</p>
        </div>

        <div className="student-header-right">
          <button
            className="student-notification"
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={21} />
          </button>

          <div className="student-class-info">
            <strong>{studentClass}</strong>
            <span>{schoolName}</span>
          </div>

          <div className="student-avatar">{initials}</div>
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
            <span className="welcome-emoji">👋</span>

            <div>
              <h1>Welcome back, {firstName}</h1>

              <p>
                {schoolName} • {studentClass}
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
            value={attendance !== null ? `${attendance}%` : "—"}
            subtitle="Current term"
            color="green"
          />

          <StatCard
            icon={BarChart3}
            title="Average Result"
            value={averageScore !== null ? `${averageScore}%` : "—"}
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
            <AcademicResults student={currentUser} subjects={realSubjects} />

            <UpcomingAssignments
              navigate={navigate}
              assignments={assignments}
            />
          </div>

          {/* RIGHT COLUMN */}

          <div className="student-side-column">
            <TodayTimetable timetable={timetable} navigate={navigate} />
            <AttendanceCard student={currentUser} navigate={navigate} />
            <FeeStatus student={currentUser} />
          </div>
        </section>

        {/* =================================================
            BOTTOM GRID
        ================================================= */}

        <section className="student-bottom-grid">
          <Announcements navigate={navigate} />

          <ReportCard navigate={navigate} />
        </section>
      </div>
    </div>
  );
}
