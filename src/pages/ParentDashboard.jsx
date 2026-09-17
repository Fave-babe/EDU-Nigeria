import { useAuth } from "../context/AuthContext";
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

import "./ParentDashboard.css";

const children = [
  {
    id: 1,
    name: "David Okafor",
    className: "SS 2",
    arm: "A",
    attendance: 94,
    average: 82,
    status: "Good standing",
  },
  {
    id: 2,
    name: "Sarah Okafor",
    className: "JSS 3",
    arm: "B",
    attendance: 91,
    average: 76,
    status: "Good standing",
  },
];

const results = [
  { subject: "Mathematics", score: 88, grade: "A" },
  { subject: "English Language", score: 81, grade: "A-" },
  { subject: "Physics", score: 79, grade: "B+" },
  { subject: "Chemistry", score: 74, grade: "B" },
];

const announcements = [
  {
    title: "Mid-term examination timetable",
    date: "Sep 12",
    type: "Academic",
  },
  {
    title: "Parents' meeting scheduled",
    date: "Sep 18",
    type: "General",
  },
  {
    title: "School cultural day",
    date: "Sep 25",
    type: "Event",
  },
];

const messages = [
  {
    sender: "Mr. Okonkwo",
    message: "David has been doing well in Mathematics.",
    time: "2 hrs ago",
  },
  {
    sender: "School Admin",
    message: "Your child's report card is now available.",
    time: "Yesterday",
  },
];

