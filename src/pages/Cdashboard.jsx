import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

import {
  Users,
  UserCheck,
  ClipboardList,
  Clock3,
  ArrowRight,
  CalendarDays,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { getStudentsBySchool } from "../api/student.api";

import {
  getCounsellingRecordsByCounsellor,
  getCounsellingFollowUpsByCounsellor,
} from "../api/counsellingRecord.api";

function Cdashboard() {
  const { user, isCounsellor } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [followUps, setFollowUps] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isCounsellor(user)) {
    return <Navigate to="/login" replace />;
  }

  const schoolId = user?.school?._id || user?.school?.id || user?.school;

  const counsellorId = user?._id || user?.id;

  useEffect(() => {
    const loadDashboard = async () => {
      if (!schoolId || !counsellorId) {
        setLoading(false);
        setError("Counsellor or school information is missing.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [studentsResponse, recordsResponse, followUpsResponse] =
          await Promise.all([
            getStudentsBySchool(schoolId),
            getCounsellingRecordsByCounsellor(counsellorId),
            getCounsellingFollowUpsByCounsellor(counsellorId),
          ]);

        console.log("COUNSELLOR DASHBOARD STUDENTS:", studentsResponse);

        console.log("COUNSELLOR DASHBOARD RECORDS:", recordsResponse);

        console.log("COUNSELLOR DASHBOARD FOLLOW UPS:", followUpsResponse);

        const studentList =
          studentsResponse?.students ||
          studentsResponse?.data?.students ||
          studentsResponse?.data ||
          [];

        const counsellingList =
          recordsResponse?.records || recordsResponse?.data?.records || [];

        const followUpList =
          followUpsResponse?.records || followUpsResponse?.data?.records || [];

        setStudents(Array.isArray(studentList) ? studentList : []);

        setRecords(Array.isArray(counsellingList) ? counsellingList : []);

        setFollowUps(Array.isArray(followUpList) ? followUpList : []);
      } catch (err) {
        console.error("COUNSELLOR DASHBOARD ERROR:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load counsellor dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [schoolId, counsellorId]);

  const activeCases = useMemo(() => {
    return records.filter(
      (record) => String(record?.status || "").toLowerCase() === "active",
    );
  }, [records]);

  const needsAttention = useMemo(() => {
    return records.filter((record) => {
      const status = String(record?.status || "").toLowerCase();

      return status === "active" || status === "follow_up";
    });
  }, [records]);

  const studentsInCare = useMemo(() => {
    const studentIds = new Set();

    records.forEach((record) => {
      const studentId =
        record?.student?._id || record?.student?.id || record?.student;

      if (studentId) {
        studentIds.add(String(studentId));
      }
    });

    return studentIds.size;
  }, [records]);

  const recentActivity = useMemo(() => {
    const activities = [
      ...records.map((record) => ({
        type: "case",
        record,
        date: record?.date || record?.createdAt || null,
      })),

      ...followUps.map((record) => ({
        type: "follow_up",
        record,
        date: record?.date || record?.createdAt || null,
      })),
    ];

    return activities
      .filter((item) => item.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [records, followUps]);

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

  const getStudentName = (record) => {
    const student = record?.student;

    if (!student) {
      return "Student";
    }

    if (student.fullName) {
      return student.fullName;
    }

    return (
      [student.firstName, student.lastName].filter(Boolean).join(" ") ||
      "Student"
    );
  };

  const getActivityTitle = (activity) => {
    const record = activity.record;
    const studentName = getStudentName(record);

    if (activity.type === "follow_up") {
      return `Follow-up for ${studentName}`;
    }

    return `Counselling case for ${studentName}`;
  };

  const getActivityDescription = (activity) => {
    const record = activity.record;

    if (record?.reason) {
      return record.reason;
    }

    if (activity.type === "follow_up") {
      return "Student follow-up record";
    }

    return "Counselling record";
  };

  return (
    <div className="counsellor-dashboard">
      <style>{`
        .counsellor-dashboard {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top left,
              rgba(101, 120, 255, 0.12),
              transparent 28%
            ),
            radial-gradient(
              circle at right,
              rgba(16, 185, 129, 0.1),
              transparent 24%
            ),
            linear-gradient(
              180deg,
              #f6f8ff 0%,
              #eef5f4 100%
            );
          padding: 32px 20px 48px;
          color: #172033;
          font-family: Inter, "Segoe UI", sans-serif;
        }

        .counsellor-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .counsellor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 26px;
        }

        .header-copy {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(86, 111, 255, 0.1);
          color: #3f5ae0;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .counsellor-header h1 {
          margin: 0;
          font-size: clamp(2rem, 3vw, 2.7rem);
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.05em;
          color: #101828;
        }

        .header-button {
          border: none;
          background: linear-gradient(
            135deg,
            #1f8bff 0%,
            #4d7cff 100%
          );
          color: #fff;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow:
            0 12px 24px rgba(77, 124, 255, 0.22);
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .header-button:hover {
          transform: translateY(-1px);
          box-shadow:
            0 18px 28px rgba(77, 124, 255, 0.26);
        }

        .welcome-box {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.96),
              rgba(244, 247, 255, 0.9)
            );
          border:
            1px solid rgba(148, 163, 184, 0.18);
          border-radius: 20px;
          padding: 26px 24px;
          margin-bottom: 26px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          box-shadow:
            0 18px 36px rgba(15, 23, 42, 0.06);
        }

        .welcome-box h2 {
          margin: 0;
          font-size: clamp(1.35rem, 2vw, 1.85rem);
          color: #101828;
          font-weight: 800;
        }

        .welcome-box p {
          margin: 8px 0 0;
          color: #52607a;
          font-size: 0.96rem;
          line-height: 1.6;
          max-width: 620px;
        }

        .mini-metric {
          min-width: 180px;
          padding: 18px 20px;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              #eafaf4 0%,
              #ebf1ff 100%
            );
          border:
            1px solid rgba(16, 185, 129, 0.15);
          text-align: center;
        }

        .mini-metric span {
          display: block;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #4c8b74;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .mini-metric strong {
          display: block;
          font-size: 2rem;
          color: #0f172a;
          letter-spacing: -0.06em;
        }

        .stats-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 26px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.9);
          border:
            1px solid rgba(148, 163, 184, 0.18);
          border-radius: 18px;
          padding: 20px 18px;
          box-shadow:
            0 10px 24px rgba(15, 23, 42, 0.04);
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }

        .stat-card h3 {
          margin: 0;
          font-size: clamp(1.6rem, 2vw, 2.1rem);
          line-height: 1.1;
          color: #0f172a;
          font-weight: 800;
          letter-spacing: -0.06em;
        }

        .stat-card p {
          margin: 8px 0 0;
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.5;
          text-transform: capitalize;
        }

        .stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #eaf4ff 0%,
              #e6fff5 100%
            );
          color: #2455d2;
          flex-shrink: 0;
        }

        .stat-card:nth-child(2) .stat-icon {
          background:
            linear-gradient(
              135deg,
              #fff0eb 0%,
              #ffe9e4 100%
            );
          color: #d45a39;
        }

        .stat-card:nth-child(3) .stat-icon {
          background:
            linear-gradient(
              135deg,
              #edfdf5 0%,
              #effaf7 100%
            );
          color: #0e9f6e;
        }

        .stat-card:nth-child(4) .stat-icon {
          background:
            linear-gradient(
              135deg,
              #fef3c7 0%,
              #fff7d8 100%
            );
          color: #b56500;
        }

        .main-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.7fr)
            minmax(290px, 0.9fr);
          gap: 22px;
        }

        .dashboard-card {
          background: rgba(255, 255, 255, 0.92);
          border:
            1px solid rgba(148, 163, 184, 0.18);
          border-radius: 20px;
          padding: 22px 22px 18px;
          box-shadow:
            0 18px 36px rgba(15, 23, 42, 0.04);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .card-header h2 {
          margin: 0;
          font-size: 1.05rem;
          color: #111827;
          font-weight: 800;
        }

        .card-header span {
          color: #64748b;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 12px;
          border-radius: 14px;
          background: #f9fbff;
          border:
            1px solid rgba(148, 163, 184, 0.14);
        }

        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
          background: #3b82f6;
          box-shadow:
            0 0 0 5px rgba(59, 130, 246, 0.13);
        }

        .timeline-item:nth-child(2) .timeline-dot {
          background: #10b981;
          box-shadow:
            0 0 0 5px rgba(16, 185, 129, 0.14);
        }

        .timeline-item:nth-child(3) .timeline-dot {
          background: #f59e0b;
          box-shadow:
            0 0 0 5px rgba(245, 158, 11, 0.12);
        }

        .timeline-copy {
          flex: 1;
        }

        .timeline-copy strong {
          display: block;
          color: #111827;
          font-size: 0.96rem;
          margin-bottom: 6px;
        }

        .timeline-copy p {
          margin: 0;
          color: #52607a;
          font-size: 0.86rem;
          line-height: 1.55;
        }

        .timeline-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 10px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          background:
            rgba(59, 130, 246, 0.1);
          color: #1d4ed8;
          border-radius: 999px;
          padding: 5px 8px;
          font-size: 11px;
          font-weight: 700;
        }

        .timeline-item:nth-child(2) .badge {
          background:
            rgba(16, 185, 129, 0.12);
          color: #047857;
        }

        .timeline-item:nth-child(3) .badge {
          background:
            rgba(245, 158, 11, 0.12);
          color: #b45309;
        }

        .time-stamp {
          color: #6b7280;
          font-size: 0.74rem;
          font-weight: 600;
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-button {
          width: 100%;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f7f9ff 100%
            );
          border:
            1px solid rgba(148, 163, 184, 0.18);
          border-radius: 14px;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
          box-shadow:
            0 6px 16px rgba(15, 23, 42, 0.04);
        }

        .action-button:hover {
          transform: translateY(-1px);
          border-color:
            rgba(77, 124, 255, 0.4);
          box-shadow:
            0 12px 24px rgba(77, 124, 255, 0.1);
        }

        .action-left {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .action-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #ebf3ff 0%,
              #edfdf7 100%
            );
          color: #2759d8;
          flex-shrink: 0;
        }

        .action-text strong {
          display: block;
          color: #111827;
          font-size: 0.96rem;
          margin-bottom: 3px;
        }

        .action-text span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
        }

        .dashboard-message {
          margin-bottom: 20px;
          padding: 14px 16px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
        }

        .dashboard-error {
          background: #fff1f2;
          color: #be123c;
          border: 1px solid #fecdd3;
        }

        .empty-activity {
          padding: 30px 20px;
          text-align: center;
          color: #64748b;
          font-size: 0.9rem;
          background: #f9fbff;
          border-radius: 14px;
          border: 1px solid rgba(148, 163, 184, 0.14);
        }

        .loading-activity {
          padding: 30px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          color: #64748b;
        }

        @media (max-width: 1000px) {
          .stats-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .counsellor-dashboard {
            padding: 20px 14px 34px;
          }

          .counsellor-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .welcome-box {
            flex-direction: column;
            align-items: flex-start;
          }

          .mini-metric {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .header-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="counsellor-container">
        {/* HEADER */}
        <header className="counsellor-header dashboard-topbar">
          <div className="header-copy">
            <span className="eyebrow">Support Hub</span>

            <h1>Counsellor Dashboard</h1>
          </div>

          <button
            type="button"
            className="header-button"
            onClick={() => navigate("/counsellor/counselling")}
          >
            <FileText size={18} />
            Open Records
          </button>
        </header>

        {/* ERROR */}
        {error && (
          <div className="dashboard-message dashboard-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* WELCOME */}
        <section className="welcome-box">
          <div>
            <h2>
              Welcome back, {user?.fullName || user?.firstName || "Counsellor"}
            </h2>

            <p>
              Keep track of student wellbeing, manage active cases, and stay on
              top of follow-up tasks.
            </p>
          </div>

          <div className="mini-metric">
            <span>Students in care</span>

            <strong>{loading ? "—" : studentsInCare}</strong>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="stats-grid">
          {/* TOTAL STUDENTS */}
          <div className="stat-card">
            <div className="stat-top">
              <div>
                <h3>{loading ? "—" : students.length}</h3>

                <p>Total Students</p>
              </div>

              <div className="stat-icon">
                <Users size={21} />
              </div>
            </div>
          </div>

          {/* NEEDS ATTENTION */}
          <div className="stat-card">
            <div className="stat-top">
              <div>
                <h3>{loading ? "—" : needsAttention.length}</h3>

                <p>Needs Attention</p>
              </div>

              <div className="stat-icon">
                <UserCheck size={21} />
              </div>
            </div>
          </div>

          {/* ACTIVE CASES */}
          <div className="stat-card">
            <div className="stat-top">
              <div>
                <h3>{loading ? "—" : activeCases.length}</h3>

                <p>Active Cases</p>
              </div>

              <div className="stat-icon">
                <ClipboardList size={21} />
              </div>
            </div>
          </div>

          {/* FOLLOW UPS */}
          <div className="stat-card">
            <div className="stat-top">
              <div>
                <h3>{loading ? "—" : followUps.length}</h3>

                <p>Follow-ups Due</p>
              </div>

              <div className="stat-icon">
                <Clock3 size={21} />
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="main-grid">
          {/* RECENT ACTIVITY */}
          <section className="dashboard-card">
            <div className="card-header">
              <h2>Recent Activity</h2>

              <span>Updates</span>
            </div>

            {loading ? (
              <div className="loading-activity">
                <Loader2 size={18} className="animate-spin" />
                Loading activity...
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="empty-activity">
                No counselling activity has been recorded yet.
              </div>
            ) : (
              <div className="timeline">
                {recentActivity.map((activity, index) => (
                  <div
                    className="timeline-item"
                    key={activity.record?._id || `${activity.type}-${index}`}
                  >
                    <span className="timeline-dot" />

                    <div className="timeline-copy">
                      <strong>{getActivityTitle(activity)}</strong>

                      <p>{getActivityDescription(activity)}</p>

                      <div className="timeline-meta">
                        <span className="badge">
                          {activity.type === "follow_up"
                            ? "Follow-up"
                            : activity.record?.status || "Case"}
                        </span>

                        <span className="time-stamp">
                          {formatDate(activity.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* QUICK ACTIONS */}
          <aside className="dashboard-card">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>

            <div className="quick-actions">
              {/* STUDENTS */}
              <button
                type="button"
                className="action-button"
                onClick={() => navigate("/counsellor/students")}
              >
                <div className="action-left">
                  <div className="action-icon">
                    <Users size={18} />
                  </div>

                  <div className="action-text">
                    <strong>View Students</strong>

                    <span>Browse student records</span>
                  </div>
                </div>

                <ArrowRight size={17} />
              </button>

              {/* COUNSELLING RECORDS */}
              <button
                type="button"
                className="action-button"
                onClick={() => navigate("/counsellor/counselling")}
              >
                <div className="action-left">
                  <div className="action-icon">
                    <FileText size={18} />
                  </div>

                  <div className="action-text">
                    <strong>Counselling Records</strong>

                    <span>Manage counselling sessions</span>
                  </div>
                </div>

                <ArrowRight size={17} />
              </button>

              {/* FOLLOW UPS */}
              <button
                type="button"
                className="action-button"
                onClick={() => navigate("/counsellor/followups")}
              >
                <div className="action-left">
                  <div className="action-icon">
                    <CalendarDays size={18} />
                  </div>

                  <div className="action-text">
                    <strong>Follow-ups</strong>

                    <span>Manage follow-up records</span>
                  </div>
                </div>

                <ArrowRight size={17} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cdashboard;
