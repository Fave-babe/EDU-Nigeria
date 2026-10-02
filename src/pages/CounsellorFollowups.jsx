import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
  Search,
  ClipboardCheck,
  BellRing,
  CalendarClock,
  UsersRound,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  FileText,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/authcontext";
import { getCounsellingFollowUpsByCounsellor } from "../api/counsellingRecord.api";

function CounsellorFollowups() {
  const navigate = useNavigate();
  const { user, getEffectiveRole } = useAuth();

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedRecord, setExpandedRecord] = useState(null);

  const effectiveRole = user ? getEffectiveRole(user) : "";
  const isCounsellor = effectiveRole === "counsellor";

  useEffect(() => {
    if (!user || !isCounsellor) {
      setLoading(false);
      return;
    }

    const loadFollowUps = async () => {
      try {
        setLoading(true);

        const counsellorId = user?._id || user?.id;

        if (!counsellorId) {
          console.error("COUNSELLOR ID NOT FOUND");
          setRecords([]);
          return;
        }

        const response =
          await getCounsellingFollowUpsByCounsellor(counsellorId);

        console.log("COUNSELLOR FOLLOW-UPS RESPONSE:", response);

        const followUps = response?.records || response?.data?.records || [];

        setRecords(Array.isArray(followUps) ? followUps : []);
      } catch (error) {
        console.error("COUNSELLOR FOLLOW-UPS ERROR:", error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadFollowUps();
  }, [user, isCounsellor]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return records;
    }

    return records.filter((record) => {
      const student = record?.student;

      const studentName =
        `${student?.firstName || ""} ${student?.lastName || ""}`
          .trim()
          .toLowerCase();

      const registrationNumber = (
        student?.registrationNumber || ""
      ).toLowerCase();

      const reason = (record?.reason || "").toLowerCase();
      const notes = (record?.notes || "").toLowerCase();

      return (
        studentName.includes(query) ||
        registrationNumber.includes(query) ||
        reason.includes(query) ||
        notes.includes(query)
      );
    });
  }, [records, search]);

  const summary = useMemo(() => {
    const total = records.length;

    const students = new Set(
      records
        .map((record) => {
          const student = record?.student;

          return student
            ? `${student.firstName || ""} ${student.lastName || ""}`.trim()
            : "";
        })
        .filter(Boolean),
    ).size;

    const recent = records.filter((record) => {
      const dateValue = record?.date || record?.createdAt;

      if (!dateValue) {
        return false;
      }

      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return false;
      }

      const difference = Date.now() - date.getTime();

      return difference >= 0 && difference <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    const withNotes = records.filter((record) => record?.notes?.trim()).length;

    return {
      total,
      students,
      recent,
      withNotes,
    };
  }, [records]);

  const formatDate = (value) => {
    if (!value) {
      return "No date";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "No date";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStudentName = (student) => {
    if (!student) {
      return "Unknown student";
    }

    return (
      `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
      "Unknown student"
    );
  };

  const getInitials = (student) => {
    if (!student) {
      return "?";
    }

    const firstInitial = student.firstName?.[0] || "";
    const lastInitial = student.lastName?.[0] || "";

    const initials = `${firstInitial}${lastInitial}`.toUpperCase();

    return initials || "?";
  };

  const toggleRecord = (recordId) => {
    setExpandedRecord((current) => (current === recordId ? null : recordId));
  };

  const handleReviewCases = () => {
    navigate("/counsellor/counselling");
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isCounsellor) {
    return <Navigate to="/Cdashboard" replace />;
  }

  return (
    <div className="cfu-page">
      <style>{`
        .cfu-page {
          --navy: #071a41;
          --blue: #2563eb;
          --blue-soft: #edf4ff;
          --green: #0f9f6e;
          --green-soft: #ecfdf5;
          --amber: #d97706;
          --amber-soft: #fff7ed;
          --text: #14213a;
          --muted: #64748b;
          --border: #e5edf8;
          --surface: #ffffff;
          --page: #f4f7fb;

          min-height: 100vh;
          padding: 28px 22px 36px;

          background:
            radial-gradient(
              circle at top right,
              rgba(37, 99, 235, 0.12),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #f8fbff 0%,
              var(--page) 100%
            );

          color: var(--text);

          font-family:
            Inter,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .cfu-inner {
          width: min(1220px, 100%);
          margin: 0 auto;
        }

        /* HERO */

        .cfu-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-bottom: 22px;
        }

        .cfu-hero-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cfu-icon {
          width: 58px;
          height: 58px;
          flex: 0 0 58px;

          display: grid;
          place-items: center;

          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              #0f1b52 0%,
              #1d4ed8 100%
            );

          color: white;

          box-shadow:
            0 16px 30px rgba(37, 99, 235, 0.2);
        }

        .cfu-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 8px;

          color: var(--green);

          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .cfu-title {
          margin: 0;

          color: var(--navy);

          font-size: clamp(30px, 3.2vw, 42px);
          line-height: 1.06;
          letter-spacing: -0.06em;
        }

        .cfu-subtitle {
          margin: 10px 0 0;
          max-width: 640px;

          color: var(--muted);

          font-size: 14px;
          line-height: 1.7;
        }

        .cfu-review {
          border: 1px solid rgba(37, 99, 235, 0.16);

          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f7faff 100%
            );

          color: var(--navy);

          padding: 12px 16px;
          border-radius: 12px;

          display: inline-flex;
          align-items: center;
          gap: 8px;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 12px 24px rgba(15, 23, 42, 0.04);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .cfu-review:hover {
          transform: translateY(-1px);

          box-shadow:
            0 14px 26px rgba(15, 23, 42, 0.08);
        }

        /* STATS */

        .cfu-stats {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 16px;
          margin-bottom: 22px;
        }

        .cfu-stat {
          position: relative;
          overflow: hidden;

          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fbfcff 100%
            );

          border: 1px solid var(--border);
          border-radius: 18px;

          padding: 18px;

          box-shadow:
            0 18px 45px rgba(15, 23, 42, 0.08);
        }

        .cfu-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;

          margin-bottom: 18px;
        }

        .cfu-stat-label {
          margin: 0;

          color: var(--muted);

          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .cfu-stat-number {
          margin: 0;

          color: var(--navy);

          font-size: clamp(26px, 2.7vw, 32px);
          line-height: 1;
          letter-spacing: -0.06em;
          font-weight: 800;
        }

        .cfu-stat-icon {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          background: var(--blue-soft);
          color: var(--blue);
        }

        .cfu-stat:nth-child(2) .cfu-stat-icon {
          background: var(--green-soft);
          color: var(--green);
        }

        .cfu-stat:nth-child(3) .cfu-stat-icon {
          background: var(--amber-soft);
          color: var(--amber);
        }

        .cfu-stat:nth-child(4) .cfu-stat-icon {
          background: #f1f5f9;
          color: #475569;
        }

        /* MAIN CARD */

        .cfu-card {
          overflow: hidden;

          background: var(--surface);

          border: 1px solid var(--border);
          border-radius: 22px;

          box-shadow:
            0 18px 45px rgba(15, 23, 42, 0.08);
        }

        .cfu-card-head {
          padding: 18px 20px;

          border-bottom: 1px solid var(--border);

          display: flex;
          justify-content: space-between;
          align-items: center;

          gap: 18px;

          background:
            linear-gradient(
              180deg,
              rgba(248, 250, 252, 0.8),
              rgba(255, 255, 255, 0.9)
            );
        }

        .cfu-heading {
          margin: 0;

          color: var(--navy);

          font-size: 18px;
          letter-spacing: -0.03em;
        }

        .cfu-heading-sub {
          margin: 5px 0 0;

          color: var(--muted);

          font-size: 12px;
        }

        .cfu-tools {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cfu-search {
          position: relative;
          width: 320px;
        }

        .cfu-search svg {
          position: absolute;

          left: 12px;
          top: 50%;

          transform: translateY(-50%);

          color: #8ea2bd;
        }

        .cfu-search input {
          width: 100%;
          box-sizing: border-box;

          padding:
            11px
            12px
            11px
            38px;

          border: 1px solid #dfe8f4;
          border-radius: 12px;

          outline: none;

          background: #f8fafc;
          color: var(--text);

          font-size: 13px;

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .cfu-search input::placeholder {
          color: #8aa0ba;
        }

        .cfu-search input:focus {
          border-color:
            rgba(37, 99, 235, 0.42);

          background: white;

          box-shadow:
            0 0 0 4px rgba(37, 99, 235, 0.08);
        }

        .cfu-count {
          white-space: nowrap;

          padding: 8px 12px;

          border-radius: 999px;

          background:
            linear-gradient(
              135deg,
              #eff6ff 0%,
              #dbeafe 100%
            );

          color: var(--blue);

          font-size: 12px;
          font-weight: 800;
        }

        /* FOLLOW-UP LIST */

        .cfu-list {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cfu-item {
          overflow: hidden;

          border: 1px solid #e6edf6;
          border-radius: 16px;

          background: white;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .cfu-item:hover {
          border-color: #cddbf0;

          box-shadow:
            0 10px 25px rgba(15, 23, 42, 0.06);
        }

        .cfu-item.expanded {
          border-color:
            rgba(37, 99, 235, 0.28);

          box-shadow:
            0 12px 30px rgba(15, 23, 42, 0.08);
        }

        .cfu-item-button {
          width: 100%;

          border: 0;
          background: transparent;

          padding: 15px 16px;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            auto
            auto
            24px;

          align-items: center;

          gap: 18px;

          text-align: left;

          cursor: pointer;
        }

        .cfu-item-student {
          min-width: 0;

          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cfu-avatar {
          width: 42px;
          height: 42px;

          flex: 0 0 42px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #071a41 0%,
              #1d4ed8 100%
            );

          color: white;

          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .cfu-student-info {
          min-width: 0;
        }

        .cfu-student-name {
          display: block;

          color: var(--navy);

          font-size: 13px;
          font-weight: 800;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cfu-student-email {
          display: flex;
          align-items: center;
          gap: 5px;

          margin-top: 4px;

          color: var(--muted);

          font-size: 11px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cfu-item-reason {
          min-width: 180px;
          max-width: 280px;

          color: #24324d;

          font-size: 12px;
          font-weight: 700;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cfu-item-date {
          white-space: nowrap;

          color: #475569;

          font-size: 11px;
          font-weight: 700;
        }

        .cfu-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          white-space: nowrap;

          padding: 7px 10px;

          border-radius: 999px;

          font-size: 10px;
          font-weight: 800;
        }

        .cfu-status-follow {
          color: #a16207;
          background: #fff7ed;

          box-shadow:
            inset 0 0 0 1px
            rgba(234, 179, 8, 0.18);
        }

        .cfu-chevron {
          color: #94a3b8;

          transition:
            transform 0.2s ease,
            color 0.2s ease;
        }

        .cfu-item:hover .cfu-chevron {
          color: var(--blue);
        }

        .cfu-item.expanded .cfu-chevron {
          color: var(--blue);
        }

        /* EXPANDED DETAILS */

        .cfu-details {
          padding: 0 16px 18px 70px;
        }

        .cfu-details-inner {
          border-top: 1px solid #edf2f7;

          padding-top: 17px;
        }

        .cfu-details-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 18px;
        }

        .cfu-detail-section {
          min-width: 0;
        }

        .cfu-detail-label {
          margin: 0 0 6px;

          color: #94a3b8;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .cfu-detail-value {
          margin: 0;

          color: var(--navy);

          font-size: 13px;
          font-weight: 700;
          line-height: 1.6;
        }

        .cfu-detail-muted {
          margin: 3px 0 0;

          color: var(--muted);

          font-size: 12px;
          line-height: 1.6;
        }

        .cfu-detail-contact {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .cfu-contact-line {
          display: flex;
          align-items: center;
          gap: 7px;

          color: var(--muted);

          font-size: 12px;
        }

        .cfu-contact-line svg {
          color: #8da1ba;
        }

        .cfu-notes-box {
          margin-top: 18px;

          padding: 14px 15px;

          border: 1px solid #e5edf8;
          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #f8fbff,
              #ffffff
            );
        }

        .cfu-notes-text {
          margin: 0;

          color: #475569;

          font-size: 12px;
          line-height: 1.7;
        }

        /* EMPTY / LOADING */

        .cfu-empty {
          padding: 72px 25px 76px;

          text-align: center;
        }

        .cfu-empty-icon {
          width: 64px;
          height: 64px;

          margin: 0 auto 15px;

          display: grid;
          place-items: center;

          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              #ecfdf5 0%,
              #d1fae5 100%
            );

          color: var(--green);

          box-shadow:
            0 10px 24px
            rgba(15, 159, 110, 0.15);
        }

        .cfu-empty h3 {
          margin: 0;

          color: var(--navy);

          font-size: 18px;
        }

        .cfu-empty p {
          margin: 8px auto 0;

          max-width: 430px;

          color: var(--muted);

          font-size: 13px;
          line-height: 1.7;
        }

        .cfu-loading {
          padding: 72px 25px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 12px;

          text-align: center;

          color: var(--muted);

          font-size: 14px;
          font-weight: 600;
        }

        .cfu-loading-icon {
          animation: cfu-spin 1s linear infinite;
        }

        @keyframes cfu-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* RESPONSIVE */

        @media (max-width: 900px) {
          .cfu-page {
            padding: 22px 16px 32px;
          }

          .cfu-stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .cfu-card-head,
          .cfu-hero {
            align-items: flex-start;
            flex-direction: column;
          }

          .cfu-tools {
            width: 100%;
          }

          .cfu-search {
            flex: 1;
            width: auto;
          }

          .cfu-item-button {
            grid-template-columns:
              minmax(0, 1fr)
              auto
              24px;
          }

          .cfu-item-reason {
            display: none;
          }

          .cfu-details {
            padding-left: 16px;
          }
        }

        @media (max-width: 560px) {
          .cfu-stats {
            grid-template-columns: 1fr;
          }

          .cfu-hero-left {
            gap: 12px;
          }

          .cfu-icon {
            width: 48px;
            height: 48px;
            flex-basis: 48px;
            border-radius: 14px;
          }

          .cfu-title {
            font-size: 30px;
          }

          .cfu-tools {
            flex-direction: column;
            align-items: stretch;
          }

          .cfu-search {
            width: 100%;
          }

          .cfu-count {
            align-self: flex-start;
          }

          .cfu-review {
            width: 100%;
            justify-content: center;
          }

          .cfu-item-button {
            grid-template-columns:
              minmax(0, 1fr)
              auto
              20px;

            gap: 10px;
          }

          .cfu-item-date {
            display: none;
          }

          .cfu-details-grid {
            grid-template-columns: 1fr;
          }

          .cfu-details {
            padding-left: 16px;
          }
        }
      `}</style>

      <div className="cfu-inner">
        {/* HEADER */}

        <header className="cfu-hero">
          <div className="cfu-hero-left">
            <div className="cfu-icon">
              <ClipboardCheck size={25} />
            </div>

            <div>
              <div className="cfu-eyebrow">
                <BellRing size={12} />
                Counselling
              </div>

              <h1 className="cfu-title">Follow-ups</h1>

              <p className="cfu-subtitle">
                Keep track of students who need another counselling session or
                continued attention.
              </p>
            </div>
          </div>

          <button
            className="cfu-review"
            type="button"
            onClick={handleReviewCases}
          >
            Review cases
            <ArrowUpRight size={15} />
          </button>
        </header>

        {/* STAT CARDS */}

        <section className="cfu-stats">
          <StatCard
            label="Total follow-ups"
            value={summary.total}
            icon={<ClipboardCheck size={18} />}
          />

          <StatCard
            label="Students"
            value={summary.students}
            icon={<UsersRound size={18} />}
          />

          <StatCard
            label="Last 7 days"
            value={summary.recent}
            icon={<CalendarClock size={18} />}
          />

          <StatCard
            label="With notes"
            value={summary.withNotes}
            icon={<FileText size={18} />}
          />
        </section>

        {/* FOLLOW-UP CARD */}

        <section className="cfu-card">
          <div className="cfu-card-head">
            <div>
              <h2 className="cfu-heading">Follow-up queue</h2>

              <p className="cfu-heading-sub">
                Students currently requiring follow-up.
              </p>
            </div>

            <div className="cfu-tools">
              <div className="cfu-search">
                <Search size={15} />

                <input
                  type="text"
                  placeholder="Search student or reason..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <span className="cfu-count">
                {filteredRecords.length}{" "}
                {filteredRecords.length === 1 ? "record" : "records"}
              </span>
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="cfu-loading">
              <RefreshCw size={22} className="cfu-loading-icon" />
              Loading follow-ups...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="cfu-empty">
              <div className="cfu-empty-icon">
                <ClipboardCheck size={22} />
              </div>

              <h3>No follow-ups found</h3>

              <p>
                {search
                  ? "Try a different search term."
                  : "There are currently no counselling follow-ups requiring attention."}
              </p>
            </div>
          ) : (
            /* COMPACT FOLLOW-UP LIST */

            <div className="cfu-list">
              {filteredRecords.map((record, index) => {
                const student = record?.student;

                const studentName = getStudentName(student);

                const initials = getInitials(student);

                const recordId = record?._id || `${studentName}-${index}`;

                const isExpanded = expandedRecord === recordId;

                return (
                  <div
                    key={recordId}
                    className={`cfu-item ${isExpanded ? "expanded" : ""}`}
                  >
                    {/* COMPACT ROW */}

                    <button
                      type="button"
                      className="cfu-item-button"
                      onClick={() => toggleRecord(recordId)}
                    >
                      <div className="cfu-item-student">
                        <div className="cfu-avatar">{initials}</div>

                        <div className="cfu-student-info">
                          <span className="cfu-student-name">
                            {studentName}
                          </span>

                          <span className="cfu-student-email">
                            <Mail size={11} />

                            {student?.email || "No email"}
                          </span>
                        </div>
                      </div>

                      <span className="cfu-item-reason">
                        {record?.reason || "No reason provided"}
                      </span>

                      <span className="cfu-item-date">
                        {formatDate(record?.date || record?.createdAt)}
                      </span>

                      <span className="cfu-status cfu-status-follow">
                        Follow-up
                      </span>

                      {isExpanded ? (
                        <ChevronUp size={18} className="cfu-chevron" />
                      ) : (
                        <ChevronDown size={18} className="cfu-chevron" />
                      )}
                    </button>

                    {/* EXPANDED DETAILS */}

                    {isExpanded && (
                      <div className="cfu-details">
                        <div className="cfu-details-inner">
                          <div className="cfu-details-grid">
                            {/* STUDENT */}

                            <div className="cfu-detail-section">
                              <p className="cfu-detail-label">Student</p>

                              <p className="cfu-detail-value">{studentName}</p>

                              {student?.registrationNumber && (
                                <p className="cfu-detail-muted">
                                  Registration: {student.registrationNumber}
                                </p>
                              )}
                            </div>

                            {/* CONTACT */}

                            <div className="cfu-detail-section">
                              <p className="cfu-detail-label">Contact</p>

                              <div className="cfu-detail-contact">
                                <span className="cfu-contact-line">
                                  <Mail size={13} />

                                  {student?.email || "No email"}
                                </span>

                                {student?.phone && (
                                  <span className="cfu-contact-line">
                                    <Phone size={13} />

                                    {student.phone}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* REASON */}

                            <div className="cfu-detail-section">
                              <p className="cfu-detail-label">Reason</p>

                              <p className="cfu-detail-value">
                                {record?.reason || "No reason provided"}
                              </p>
                            </div>

                            {/* DATE */}

                            <div className="cfu-detail-section">
                              <p className="cfu-detail-label">Follow-up date</p>

                              <p className="cfu-detail-value">
                                {formatDate(record?.date || record?.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* NOTES */}

                          <div className="cfu-notes-box">
                            <p className="cfu-detail-label">Notes</p>

                            <p className="cfu-notes-text">
                              {record?.notes ||
                                "No additional notes were added to this counselling record."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="cfu-stat">
      <div className="cfu-stat-top">
        <p className="cfu-stat-label">{label}</p>

        <div className="cfu-stat-icon">{icon}</div>
      </div>

      <h3 className="cfu-stat-number">{value}</h3>
    </div>
  );
}

export default CounsellorFollowups;
