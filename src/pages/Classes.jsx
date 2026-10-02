import React, { useEffect, useState } from "react";

import {
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  Loader2,
  GraduationCap,
  Plus,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { classApi } from "../api/class.api";
import { teacherApi } from "../api/teacher.api";
import { academicSessionApi } from "../api/academicSession.api";
import { getStudents } from "../api/student.api";
import { enrollmentApi } from "../api/enrollement.api";
import "../pages/Classes.css";

function Classes() {
  const { user } = useAuth();

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");

  const [showEnrollmentModal, setShowEnrollmentModal] =
  useState(false);

const [selectedClass, setSelectedClass] = useState(null);
const [selectedStudent, setSelectedStudent] = useState("");
const [enrolling, setEnrolling] = useState(false);
const [enrollmentError, setEnrollmentError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    level: "",
    arm: "A",
    academicSession: "",
    capacity: 40,
  });

  const schoolId =
    user?.school?._id ||
    user?.school?.id ||
    user?.school;

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!schoolId) {
        setError("School information not found.");
        return;
      }

     const [
  classesResponse,
  teachersResponse,
  sessionsResponse,
  studentsResponse,
] = await Promise.all([
  classApi.getClasses(schoolId),
  teacherApi.getTeachersBySchool(schoolId),
  academicSessionApi.getSessionsBySchool(schoolId),
  getStudents(),
]);

      console.log("CLASSES RESPONSE:", classesResponse);
      console.log("TEACHERS RESPONSE:", teachersResponse);
      console.log("SESSIONS RESPONSE:", sessionsResponse);
      console.log("STUDENTS RESPONSE:", studentsResponse);
      setStudents(studentsResponse?.students || []);
      setClasses(classesResponse?.classes || []);
      setTeachers(teachersResponse?.teachers || []);
      setSessions(sessionsResponse?.sessions || []);

      const currentSession =
        sessionsResponse?.sessions?.find(
          (session) => session.isCurrent
        );

      if (currentSession) {
        setFormData((current) => ({
          ...current,
          academicSession: currentSession._id,
        }));
      }
    } catch (err) {
      console.error("Failed to load classes:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load classes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolId) {
      loadData();
    }
  }, [schoolId]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateClass = async (event) => {
    event.preventDefault();

    try {
      setCreating(true);
      setCreateError("");

      if (!schoolId) {
        setCreateError("School information not found.");
        return;
      }

      if (!formData.academicSession) {
        setCreateError("Please select an academic session.");
        return;
      }

      if (!formData.name.trim()) {
        setCreateError("Please enter the class name.");
        return;
      }

      if (!formData.level.trim()) {
        setCreateError("Please enter the class level.");
        return;
      }

      const response = await classApi.createClass({
        school: schoolId,
        academicSession: formData.academicSession,
        name: formData.name.trim(),
        level: formData.level.trim(),
        arm: formData.arm.trim() || "A",
        capacity: Number(formData.capacity) || 40,
      });

      console.log("CREATE CLASS RESPONSE:", response);

      const newClass = response?.class;

      if (newClass) {
        setClasses((currentClasses) => [
          newClass,
          ...currentClasses,
        ]);
      } else {
        await loadData();
      }

      setFormData((current) => ({
        ...current,
        name: "",
        level: "",
        arm: "A",
        capacity: 40,
      }));

      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create class:", err);

      setCreateError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create class."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleAssignTeacher = async (
    classId,
    teacherId
  ) => {
    try {
      setAssigning(classId);

      if (!teacherId) {
        await classApi.removeTeacher(classId);

        setClasses((currentClasses) =>
          currentClasses.map((item) =>
            item._id === classId
              ? {
                  ...item,
                  classTeacher: null,
                }
              : item
          )
        );

        return;
      }

      const response =
        await classApi.assignTeacher(
          classId,
          teacherId
        );

      console.log(
        "ASSIGN TEACHER RESPONSE:",
        response
      );

      const updatedClass = response?.class;

      setClasses((currentClasses) =>
        currentClasses.map((item) =>
          item._id === classId
            ? {
                ...item,
                classTeacher:
                  updatedClass?.classTeacher ||
                  teachers.find(
                    (teacher) =>
                      teacher._id === teacherId
                  ),
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Failed to assign teacher:",
        err
      );

      alert(
        err.message ||
          "Failed to assign teacher."
      );
    } finally {
      setAssigning(null);
    }
  };

  const handleEnrollStudent = async () => {
    if (!selectedClass || !selectedStudent) {
      setEnrollmentError("Please select a student.");
      return;
    }

    try {
      setEnrolling(true);
      setEnrollmentError("");

      const academicSession =
        selectedClass.academicSession?._id ||
        selectedClass.academicSession;

      await enrollmentApi.createEnrollment({
        school: schoolId,
        student: selectedStudent,
        academicSession,
        class: selectedClass._id,
        enrollmentDate: new Date().toISOString().split("T")[0],
      });

      setShowEnrollmentModal(false);
      setSelectedClass(null);
      setSelectedStudent("");
      setEnrollmentError("");

      await loadData();
    } catch (err) {
      console.error("ENROLL STUDENT ERROR:", err);

      setEnrollmentError(
        err.response?.data?.message ||
          err.message ||
          "Failed to enroll student."
      );
    } finally {
      setEnrolling(false);
    }
  };

  const assignedClasses = classes.filter(
    (item) => item.classTeacher
  ).length;

  const unassignedClasses =
    classes.length - assignedClasses;

  return (
    <div className="classes-page">

      {/* HEADER */}
      <div className="classes-header">
        <div>
          <h1 className="classes-title">
            Classes
          </h1>

          <p className="classes-subtitle">
            Manage school classes and assign class teachers.
          </p>
        </div>

        <div className="classes-header-actions">
          <button
            className="classes-refresh-btn"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            className="classes-create-btn"
            onClick={() => {
              setCreateError("");
              setShowCreateModal(true);
            }}
          >
            <Plus size={18} />
            Create Class
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="classes-summary">

        <div className="classes-summary-card">
          <div className="classes-summary-content">
            <p>Total Classes</p>
            <h2>{classes.length}</h2>
          </div>

          <div className="classes-summary-icon blue">
            <GraduationCap size={22} />
          </div>
        </div>

        <div className="classes-summary-card">
          <div className="classes-summary-content">
            <p>Assigned Teachers</p>
            <h2>{assignedClasses}</h2>
          </div>

          <div className="classes-summary-icon green">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="classes-summary-card">
          <div className="classes-summary-content">
            <p>Unassigned Classes</p>
            <h2>{unassignedClasses}</h2>
          </div>

          <div className="classes-summary-icon orange">
            <UserX size={22} />
          </div>
        </div>

      </div>

      {/* CONTENT */}
      <div className="classes-container">

        {loading ? (
          <div className="classes-loading">
            <Loader2
              size={32}
              className="classes-loader"
            />
            <p>Loading classes...</p>
          </div>
        ) : error ? (
          <div className="classes-error">
            {error}
          </div>
        ) : classes.length === 0 ? (
          <div className="classes-empty">
            <GraduationCap
              size={45}
              className="classes-empty-icon"
            />

            <h3>
              No classes found
            </h3>

            <p>
              There are no classes registered for this school yet.
            </p>

            <button
              className="classes-empty-btn"
              onClick={() => {
                setCreateError("");
                setShowCreateModal(true);
              }}
            >
              <Plus size={18} />
              Create Your First Class
            </button>
          </div>
        ) : (
          <div className="classes-table-wrapper">

            <table className="classes-table">

              <thead>
                <tr>
                  <th>Class</th>
                  <th>Level</th>
                  <th>Arm</th>
                  <th>Class Teacher</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {classes.map((schoolClass) => {

                  const currentTeacher =
                    schoolClass.classTeacher?._id ||
                    schoolClass.classTeacher ||
                    "";

                  return (
                    <tr key={schoolClass._id}>

                      <td>
                        <div className="class-name">

                          <div className="class-icon">
                            <GraduationCap size={19} />
                          </div>

                          <div>
                            <strong>
                              {schoolClass.name}
                            </strong>

                            <span>
                              {schoolClass.academicSession?.name ||
                                "Current Session"}
                            </span>
                          </div>

                        </div>
                      </td>

                      <td>
                        {schoolClass.level || "N/A"}
                      </td>

                      <td>
                        {schoolClass.arm || "A"}
                      </td>

                      <td>

                        <select
                          className="teacher-select"
                          value={currentTeacher}
                          disabled={
                            assigning === schoolClass._id
                          }
                          onChange={(event) =>
                            handleAssignTeacher(
                              schoolClass._id,
                              event.target.value
                            )
                          }
                        >

                          <option value="">
                            Select Teacher
                          </option>

                          {teachers.map((teacher) => (
                            <option
                              key={teacher._id}
                              value={teacher._id}
                            >
                              {teacher.firstName}{" "}
                              {teacher.lastName}
                            </option>
                          ))}

                        </select>

                        {assigning === schoolClass._id && (
                          <div className="assigning-text">
                            <Loader2
                              size={14}
                              className="classes-loader"
                            />
                            Saving...
                          </div>
                        )}

                      </td>

                      <td>

                        {schoolClass.isActive !== false ? (
                          <span className="class-status active">
                            Active
                          </span>
                        ) : (
                          <span className="class-status inactive">
                            Inactive
                          </span>
                        )}

                      </td>

                      <td>
                        <button
                          type="button"
                          className="class-enroll-btn"
                          onClick={() => {
                            setSelectedClass(schoolClass);
                            setSelectedStudent("");
                            setEnrollmentError("");
                            setShowEnrollmentModal(true);
                          }}
                        >
                          <Users size={16} />
                          Enroll Student
                        </button>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* CREATE CLASS MODAL */}
      {showCreateModal && (
        <div className="class-modal-overlay">

          <div className="class-modal">

            <div className="class-modal-header">

              <div>
                <h2>Create Class</h2>

                <p>
                  Add a new class for this school.
                </p>
              </div>

              <button
                className="class-modal-close"
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="class-form"
              onSubmit={handleCreateClass}
            >

              {createError && (
                <div className="class-form-error">
                  {createError}
                </div>
              )}

              <div className="class-form-group">

                <label>
                  Academic Session
                </label>

                <select
                  name="academicSession"
                  value={formData.academicSession}
                  onChange={handleFormChange}
                  required
                >

                  <option value="">
                    Select Academic Session
                  </option>

                  {sessions.map((session) => (
                    <option
                      key={session._id}
                      value={session._id}
                    >
                      {session.name}
                      {session.isCurrent
                        ? " (Current)"
                        : ""}
                    </option>
                  ))}

                </select>

              </div>

              <div className="class-form-row">

                <div className="class-form-group">

                  <label>
                    Class Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. JSS 1"
                    required
                  />

                </div>

                <div className="class-form-group">

                  <label>
                    Level
                  </label>

                  <input
                    type="text"
                    name="level"
                    value={formData.level}
                    onChange={handleFormChange}
                    placeholder="e.g. JSS 1"
                    required
                  />

                </div>

              </div>

              <div className="class-form-row">

                <div className="class-form-group">

                  <label>
                    Arm
                  </label>

                  <input
                    type="text"
                    name="arm"
                    value={formData.arm}
                    onChange={handleFormChange}
                    placeholder="A"
                  />

                </div>

                <div className="class-form-group">

                  <label>
                    Capacity
                  </label>

                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleFormChange}
                    min="1"
                  />

                </div>

              </div>

              <div className="class-form-actions">

                <button
                  type="button"
                  className="class-cancel-btn"
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  disabled={creating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="class-submit-btn"
                  disabled={creating}
                >

                  {creating ? (
                    <>
                      <Loader2
                        size={17}
                        className="classes-loader"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create Class
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ENROLL STUDENT MODAL */}
      {showEnrollmentModal && selectedClass && (
        <div className="class-modal-overlay">
          <div className="class-modal">

            <div className="class-modal-header">
              <div>
                <h2>Enroll Student</h2>
                <p>
                  Add a student to {" "}
                  <strong>
                    {selectedClass.name} {selectedClass.level} {selectedClass.arm}
                  </strong>
                </p>
              </div>

              <button
                className="class-modal-close"
                onClick={() => {
                  setShowEnrollmentModal(false);
                  setSelectedClass(null);
                  setSelectedStudent("");
                  setEnrollmentError("");
                }}
                disabled={enrolling}
              >
                <X size={20} />
              </button>
            </div>

            <div className="class-form">
              {enrollmentError && (
                <div className="class-form-error">
                  {enrollmentError}
                </div>
              )}

              <div className="class-form-group">
                <label>Student</label>

                <select
                  value={selectedStudent}
                  onChange={(event) =>
                    setSelectedStudent(event.target.value)
                  }
                  disabled={enrolling}
                >
                  <option value="">Select Student</option>

                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="class-form-actions">
                <button
                  type="button"
                  className="class-cancel-btn"
                  onClick={() => {
                    setShowEnrollmentModal(false);
                    setSelectedClass(null);
                    setSelectedStudent("");
                    setEnrollmentError("");
                  }}
                  disabled={enrolling}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="class-submit-btn"
                  onClick={handleEnrollStudent}
                  disabled={enrolling || !selectedStudent}
                >
                  {enrolling ? (
                    <>
                      <Loader2 size={17} className="classes-loader" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Users size={17} />
                      Enroll Student
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Classes;