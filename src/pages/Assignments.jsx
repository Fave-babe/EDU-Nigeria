import React, { useEffect, useMemo, useState } from "react";
import "./Pages.css";

import { useNavigate } from "react-router-dom";

import {
  ClipboardList,
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  Send,
  Loader2,
  AlertCircle,
  CalendarDays,
  BookOpen,
  Users,
  Clock,
} from "lucide-react";

import { useAuth } from "../context/authcontext";

import {
  createAssignment,
  getSchoolAssignments,
  updateAssignment,
  deleteAssignment,
} from "../api/assignment.api";

import { teacherApi } from "../api/teacher.api";
import { getMyStudentProfile } from "../api/student.api";

export default function Assignments() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userRole = String(user?.role || "").toLowerCase();
  const isStudent = userRole === "student";
  const isTeacher = userRole === "teacher";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [assignments, setAssignments] = useState([]);

  const [teacherData, setTeacherData] = useState(null);
  const [studentData, setStudentData] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    class: "",
    subject: "",
    title: "",
    description: "",
    instructions: "",
    dueDate: "",
    totalMarks: "",
    status: "draft",
  });

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, [isStudent]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // =================================================
      // STUDENT
      // =================================================

      if (isStudent) {
        const response = await getMyStudentProfile();

        const student =
          response?.data?.student ||
          response?.student ||
          response?.data ||
          null;

        if (!student) {
          throw new Error("Student information was not found.");
        }

        setStudentData(student);

        const schoolId = student?.school?._id;
        const studentClassId = student?.enrollment?.class?._id;

        if (!schoolId) {
          throw new Error("Student school information was not found.");
        }

        if (!studentClassId) {
          setAssignments([]);
          return;
        }

        const assignmentResponse = await getSchoolAssignments(schoolId);

        const schoolAssignments =
          assignmentResponse?.data?.assignments ||
          assignmentResponse?.assignments ||
          [];

        // Only published assignments belonging to
        // the student's class
        const studentAssignments = schoolAssignments.filter((assignment) => {
          const assignmentClassId = assignment?.class?._id || assignment?.class;

          return (
            assignment?.status === "published" &&
            assignmentClassId &&
            String(assignmentClassId) === String(studentClassId)
          );
        });

        setAssignments(studentAssignments);

        return;
      }

      // =================================================
      // TEACHER
      // =================================================

      if (isTeacher) {
        const dashboardResponse = await teacherApi.getDashboard();

        const teacher = dashboardResponse?.teacher;

        setTeacherData(dashboardResponse);

        const schoolId = teacher?.school?._id;

        if (!schoolId) {
          throw new Error("Teacher school information was not found.");
        }

        const assignmentResponse = await getSchoolAssignments(schoolId);

        setAssignments(
          assignmentResponse?.assignments ||
            assignmentResponse?.data?.assignments ||
            [],
        );

        return;
      }

      // =================================================
      // OTHER ROLES
      // =================================================

      setAssignments([]);
    } catch (err) {
      console.error("ASSIGNMENTS LOAD ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load assignments.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // TEACHER INFORMATION
  // =====================================================

  const teacher = teacherData?.teacher;
  const classes = teacherData?.classes || [];
  const subjects = teacherData?.subjects || [];

  // =====================================================
  // STUDENT INFORMATION
  // =====================================================

  const studentClass = studentData?.enrollment?.class;

  const studentClassName =
    studentClass?.name ||
    [studentClass?.level, studentClass?.arm].filter(Boolean).join(" ") ||
    "Class not assigned";

  // =====================================================
  // TEACHER ASSIGNMENTS
  // =====================================================

  const teacherAssignments = useMemo(() => {
    if (!teacher?._id) return [];

    return assignments.filter((assignment) => {
      const assignmentTeacher = assignment?.teacher?._id || assignment?.teacher;

      return String(assignmentTeacher) === String(teacher._id);
    });
  }, [assignments, teacher]);

  // =====================================================
  // STUDENT ASSIGNMENTS
  // =====================================================

  const studentAssignments = useMemo(() => {
    if (!studentClass?._id) return [];

    return assignments.filter((assignment) => {
      const assignmentClassId = assignment?.class?._id || assignment?.class;

      return (
        assignment?.status === "published" &&
        assignmentClassId &&
        String(assignmentClassId) === String(studentClass._id)
      );
    });
  }, [assignments, studentClass]);

  // =====================================================
  // SEARCH
  // =====================================================

  const visibleAssignments = useMemo(() => {
    const source = isStudent ? studentAssignments : teacherAssignments;

    const value = search.toLowerCase().trim();

    if (!value) return source;

    return source.filter((assignment) => {
      return (
        assignment?.title?.toLowerCase().includes(value) ||
        assignment?.subject?.name?.toLowerCase().includes(value) ||
        assignment?.class?.name?.toLowerCase().includes(value) ||
        assignment?.description?.toLowerCase().includes(value)
      );
    });
  }, [isStudent, studentAssignments, teacherAssignments, search]);

  // =====================================================
  // FORM HANDLERS
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      class: "",
      subject: "",
      title: "",
      description: "",
      instructions: "",
      dueDate: "",
      totalMarks: "",
      status: "draft",
    });

    setEditingAssignment(null);
  };

  const openCreateForm = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (assignment) => {
    setEditingAssignment(assignment);

    setForm({
      class: assignment?.class?._id || assignment?.class || "",

      subject: assignment?.subject?._id || assignment?.subject || "",

      title: assignment?.title || "",

      description: assignment?.description || "",

      instructions: assignment?.instructions || "",

      dueDate: assignment?.dueDate
        ? new Date(assignment.dueDate).toISOString().slice(0, 16)
        : "",

      totalMarks: assignment?.totalMarks || "",

      status: assignment?.status || "draft",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =====================================================
  // CREATE / UPDATE ASSIGNMENT
  // =====================================================

  const handleSubmit = async (publish = false) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.class) {
        setError("Please select a class.");
        return;
      }

      if (!form.subject) {
        setError("Please select a subject.");
        return;
      }

      if (!form.title.trim()) {
        setError("Please enter an assignment title.");
        return;
      }

      if (!form.dueDate) {
        setError("Please select a due date.");
        return;
      }

      if (!form.totalMarks || Number(form.totalMarks) < 1) {
        setError("Please enter valid total marks.");
        return;
      }

      const selectedClass = classes.find(
        (item) => String(item.id) === String(form.class),
      );

      const academicSession =
        selectedClass?.academicSession?._id || selectedClass?.academicSession;

      if (!academicSession) {
        setError("Academic session was not found for this class.");
        return;
      }

      if (!teacher?._id) {
        setError("Teacher information was not found.");
        return;
      }

      if (!teacher?.school?._id) {
        setError("School information was not found.");
        return;
      }

      const payload = {
        school: teacher.school._id,

        teacher: teacher._id,

        class: form.class,

        subject: form.subject,

        academicSession,

        title: form.title.trim(),

        description: form.description.trim(),

        instructions: form.instructions.trim(),

        dueDate: form.dueDate,

        totalMarks: Number(form.totalMarks),

        status: publish ? "published" : form.status,
      };

      if (editingAssignment) {
        await updateAssignment(editingAssignment._id, payload);

        setSuccess("Assignment updated successfully.");
      } else {
        await createAssignment(payload);

        setSuccess(
          publish
            ? "Assignment published successfully."
            : "Assignment saved as draft.",
        );
      }

      setShowForm(false);
      resetForm();

      await loadData();
    } catch (err) {
      console.error("ASSIGNMENT SAVE ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save assignment.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteAssignment(id);

      setSuccess("Assignment deleted successfully.");

      await loadData();
    } catch (err) {
      console.error("ASSIGNMENT DELETE ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete assignment.",
      );
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "published":
        return "status-active";

      case "closed":
        return "status-closed";

      default:
        return "status-draft";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="page-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="content-card">
          <div className="empty-state">
            <Loader2 size={40} className="spin" />

            <h2>Loading Assignments...</h2>

            <p>Please wait while your assignments are being loaded.</p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // STUDENT PAGE
  // =====================================================

  if (isStudent) {
    return (
      <div className="page-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="page-header">
          <div>
            <h1>Assignments</h1>

            <p>View assignments given to your class.</p>
          </div>

          <div className="page-header-icon">
            <ClipboardList size={28} />
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <strong>{studentClassName}</strong>

            <div
              style={{
                color: "#666",
                marginTop: "4px",
                fontSize: "14px",
              }}
            >
              {studentAssignments.length}{" "}
              {studentAssignments.length === 1 ? "assignment" : "assignments"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "8px 12px",
              minWidth: "260px",
            }}
          >
            <Search size={18} />

            <input
              type="text"
              placeholder="Search assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                background: "transparent",
              }}
            />
          </div>
        </div>

        <div className="content-card">
          {visibleAssignments.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={48} />

              <h2>No Assignments</h2>

              <p>
                There are no published assignments for your class at the moment.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "15px",
              }}
            >
              {visibleAssignments.map((assignment) => (
                <div
                  key={assignment._id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "20px",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: "0 0 8px",
                        }}
                      >
                        {assignment.title}
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          flexWrap: "wrap",
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <BookOpen size={15} />

                          {assignment.subject?.name || "Subject"}
                        </span>

                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Users size={15} />
                          {assignment.class?.level} {assignment.class?.name}
                          {assignment.class?.arm
                            ? ` (${assignment.class.arm})`
                            : ""}
                        </span>

                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <CalendarDays size={15} />
                          Due:{" "}
                          {assignment.dueDate
                            ? new Date(assignment.dueDate).toLocaleDateString()
                            : "No date"}
                        </span>

                        <span>{assignment.totalMarks} marks</span>
                      </div>
                    </div>

                    <span
                      className={getStatusClass(assignment.status)}
                      style={{
                        textTransform: "capitalize",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                      }}
                    >
                      {assignment.status}
                    </span>
                  </div>

                  {assignment.description && (
                    <p
                      style={{
                        margin: "15px 0 0",
                        color: "#555",
                        lineHeight: 1.6,
                      }}
                    >
                      {assignment.description}
                    </p>
                  )}

                  {assignment.instructions && (
                    <div
                      style={{
                        marginTop: "15px",
                        padding: "12px",
                        background: "#f8fafc",
                        borderRadius: "8px",
                      }}
                    >
                      <strong>Instructions</strong>

                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#555",
                          lineHeight: 1.6,
                        }}
                      >
                        {assignment.instructions}
                      </p>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "15px",
                      color: "#666",
                      fontSize: "13px",
                    }}
                  >
                    <Clock size={15} />
                    Due:{" "}
                    {assignment.dueDate
                      ? new Date(assignment.dueDate).toLocaleString()
                      : "No due date"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =====================================================
  // TEACHER PAGE
  // =====================================================

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="page-header">
        <div>
          <h1>Assignments</h1>

          <p>Create and manage assignments for your students.</p>
        </div>

        <div className="page-header-icon">
          <ClipboardList size={28} />
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && <div className="success-message">{success}</div>}

      {/* TOP ACTIONS */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "8px 12px",
            minWidth: "260px",
          }}
        >
          <Search size={18} />

          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              background: "transparent",
            }}
          />
        </div>

        <button className="primary-button" onClick={openCreateForm}>
          <Plus size={18} />
          Create Assignment
        </button>
      </div>

      {/* ASSIGNMENTS */}

      <div className="content-card">
        {visibleAssignments.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={48} />

            <h2>No Assignments</h2>

            <p>Create your first assignment for your students.</p>

            <button
              className="primary-button"
              onClick={openCreateForm}
              style={{
                marginTop: "15px",
              }}
            >
              <Plus size={18} />
              Create Assignment
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            {visibleAssignments.map((assignment) => (
              <div
                key={assignment._id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "18px",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "15px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: "0 0 8px",
                      }}
                    >
                      {assignment.title}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      <span>
                        <BookOpen size={15} />{" "}
                        {assignment.subject?.name || "Subject"}
                      </span>

                      <span>
                        <Users size={15} /> {assignment.class?.level}{" "}
                        {assignment.class?.name}{" "}
                        {assignment.class?.arm
                          ? `(${assignment.class.arm})`
                          : ""}
                      </span>

                      <span>
                        <CalendarDays size={15} /> Due:{" "}
                        {assignment.dueDate
                          ? new Date(assignment.dueDate).toLocaleDateString()
                          : "No date"}
                      </span>

                      <span>{assignment.totalMarks} marks</span>
                    </div>
                  </div>

                  <span
                    className={getStatusClass(assignment.status)}
                    style={{
                      textTransform: "capitalize",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                    }}
                  >
                    {assignment.status}
                  </span>
                </div>

                {assignment.description && (
                  <p
                    style={{
                      margin: "15px 0 0",
                      color: "#555",
                    }}
                  >
                    {assignment.description}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >
                  <button
                    className="secondary-button"
                    onClick={() => openEditForm(assignment)}
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    className="danger-button"
                    onClick={() => handleDelete(assignment._id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  {editingAssignment ? "Edit Assignment" : "Create Assignment"}
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#666",
                  }}
                >
                  Send an assignment to your class.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* CLASS */}

            <div className="form-group">
              <label>Class *</label>

              <select name="class" value={form.class} onChange={handleChange}>
                <option value="">Select class</option>

                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.level} - {item.name}
                    {item.arm ? ` (${item.arm})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBJECT */}

            <div className="form-group">
              <label>Subject *</label>

              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
              >
                <option value="">Select subject</option>

                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}

                    {subject.code ? ` (${subject.code})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* TITLE */}

            <div className="form-group">
              <label>Assignment Title *</label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. English Grammar Exercise"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the assignment..."
                rows={4}
              />
            </div>

            {/* INSTRUCTIONS */}

            <div className="form-group">
              <label>Instructions</label>

              <textarea
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                placeholder="Tell students what they need to do..."
                rows={4}
              />
            </div>

            {/* DUE DATE */}

            <div className="form-group">
              <label>Due Date *</label>

              <input
                type="datetime-local"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>

            {/* TOTAL MARKS */}

            <div className="form-group">
              <label>Total Marks *</label>

              <input
                type="number"
                name="totalMarks"
                value={form.totalMarks}
                onChange={handleChange}
                min="1"
                placeholder="e.g. 20"
              />
            </div>

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "25px",
                flexWrap: "wrap",
              }}
            >
              <button
                className="secondary-button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="secondary-button"
                onClick={() => handleSubmit(false)}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 size={16} className="spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Draft
              </button>

              <button
                className="primary-button"
                onClick={() => handleSubmit(true)}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 size={16} className="spin" />
                ) : (
                  <Send size={16} />
                )}
                Publish Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
