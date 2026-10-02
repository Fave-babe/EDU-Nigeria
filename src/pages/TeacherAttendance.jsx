
import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock3,
  CircleAlert,
  Users,
  RefreshCw,
  Save,
  Search,
} from "lucide-react";

import { teacherApi } from "../api/teacher.api";
import {
  getClassAttendance,
  recordAttendance,
  updateAttendance,
} from "../api/attendance.api";

import "./TeacherAttendance.css";

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [classes, setClasses] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================================================
  // LOAD TEACHER STUDENTS
  // =========================================================

  const loadStudents = async () => {
    try {
      setError("");

      const response = await teacherApi.getStudents();

      console.log(
        "TEACHER ATTENDANCE STUDENTS RESPONSE:",
        JSON.stringify(response, null, 2)
      );

      const teacherStudents = response?.students || [];

      setStudents(teacherStudents);

      // Build unique classes from assigned students
      const uniqueClasses = new Map();

      teacherStudents.forEach((item) => {
        if (!item.class?._id) return;

        uniqueClasses.set(item.class._id, item.class);
      });

      const teacherClasses = Array.from(uniqueClasses.values());

      setClasses(teacherClasses);

      // Select first class automatically
      if (!selectedClass && teacherClasses.length > 0) {
        setSelectedClass(teacherClasses[0]._id);
      }
    } catch (err) {
      console.error("Teacher attendance students error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load your students"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // =========================================================
  // SELECTED CLASS STUDENTS
  // =========================================================

  const classStudents = useMemo(() => {
    if (!selectedClass) return [];

    return students.filter(
      (item) => item.class?._id === selectedClass
    );
  }, [students, selectedClass]);

  // =========================================================
  // FILTER STUDENTS
  // =========================================================

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return classStudents;

    return classStudents.filter((item) => {
      const student = item.student;

      const name =
        `${student?.firstName || ""} ${
          student?.lastName || ""
        }`
          .trim()
          .toLowerCase();

      const registrationNumber =
        student?.registrationNumber?.toLowerCase() || "";

      return (
        name.includes(query) ||
        registrationNumber.includes(query)
      );
    });
  }, [classStudents, search]);

  // =========================================================
  // ACADEMIC SESSION
  // =========================================================

  const getAcademicSession = (item) => {
    return (
      item?.academicSession?._id ||
      item?.academicSession ||
      item?.session?._id ||
      item?.session ||
      null
    );
  };

  // =========================================================
  // LOAD EXISTING ATTENDANCE
  // =========================================================

  const loadAttendance = async () => {
    if (!selectedClass) {
      setAttendance({});
      return;
    }

    try {
      setLoadingAttendance(true);
      setError("");
      setMessage("");

      const response = await getClassAttendance(
        selectedClass,
        selectedDate
      );

      console.log(
        "CLASS ATTENDANCE RESPONSE:",
        JSON.stringify(response, null, 2)
      );

      const records = response?.attendance || [];

      const attendanceMap = {};

      records.forEach((record) => {
        const studentId =
          record?.student?._id || record?.student;

        if (!studentId) return;

        attendanceMap[studentId] = {
          status: record.status,
          remark: record.remark || "",
          attendanceId: record._id,
        };
      });

      setAttendance(attendanceMap);
    } catch (err) {
      console.error("Load attendance error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load attendance"
      );

      setAttendance({});
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [selectedClass, selectedDate]);

  // =========================================================
  // CHANGE STATUS
  // =========================================================

  const handleStatusChange = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: {
        ...(previous[studentId] || {}),
        status,
      },
    }));
  };

  // =========================================================
  // CHANGE REMARK
  // =========================================================

  const handleRemarkChange = (studentId, remark) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: {
        ...(previous[studentId] || {}),
        remark,
      },
    }));
  };

  // =========================================================
  // SAVE ATTENDANCE
  // =========================================================

  const handleSaveAttendance = async () => {
    if (!selectedClass) {
      setError("Please select a class.");
      return;
    }

    if (classStudents.length === 0) {
      setError("There are no students in this class.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      /*
       * Save one attendance record per student.
       *
       * Existing records are updated.
       * New records are created.
       */

      for (const item of classStudents) {
        const student = item.student;

        if (!student?._id) continue;

        const studentAttendance =
          attendance[student._id];

        if (!studentAttendance?.status) continue;

        const academicSession =
          getAcademicSession(item);

        if (!academicSession) {
          throw new Error(
            `Academic session is missing for ${student.firstName || "student"}.`
          );
        }

        if (studentAttendance.attendanceId) {
          await updateAttendance(
            studentAttendance.attendanceId,
            {
              status: studentAttendance.status,
              remark: studentAttendance.remark || "",
            }
          );
        } else {
          await recordAttendance({
            school:
              item.school?._id ||
              item.school ||
              student.school?._id ||
              student.school,

            student: student._id,

            class: selectedClass,

            academicSession,

            date: selectedDate,

            status: studentAttendance.status,

            remark: studentAttendance.remark || "",
          });
        }
      }

      setMessage("Attendance saved successfully.");

      await loadAttendance();
    } catch (err) {
      console.error("Save attendance error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save attendance"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadStudents();

    if (selectedClass) {
      await loadAttendance();
    }
  };

  // =========================================================
  // COUNTS
  // =========================================================

  const attendanceCounts = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    classStudents.forEach((item) => {
      const status =
        attendance[item.student?._id]?.status;

      if (status === "present") present++;
      if (status === "absent") absent++;
      if (status === "late") late++;
      if (status === "excused") excused++;
    });

    return {
      present,
      absent,
      late,
      excused,
    };
  }, [classStudents, attendance]);

  // =========================================================
  // STUDENT NAME
  // =========================================================

  const getStudentName = (student) => {
    return (
      `${student?.firstName || ""} ${
        student?.lastName || ""
      }`.trim() || "Student"
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="teacher-attendance-page">
      {/* HEADER */}

      <section className="teacher-attendance-header">
        <div>
          <div className="teacher-attendance-title">
            <div className="teacher-attendance-title-icon">
              <CalendarDays size={24} />
            </div>

            <div>
              <h1>Attendance</h1>

              <p>
                Record and manage attendance for your
                students.
              </p>
            </div>
          </div>
        </div>

        <button
          className="teacher-attendance-refresh"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "spinning" : ""}
          />

          Refresh
        </button>
      </section>

      {/* ERROR */}

      {error && (
        <div className="teacher-attendance-error">
          <CircleAlert size={20} />

          <div>
            <strong>Attendance Error</strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      {/* SUCCESS */}

      {message && (
        <div className="teacher-attendance-success">
          <CheckCircle2 size={20} />

          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="teacher-attendance-loading">
          <div className="teacher-attendance-spinner"></div>

          <p>Loading your students...</p>
        </div>
      ) : (
        <>
          {/* CONTROLS */}

          <section className="teacher-attendance-controls">
            <div className="attendance-control">
              <label>Class</label>

              <select
                value={selectedClass}
                onChange={(e) =>
                  setSelectedClass(e.target.value)
                }
              >
                <option value="">
                  Select class
                </option>

                {classes.map((classItem) => (
                  <option
                    key={classItem._id}
                    value={classItem._id}
                  >
                    {classItem.name}

                    {classItem.arm
                      ? ` - Arm ${classItem.arm}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="attendance-control">
              <label>Date</label>

              <div className="attendance-date-input">
                <CalendarDays size={17} />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="attendance-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>
          </section>

          {/* SUMMARY */}

          <section className="teacher-attendance-summary">
            <div className="attendance-summary-card">
              <div className="attendance-summary-icon total">
                <Users size={20} />
              </div>

              <div>
                <span>Total Students</span>

                <strong>{classStudents.length}</strong>
              </div>
            </div>

            <div className="attendance-summary-card">
              <div className="attendance-summary-icon present">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <span>Present</span>

                <strong>
                  {attendanceCounts.present}
                </strong>
              </div>
            </div>

            <div className="attendance-summary-card">
              <div className="attendance-summary-icon absent">
                <XCircle size={20} />
              </div>

              <div>
                <span>Absent</span>

                <strong>
                  {attendanceCounts.absent}
                </strong>
              </div>
            </div>

            <div className="attendance-summary-card">
              <div className="attendance-summary-icon late">
                <Clock3 size={20} />
              </div>

              <div>
                <span>Late</span>

                <strong>
                  {attendanceCounts.late}
                </strong>
              </div>
            </div>

            <div className="attendance-summary-card">
              <div className="attendance-summary-icon excused">
                <CircleAlert size={20} />
              </div>

              <div>
                <span>Excused</span>

                <strong>
                  {attendanceCounts.excused}
                </strong>
              </div>
            </div>
          </section>

          {/* ATTENDANCE TABLE */}

          <section className="teacher-attendance-card">
            <div className="teacher-attendance-card-header">
              <div>
                <h2>Mark Attendance</h2>

                <p>
                  {filteredStudents.length} student
                  {filteredStudents.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              <button
                className="teacher-attendance-save"
                onClick={handleSaveAttendance}
                disabled={
                  saving ||
                  loadingAttendance ||
                  classStudents.length === 0
                }
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : "Save Attendance"}
              </button>
            </div>

            {loadingAttendance ? (
              <div className="teacher-attendance-loading">
                <div className="teacher-attendance-spinner"></div>

                <p>Loading attendance...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="teacher-attendance-empty">
                <div className="teacher-attendance-empty-icon">
                  <Users size={30} />
                </div>

                <h3>
                  {classStudents.length === 0
                    ? "No students in this class"
                    : "No students found"}
                </h3>

                <p>
                  {classStudents.length === 0
                    ? "Students assigned to this class will appear here."
                    : "Try changing your search."}
                </p>
              </div>
            ) : (
              <div className="teacher-attendance-table-wrapper">
                <table className="teacher-attendance-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Registration No.</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Late</th>
                      <th>Excused</th>
                      <th>Remark</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map((item) => {
                      const student = item.student;

                      if (!student) return null;

                      const studentId = student._id;

                      const currentStatus =
                        attendance[studentId]?.status;

                      return (
                        <tr key={item._id || studentId}>
                          <td>
                            <div className="attendance-student">
                              <div className="attendance-avatar">
                                {getStudentName(
                                  student
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {getStudentName(
                                    student
                                  )}
                                </strong>

                                <span>
                                  {student.email ||
                                    "No email"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            {student.registrationNumber ||
                              "—"}
                          </td>

                          <td>
                            <button
                              className={`attendance-status-btn present ${
                                currentStatus ===
                                "present"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                handleStatusChange(
                                  studentId,
                                  "present"
                                )
                              }
                            >
                              <CheckCircle2
                                size={16}
                              />

                              Present
                            </button>
                          </td>

                          <td>
                            <button
                              className={`attendance-status-btn absent ${
                                currentStatus ===
                                "absent"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                handleStatusChange(
                                  studentId,
                                  "absent"
                                )
                              }
                            >
                              <XCircle size={16} />

                              Absent
                            </button>
                          </td>

                          <td>
                            <button
                              className={`attendance-status-btn late ${
                                currentStatus === "late"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                handleStatusChange(
                                  studentId,
                                  "late"
                                )
                              }
                            >
                              <Clock3 size={16} />

                              Late
                            </button>
                          </td>

                          <td>
                            <button
                              className={`attendance-status-btn excused ${
                                currentStatus ===
                                "excused"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                handleStatusChange(
                                  studentId,
                                  "excused"
                                )
                              }
                            >
                              <CircleAlert size={16} />

                              Excused
                            </button>
                          </td>

                          <td>
                            <input
                              type="text"
                              className="attendance-remark"
                              placeholder="Optional"
                              value={
                                attendance[studentId]
                                  ?.remark || ""
                              }
                              onChange={(e) =>
                                handleRemarkChange(
                                  studentId,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

