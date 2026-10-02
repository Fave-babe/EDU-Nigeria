import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  GraduationCap,
  User,
  Mail,
  Phone,
  Eye,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";

import { teacherApi } from "../api/teacher.api";

import "./TeacherStudents.css";

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // =========================================================
  // LOAD STUDENTS
  // =========================================================

  const loadStudents = async () => {
    try {
      setError("");

      const response = await teacherApi.getStudents();

alert(JSON.stringify(response, null, 2));

console.log("TEACHER STUDENTS RAW RESPONSE:", response);

console.log(
  "TEACHER STUDENTS RESPONSE:",
  JSON.stringify(response, null, 2)
);

setStudents(response?.students || []);
    } catch (err) {
      console.error("Teacher students error:", err);

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
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    setRefreshing(true);
    loadStudents();
  };

  // =========================================================
  // CLASSES
  // =========================================================

  const classes = useMemo(() => {
    const uniqueClasses = new Map();

    students.forEach((item) => {
      if (!item.class?._id) return;

      uniqueClasses.set(item.class._id, item.class);
    });

    return Array.from(uniqueClasses.values());
  }, [students]);

  // =========================================================
  // FILTER STUDENTS
  // =========================================================

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((item) => {
      const student = item.student;
      const classInfo = item.class;

      if (!student) return false;

      const fullName =
        `${student.firstName || ""} ${student.lastName || ""}`
          .trim()
          .toLowerCase();

      const registrationNumber =
        student.registrationNumber?.toLowerCase() || "";

      const email = student.email?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        registrationNumber.includes(query) ||
        email.includes(query);

      const matchesClass =
        selectedClass === "all" ||
        classInfo?._id === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [students, search, selectedClass]);

  // =========================================================
  // STUDENT NAME
  // =========================================================

  const getStudentName = (student) => {
    return (
      `${student?.firstName || ""} ${student?.lastName || ""}`.trim() ||
      "Student"
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="teacher-students-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="teacher-students-header">
        <div>
          <div className="teacher-students-title-row">
            <div className="teacher-students-title-icon">
              <GraduationCap size={24} />
            </div>

            <div>
              <h1>My Students</h1>
              <p>
                View and manage students assigned to your classes.
              </p>
            </div>
          </div>
        </div>

        <button
          className="teacher-students-refresh"
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

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="teacher-students-error">
          <AlertCircle size={20} />

          <div>
            <strong>Unable to load students</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="teacher-students-loading">
          <div className="teacher-students-spinner"></div>
          <p>Loading your students...</p>
        </div>
      ) : (
        <>
          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="teacher-students-summary">

            <div className="teacher-students-summary-card">
              <div className="summary-icon blue">
                <Users size={21} />
              </div>

              <div>
                <span>Total Students</span>
                <strong>{students.length}</strong>
              </div>
            </div>

            <div className="teacher-students-summary-card">
              <div className="summary-icon green">
                <GraduationCap size={21} />
              </div>

              <div>
                <span>My Classes</span>
                <strong>{classes.length}</strong>
              </div>
            </div>

            <div className="teacher-students-summary-card">
              <div className="summary-icon orange">
                <User size={21} />
              </div>

              <div>
                <span>Showing</span>
                <strong>{filteredStudents.length}</strong>
              </div>
            </div>

          </section>

          {/* =================================================
              FILTERS
          ================================================= */}

          <section className="teacher-students-toolbar">

            <div className="teacher-students-search">
              <Search size={19} />

              <input
                type="text"
                placeholder="Search by name, registration number or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="teacher-students-clear-search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="teacher-students-class-filter"
            >
              <option value="all">All Classes</option>

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

          </section>

          {/* =================================================
              STUDENTS TABLE
          ================================================= */}

          <section className="teacher-students-card">

            <div className="teacher-students-card-header">
              <div>
                <h2>Students</h2>
                <p>
                  {filteredStudents.length} student
                  {filteredStudents.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="teacher-students-empty">

                <div className="teacher-students-empty-icon">
                  <Users size={30} />
                </div>

                <h3>
                  {students.length === 0
                    ? "No students assigned"
                    : "No students found"}
                </h3>

                <p>
                  {students.length === 0
                    ? "Students enrolled in your assigned classes will appear here."
                    : "Try changing your search or class filter."}
                </p>

              </div>
            ) : (
              <div className="teacher-students-table-wrapper">

                <table className="teacher-students-table">

                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Registration No.</th>
                      <th>Class</th>
                      <th>Gender</th>
                      <th>Contact</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map((item) => {
                      const student = item.student;
                      const classInfo = item.class;

                      const name = getStudentName(student);

                      return (
                        <tr key={item._id}>

                          <td>
                            <div className="student-table-name">

                              <div className="student-avatar">
                                {name.charAt(0).toUpperCase()}
                              </div>

                              <div>
                                <strong>{name}</strong>

                                <span>
                                  {student.email || "No email"}
                                </span>
                              </div>

                            </div>
                          </td>

                          <td>
                            {student.registrationNumber || "—"}
                          </td>

                          <td>
                            <div className="student-class">
                              <strong>
                                {classInfo?.name || "—"}
                              </strong>

                              {classInfo?.arm && (
                                <span>
                                  Arm {classInfo.arm}
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            {student.gender || "—"}
                          </td>

                          <td>
                            <div className="student-contact">

                              {student.phone ? (
                                <span>
                                  <Phone size={14} />
                                  {student.phone}
                                </span>
                              ) : student.email ? (
                                <span>
                                  <Mail size={14} />
                                  {student.email}
                                </span>
                              ) : (
                                "—"
                              )}

                            </div>
                          </td>

                          <td>
                            <button
                              className="student-view-btn"
                              onClick={() =>
                                setSelectedStudent(item)
                              }
                            >
                              <Eye size={16} />
                              View
                            </button>
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

      {/* =====================================================
          STUDENT DETAILS MODAL
      ===================================================== */}

      {selectedStudent && (
        <div
          className="teacher-student-modal-overlay"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="teacher-student-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="teacher-student-modal-header">
              <div>
                <h2>Student Details</h2>
                <p>Student information</p>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="teacher-student-modal-close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="teacher-student-profile">

              <div className="teacher-student-profile-avatar">
                {getStudentName(
                  selectedStudent.student
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h3>
                {getStudentName(selectedStudent.student)}
              </h3>

              <p>
                {selectedStudent.student.email ||
                  "No email available"}
              </p>

            </div>

            <div className="teacher-student-details">

              <div>
                <span>Registration Number</span>
                <strong>
                  {selectedStudent.student
                    .registrationNumber || "—"}
                </strong>
              </div>

              <div>
                <span>Class</span>
                <strong>
                  {selectedStudent.class?.name || "—"}
                  {selectedStudent.class?.arm
                    ? ` - Arm ${selectedStudent.class.arm}`
                    : ""}
                </strong>
              </div>

              <div>
                <span>Gender</span>
                <strong>
                  {selectedStudent.student.gender || "—"}
                </strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>
                  {selectedStudent.student.phone || "—"}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {selectedStudent.student.email || "—"}
                </strong>
              </div>

              <div>
                <span>Enrollment Status</span>
                <strong>
                  {selectedStudent.status || "—"}
                </strong>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}