function ParentDashboard() {
  const { user } = useAuth();

  const parentName =
    user?.fullName ||
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Parent";

  return (
    <div className="parent-dashboard">

      {/* =========================
          HEADER
      ========================== */}
      <div className="parent-header">
        <div>
          <span className="parent-eyebrow">Parent Portal</span>

          <h1>
            Welcome back, {parentName.split(" ")[0]} 👋
          </h1>

          <p>
            Keep track of your children's academic progress,
            attendance and school activities.
          </p>
        </div>

        <div className="parent-header-actions">
          <button className="parent-icon-btn">
            <Bell size={19} />
            <span className="notification-dot" />
          </button>

          <button className="parent-icon-btn">
            <MessageCircle size={19} />
          </button>
        </div>
      </div>

      {/* =========================
          OVERVIEW CARDS
      ========================== */}
      <div className="parent-stat-grid">

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

        <div className="parent-stat-card">
          <div className="parent-stat-icon blue">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>Attendance</span>
            <strong>93%</strong>
            <small>Overall attendance</small>
          </div>
        </div>

        <div className="parent-stat-card">
          <div className="parent-stat-icon gold">
            <Wallet size={21} />
          </div>

          <div>
            <span>Fees</span>
            <strong>₦85,000</strong>
            <small>Outstanding balance</small>
          </div>
        </div>

        <div className="parent-stat-card">
          <div className="parent-stat-icon purple">
            <Trophy size={21} />
          </div>

          <div>
            <span>Average Result</span>
            <strong>82%</strong>
            <small>Latest term average</small>
          </div>
        </div>

      </div>

      {/* =========================
          CHILDREN
      ========================== */}
      <section className="parent-section">

        <div className="parent-section-heading">
          <div>
            <span className="parent-section-label">
              My Children
            </span>

            <h2>Children overview</h2>
          </div>

          <button className="parent-view-btn">
            View all
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="children-grid">

          {children.map((child) => (
            <div className="child-card" key={child.id}>

              <div className="child-card-top">

                <div className="child-avatar">
                  {child.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="child-info">
                  <h3>{child.name}</h3>

                  <p>
                    {child.className} · Arm {child.arm}
                  </p>
                </div>

                <button className="child-arrow">
                  <ChevronRight size={17} />
                </button>

              </div>

              <div className="child-progress-row">

                <div>
                  <span>Attendance</span>
                  <strong>{child.attendance}%</strong>
                </div>

                <div>
                  <span>Average</span>
                  <strong>{child.average}%</strong>
                </div>

              </div>

              <div className="child-progress">
                <div
                  style={{
                    width: `${child.attendance}%`,
                  }}
                />
              </div>

              <div className="child-status">
                <CheckCircle2 size={14} />
                {child.status}
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* =========================
          MAIN CONTENT GRID
      ========================== */}
      <div className="parent-main-grid">

        {/* RESULTS */}
        <section className="parent-panel">

          <div className="panel-heading">
            <div>
              <span className="panel-label">
                Academic Performance
              </span>

              <h2>Latest results</h2>
            </div>

            <button className="panel-link">
              Results
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="results-list">

            {results.map((result) => (
              <div className="result-row" key={result.subject}>

                <div className="result-subject">
                  <div className="subject-icon">
                    <FileText size={16} />
                  </div>

                  <span>{result.subject}</span>
                </div>

                <div className="result-score">
                  <strong>{result.score}%</strong>

                  <span className="grade">
                    {result.grade}
                  </span>
                </div>

              </div>
            ))}

          </div>

        </section>

        {/* ATTENDANCE */}
        <section className="parent-panel">

          <div className="panel-heading">
            <div>
              <span className="panel-label">
                Attendance
              </span>

              <h2>This term</h2>
            </div>

            <CalendarDays size={19} />
          </div>

          <div className="attendance-summary">

            <div className="attendance-circle">
              <div>
                <strong>93%</strong>
                <span>Present</span>
              </div>
            </div>

            <div className="attendance-details">

              <div>
                <span className="attendance-dot present" />
                <p>Present</p>
                <strong>42 days</strong>
              </div>

              <div>
                <span className="attendance-dot late" />
                <p>Late</p>
                <strong>2 days</strong>
              </div>

              <div>
                <span className="attendance-dot absent" />
                <p>Absent</p>
                <strong>1 day</strong>
              </div>

            </div>

          </div>

        </section>

      </div>

      {/* =========================
          FEES + ANNOUNCEMENTS
      ========================== */}
      <div className="parent-main-grid">

        {/* FEES */}
        <section className="parent-panel">

          <div className="panel-heading">

            <div>
              <span className="panel-label">
                School Fees
              </span>

              <h2>Payment status</h2>
            </div>

            <Wallet size={19} />

          </div>

          <div className="fee-card">

            <div className="fee-top">
              <div>
                <span>Total fees</span>
                <strong>₦250,000</strong>
              </div>

              <div className="fee-status">
                <AlertCircle size={14} />
                Balance due
              </div>
            </div>

            <div className="fee-bar">
              <div style={{ width: "66%" }} />
            </div>

            <div className="fee-bottom">
              <span>Paid: ₦165,000</span>
              <strong>₦85,000 remaining</strong>
            </div>

            <button className="fee-button">
              View fee details
              <ChevronRight size={15} />
            </button>

          </div>

        </section>

        {/* ANNOUNCEMENTS */}
        <section className="parent-panel">

          <div className="panel-heading">

            <div>
              <span className="panel-label">
                School Updates
              </span>

              <h2>Announcements</h2>
            </div>

            <Bell size={19} />

          </div>

          <div className="announcement-list">

            {announcements.map((announcement) => (
              <div
                className="announcement-row"
                key={announcement.title}
              >
                <div className="announcement-icon">
                  <Bell size={15} />
                </div>

                <div className="announcement-content">
                  <h3>{announcement.title}</h3>

                  <p>
                    {announcement.type} · {announcement.date}
                  </p>
                </div>

                <ChevronRight size={16} />
              </div>
            ))}

          </div>

        </section>

      </div>

      {/* =========================
          MESSAGES
      ========================== */}
      <section className="parent-panel messages-panel">

        <div className="panel-heading">

          <div>
            <span className="panel-label">
              Communication
            </span>

            <h2>Recent messages</h2>
          </div>

          <button className="panel-link">
            View messages
            <ChevronRight size={15} />
          </button>

        </div>

        <div className="messages-list">

          {messages.map((message) => (
            <div className="message-row" key={message.sender}>

              <div className="message-avatar">
                {message.sender.charAt(0)}
              </div>

              <div className="message-content">
                <h3>{message.sender}</h3>
                <p>{message.message}</p>
              </div>

              <div className="message-time">
                <Clock3 size={13} />
                {message.time}
              </div>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

export default ParentDashboard;