import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import {
  Search,
  Plus,
  X,
  Loader2,
  FileText,
  CalendarDays,
  UserRound,
  CheckCircle2,
  Clock3,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { getStudentsBySchool } from "../api/student.api";

import {
  getCounsellingRecordsByCounsellor,
  createCounsellingRecord,
  deleteCounsellingRecord,
} from "../api/counsellingRecord.api";

export default function CounsellingRecords() {
  const { user, isCounsellor } = useAuth();

  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  // Controls the dropdown/details section
  const [expandedRecord, setExpandedRecord] = useState(null);

  const [form, setForm] = useState({
    student: "",
    reason: "",
    notes: "",
    status: "active",
  });

  const schoolId = user?.school?._id || user?.school;
  const counsellorId = user?._id || user?.id;

  useEffect(() => {
    if (!user || !isCounsellor(user)) {
      setLoading(false);
      return;
    }

    loadData();
  }, [user, isCounsellor]);

  async function loadData() {
    try {
      setLoading(true);

      if (!schoolId) {
        console.error(
          "COUNSELLING: School ID is missing"
        );

        setStudents([]);
        setRecords([]);

        return;
      }

      if (!counsellorId) {
        console.error(
          "COUNSELLING: Counsellor ID is missing"
        );

        setRecords([]);

        return;
      }

      console.log(
        "COUNSELLING SCHOOL ID:",
        schoolId
      );

      console.log(
        "COUNSELLOR ID:",
        counsellorId
      );

      // ==========================================
      // LOAD STUDENTS
      // ==========================================

      try {
        const studentsResponse =
          await getStudentsBySchool(schoolId);

        console.log(
          "COUNSELLING STUDENTS RESPONSE:",
          studentsResponse
        );

        const studentList =
          studentsResponse?.students ||
          studentsResponse?.data?.students ||
          [];

        console.log(
          "COUNSELLING STUDENT LIST:",
          studentList
        );

        setStudents(
          Array.isArray(studentList)
            ? studentList
            : []
        );
      } catch (studentError) {
        console.error(
          "FAILED TO LOAD COUNSELLING STUDENTS:",
          studentError
        );

        setStudents([]);
      }

      // ==========================================
      // LOAD COUNSELLING RECORDS
      // ==========================================

      try {
        const recordsResponse =
          await getCounsellingRecordsByCounsellor(
            counsellorId
          );

        console.log(
          "COUNSELLING RECORDS RESPONSE:",
          recordsResponse
        );

        const recordList =
          recordsResponse?.records ||
          recordsResponse?.data?.records ||
          [];

        setRecords(
          Array.isArray(recordList)
            ? recordList
            : []
        );
      } catch (recordError) {
        console.error(
          "FAILED TO LOAD COUNSELLING RECORDS:",
          recordError
        );

        setRecords([]);
      }
    } catch (error) {
      console.error(
        "FAILED TO LOAD COUNSELLING DATA:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // FORM CHANGE
  // ==========================================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ==========================================
  // CREATE RECORD
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.student) {
      alert("Please select a student.");
      return;
    }

    if (!form.reason.trim()) {
      alert(
        "Please enter the counselling reason."
      );
      return;
    }

    if (!schoolId) {
      alert("School information is missing.");
      return;
    }

    if (!counsellorId) {
      alert("Counsellor information is missing.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        student: form.student,
        counsellor: counsellorId,
        school: schoolId,
        reason: form.reason.trim(),
        notes: form.notes.trim(),
        status: form.status,
      };

      console.log(
        "CREATING COUNSELLING RECORD:",
        payload
      );

      await createCounsellingRecord(payload);

      setForm({
        student: "",
        reason: "",
        notes: "",
        status: "active",
      });

      setShowModal(false);

      await loadData();
    } catch (error) {
      console.error(
        "FAILED TO CREATE COUNSELLING RECORD:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create counselling record.";

      alert(message);
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // DELETE RECORD
  // ==========================================

  async function handleDelete(recordId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this counselling record?"
    );

    if (!confirmed) return;

    try {
      await deleteCounsellingRecord(recordId);

      setRecords((previous) =>
        previous.filter(
          (record) =>
            record._id !== recordId
        )
      );

      if (expandedRecord === recordId) {
        setExpandedRecord(null);
      }

      alert(
        "Counselling record deleted successfully."
      );
    } catch (error) {
      console.error(
        "FAILED TO DELETE COUNSELLING RECORD:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete counselling record.";

      alert(message);
    }
  }

  // ==========================================
  // FILTER RECORDS
  // ==========================================

  const filteredRecords = records.filter(
    (record) => {
      const student = record.student;

      const studentName =
        `${student?.firstName || ""} ${
          student?.lastName || ""
        }`.trim();

      const registrationNumber =
        student?.registrationNumber || "";

      const searchText =
        search.trim().toLowerCase();

      return (
        studentName
          .toLowerCase()
          .includes(searchText) ||
        registrationNumber
          .toLowerCase()
          .includes(searchText) ||
        record.reason
          ?.toLowerCase()
          .includes(searchText) ||
        record.status
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  // ==========================================
  // AUTH
  // ==========================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isCounsellor(user)) {
    return (
      <Navigate
        to="/Cdashboard"
        replace
      />
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* =====================================
            HEADER
        ====================================== */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Counselling Records
            </h1>

            <p style={styles.subtitle}>
              Manage and track counselling
              sessions for students.
            </p>
          </div>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() =>
              setShowModal(true)
            }
          >
            <Plus size={18} />

            New Record
          </button>
        </div>

        {/* =====================================
            STATISTICS
        ====================================== */}

        <div style={styles.statsGrid}>

          <StatCard
            icon={
              <FileText size={21} />
            }
            label="Total Records"
            value={records.length}
          />

          <StatCard
            icon={
              <Clock3 size={21} />
            }
            label="Active Cases"
            value={
              records.filter(
                (record) =>
                  record.status ===
                  "active"
              ).length
            }
          />

          <StatCard
            icon={
              <CheckCircle2 size={21} />
            }
            label="Resolved"
            value={
              records.filter(
                (record) =>
                  record.status ===
                  "resolved"
              ).length
            }
          />

          <StatCard
            icon={
              <CalendarDays size={21} />
            }
            label="Follow-ups"
            value={
              records.filter(
                (record) =>
                  record.status ===
                  "follow_up"
              ).length
            }
          />

        </div>

        {/* =====================================
            SEARCH
        ====================================== */}

        <div style={styles.toolbar}>
          <div style={styles.searchBox}>

            <Search size={18} />

            <input
              type="text"
              placeholder="Search student, reason or status..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={styles.searchInput}
            />

          </div>
        </div>

        {/* =====================================
            RECORDS TABLE
        ====================================== */}

        <div style={styles.card}>

          {loading ? (
            <div style={styles.loading}>

              <Loader2
                size={28}
                style={{
                  animation:
                    "spin 1s linear infinite",
                }}
              />

              <span>
                Loading counselling records...
              </span>

            </div>
          ) : filteredRecords.length ===
            0 ? (

            <div style={styles.empty}>

              <FileText size={45} />

              <h3>
                No counselling records
              </h3>

              <p>
                Create a counselling record
                when a student receives
                counselling.
              </p>

              <button
                type="button"
                style={styles.primaryButton}
                onClick={() =>
                  setShowModal(true)
                }
              >
                <Plus size={18} />

                Create Record
              </button>

            </div>

          ) : (

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>
                  <tr>

                    <th style={styles.th}>
                      Student
                    </th>

                    <th style={styles.th}>
                      Reason
                    </th>

                    <th style={styles.th}>
                      Date
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                    <th style={styles.th}>
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredRecords.map(
                    (record) => {

                      const student =
                        record.student;

                      const studentName =
                        `${student?.firstName || ""} ${
                          student?.lastName || ""
                        }`.trim() ||
                        "Unknown Student";

                      const isExpanded =
                        expandedRecord ===
                        record._id;

                      return (
                        <React.Fragment
                          key={record._id}
                        >

                          {/* =================================
                              MAIN ROW
                          ================================= */}

                          <tr
                            style={
                              isExpanded
                                ? styles.expandedRow
                                : undefined
                            }
                          >

                            <td style={styles.td}>

                              <div
                                style={
                                  styles.studentCell
                                }
                              >

                                <div
                                  style={
                                    styles.avatar
                                  }
                                >
                                  <UserRound
                                    size={18}
                                  />
                                </div>

                                <div>

                                  <strong>
                                    {studentName}
                                  </strong>

                                  <small>
                                    {student?.registrationNumber ||
                                      student?.email ||
                                      "No registration number"}
                                  </small>

                                </div>

                              </div>

                            </td>

                            <td style={styles.td}>
                              <span
                                style={
                                  styles.reasonText
                                }
                              >
                                {record.reason ||
                                  "-"}
                              </span>
                            </td>

                            <td style={styles.td}>

                              {record.date
                                ? new Date(
                                    record.date
                                  ).toLocaleDateString()
                                : "-"}

                            </td>

                            <td style={styles.td}>

                              <StatusBadge
                                status={
                                  record.status
                                }
                              />

                            </td>

                            <td style={styles.td}>

                              <div
                                style={
                                  styles.actionButtons
                                }
                              >

                                {/* DROPDOWN */}
                                <button
                                  type="button"
                                  style={
                                    styles.detailsButton
                                  }
                                  onClick={() =>
                                    setExpandedRecord(
                                      isExpanded
                                        ? null
                                        : record._id
                                    )
                                  }
                                >

                                  {isExpanded ? (
                                    <ChevronUp
                                      size={16}
                                    />
                                  ) : (
                                    <ChevronDown
                                      size={16}
                                    />
                                  )}

                                  {isExpanded
                                    ? "Hide"
                                    : "Details"}

                                </button>

                                {/* DELETE */}
                                <button
                                  type="button"
                                  style={
                                    styles.deleteButton
                                  }
                                  title="Delete record"
                                  onClick={() =>
                                    handleDelete(
                                      record._id
                                    )
                                  }
                                >
                                  <Trash2
                                    size={16}
                                  />
                                </button>

                              </div>

                            </td>

                          </tr>

                          {/* =================================
                              DROPDOWN DETAILS
                          ================================= */}

                          {isExpanded && (
                            <tr>

                              <td
                                colSpan="5"
                                style={
                                  styles.detailsTd
                                }
                              >

                                <div
                                  style={
                                    styles.detailsPanel
                                  }
                                >

                                  {/* STUDENT INFORMATION */}

                                  <div
                                    style={
                                      styles.detailsSection
                                    }
                                  >

                                    <div
                                      style={
                                        styles.detailsHeading
                                      }
                                    >
                                      <UserRound
                                        size={17}
                                      />

                                      Student
                                      Information
                                    </div>

                                    <div
                                      style={
                                        styles.detailsGrid
                                      }
                                    >

                                      <DetailItem
                                        label="Full Name"
                                        value={
                                          studentName
                                        }
                                      />

                                      <DetailItem
                                        label="Registration Number"
                                        value={
                                          student?.registrationNumber ||
                                          "Not available"
                                        }
                                      />

                                      <DetailItem
                                        label="Email"
                                        value={
                                          student?.email ||
                                          "Not available"
                                        }
                                      />

                                      <DetailItem
                                        label="Phone"
                                        value={
                                          student?.phone ||
                                          "Not available"
                                        }
                                      />

                                      <DetailItem
                                        label="Gender"
                                        value={
                                          student?.gender ||
                                          "Not available"
                                        }
                                      />

                                    </div>

                                  </div>

                                  {/* COUNSELLING INFORMATION */}

                                  <div
                                    style={
                                      styles.detailsSection
                                    }
                                  >

                                    <div
                                      style={
                                        styles.detailsHeading
                                      }
                                    >
                                      <FileText
                                        size={17}
                                      />

                                      Counselling
                                      Information
                                    </div>

                                    <div
                                      style={
                                        styles.detailsGrid
                                      }
                                    >

                                      <DetailItem
                                        label="Reason"
                                        value={
                                          record.reason ||
                                          "No reason provided"
                                        }
                                      />

                                      <DetailItem
                                        label="Date"
                                        value={
                                          record.date
                                            ? new Date(
                                                record.date
                                              ).toLocaleDateString()
                                            : "Not available"
                                        }
                                      />

                                      <DetailItem
                                        label="Status"
                                        value={
                                          record.status
                                            ? formatStatus(
                                                record.status
                                              )
                                            : "Not available"
                                        }
                                      />

                                    </div>

                                  </div>

                                  {/* NOTES */}

                                  <div
                                    style={
                                      styles.notesSection
                                    }
                                  >

                                    <div
                                      style={
                                        styles.detailsHeading
                                      }
                                    >
                                      <FileText
                                        size={17}
                                      />

                                      Counselling
                                      Notes
                                    </div>

                                    <div
                                      style={
                                        styles.notesBox
                                      }
                                    >
                                      {record.notes ||
                                        "No counselling notes have been added."}
                                    </div>

                                  </div>

                                </div>

                              </td>

                            </tr>
                          )}

                        </React.Fragment>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ==========================================
          CREATE RECORD MODAL
      =========================================== */}

      {showModal && (
        <div style={styles.overlay}>

          <div style={styles.modal}>

            <div
              style={styles.modalHeader}
            >

              <div>

                <h2
                  style={
                    styles.modalTitle
                  }
                >
                  New Counselling Record
                </h2>

                <p
                  style={
                    styles.modalSubtitle
                  }
                >
                  Record a counselling
                  session for a student.
                </p>

              </div>

              <button
                type="button"
                style={
                  styles.closeButton
                }
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
            >

              {/* STUDENT */}

              <div
                style={styles.formGroup}
              >

                <label
                  style={styles.label}
                >
                  Student
                </label>

                <select
                  name="student"
                  value={form.student}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >

                  <option value="">
                    Select student
                  </option>

                  {students.length > 0 ? (
                    students.map(
                      (student) => (
                        <option
                          key={student._id}
                          value={student._id}
                        >
                          {student.firstName}{" "}
                          {student.lastName}
                        </option>
                      )
                    )
                  ) : (
                    <option
                      value=""
                      disabled
                    >
                      No students found
                    </option>
                  )}

                </select>

              </div>

              {/* REASON */}

              <div
                style={styles.formGroup}
              >

                <label
                  style={styles.label}
                >
                  Counselling Reason
                </label>

                <input
                  type="text"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Enter reason for counselling"
                  style={styles.input}
                  required
                />

              </div>

              {/* NOTES */}

              <div
                style={styles.formGroup}
              >

                <label
                  style={styles.label}
                >
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Enter counselling notes"
                  rows={5}
                  style={{
                    ...styles.input,
                    resize: "vertical",
                  }}
                />

              </div>

              {/* STATUS */}

              <div
                style={styles.formGroup}
              >

                <label
                  style={styles.label}
                >
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  style={styles.input}
                >

                  <option value="active">
                    Active
                  </option>

                  <option value="follow_up">
                    Follow-up
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>

                </select>

              </div>

              {/* ACTIONS */}

              <div
                style={styles.modalActions}
              >

                <button
                  type="button"
                  style={
                    styles.cancelButton
                  }
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={
                    styles.primaryButton
                  }
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus
                        size={17}
                      />
                      Create Record
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* SPIN ANIMATION */}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

    </div>
  );
}

/* ==========================================
   STAT CARD
========================================== */

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div style={styles.statCard}>

      <div style={styles.statIcon}>
        {icon}
      </div>

      <div>

        <p
          style={styles.statLabel}
        >
          {label}
        </p>

        <h2
          style={styles.statValue}
        >
          {value}
        </h2>

      </div>

    </div>
  );
}

/* ==========================================
   STATUS BADGE
========================================== */

function StatusBadge({
  status,
}) {
  const labels = {
    active: "Active",
    resolved: "Resolved",
    follow_up: "Follow-up",
  };

  return (
    <span
      style={{
        ...styles.statusBadge,
        ...(status === "resolved"
          ? styles.resolvedBadge
          : status === "follow_up"
          ? styles.followupBadge
          : {}),
      }}
    >
      {labels[status] ||
        status ||
        "Unknown"}
    </span>
  );
}

/* ==========================================
   DETAIL ITEM
========================================== */

function DetailItem({
  label,
  value,
}) {
  return (
    <div style={styles.detailItem}>

      <span
        style={
          styles.detailLabel
        }
      >
        {label}
      </span>

      <strong
        style={
          styles.detailValue
        }
      >
        {value}
      </strong>

    </div>
  );
}

/* ==========================================
   FORMAT STATUS
========================================== */

function formatStatus(status) {
  const labels = {
    active: "Active",
    resolved: "Resolved",
    follow_up: "Follow-up",
  };

  return (
    labels[status] ||
    status
  );
}

/* ==========================================
   STYLES
========================================== */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb",
    padding: "32px",
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "28px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 700,
    color: "#071a41",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  primaryButton: {
    border: "none",
    background: "#079b68",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "9px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: 600,
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },

  statCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  statIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#eef7f3",
    color: "#079b68",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
  },

  statValue: {
    margin: "4px 0 0",
    color: "#071a41",
    fontSize: "24px",
  },

  toolbar: {
    marginBottom: "18px",
  },

  searchBox: {
    maxWidth: "500px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 13px",
    color: "#64748b",
  },

  searchInput: {
    border: "none",
    outline: "none",
    padding: "12px 0",
    width: "100%",
    fontSize: "14px",
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "15px 18px",
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#64748b",
    background: "#f8fafc",
    borderBottom:
      "1px solid #e5e7eb",
  },

  td: {
    padding: "16px 18px",
    borderBottom:
      "1px solid #eef2f7",
    fontSize: "14px",
    color: "#334155",
  },

  expandedRow: {
    background: "#f8fafc",
  },

  studentCell: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#eef7f3",
    color: "#079b68",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  reasonText: {
    display: "block",
    maxWidth: "240px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  statusBadge: {
    display: "inline-flex",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#eef7f3",
    color: "#087a55",
    fontSize: "12px",
    fontWeight: 600,
  },

  resolvedBadge: {
    background: "#ecfdf3",
    color: "#047857",
  },

  followupBadge: {
    background: "#fff7ed",
    color: "#c2410c",
  },

  actionButtons: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  detailsButton: {
    border: "1px solid #dbe4ee",
    background: "#fff",
    color: "#334155",
    padding: "7px 10px",
    borderRadius: "7px",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
  },

  deleteButton: {
    border: "1px solid #fecaca",
    background: "#fff",
    color: "#dc2626",
    width: "34px",
    height: "34px",
    borderRadius: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  detailsTd: {
    padding: 0,
    background: "#f8fafc",
    borderBottom:
      "1px solid #e5e7eb",
  },

  detailsPanel: {
    padding: "22px 28px 25px",
    borderTop:
      "1px solid #e5e7eb",
  },

  detailsSection: {
    marginBottom: "20px",
  },

  detailsHeading: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#071a41",
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: "14px",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },

  detailItem: {
    background: "#fff",
    border:
      "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "12px",
  },

  detailLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "5px",
  },

  detailValue: {
    display: "block",
    color: "#1e293b",
    fontSize: "13px",
    fontWeight: 600,
    wordBreak: "break-word",
  },

  notesSection: {
    marginTop: "5px",
  },

  notesBox: {
    background: "#fff",
    border:
      "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "14px",
    color: "#475569",
    fontSize: "13px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  loading: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "#64748b",
  },

  empty: {
    minHeight: "330px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    color: "#64748b",
    textAlign: "center",
    padding: "30px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000,
  },

  modal: {
    width: "100%",
    maxWidth: "560px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: "14px",
    padding: "24px",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.18)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },

  modalTitle: {
    margin: 0,
    color: "#071a41",
    fontSize: "21px",
  },

  modalSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  closeButton: {
    border: "none",
    background: "#f1f5f9",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#475569",
  },

  formGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border:
      "1px solid #dbe2ea",
    borderRadius: "8px",
    padding: "11px 12px",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "25px",
  },

  cancelButton: {
    border:
      "1px solid #dbe2ea",
    background: "#fff",
    color: "#475569",
    padding: "11px 17px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
};