import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

import { classApi } from "../api/class.api";
import { getSchoolSubjects } from "../api/subject.api";
import { timetableApi } from "../api/timetable.api";
import { teacherApi } from "../api/teacher.api";
import { getMyStudentProfile } from "../api/student.api";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const ACADEMIC_SESSION_ID = "6aa71820239080fa23f5f8eb";

export default function Timetable() {
  const { user } = useAuth();

  const role = user?.role?.toLowerCase();

  const canManage = [
    "admin",
    "super_admin",
    "teacher",
  ].includes(role);

  const isStudent = role === "student";

  const [entries, setEntries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    classId: "",
    day: "Monday",
    startTime: "08:00",
    endTime: "08:45",
    subjectId: "",
    teacherId: "",
    room: "",
  });

  const schoolId =
    user?.school?._id ||
    user?.school?.id ||
    user?.school;

  /*
   * =========================================================
   * LOAD INITIAL DATA
   * =========================================================
   */

  useEffect(() => {
    loadInitialData();
  }, [schoolId, role]);

  /*
   * =========================================================
   * LOAD INITIAL DATA
   * =========================================================
   */

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * STUDENT
       */

      if (isStudent) {
        console.log(
          "STUDENT TIMETABLE: loading profile..."
        );

        const response =
          await getMyStudentProfile();

        console.log(
          "STUDENT TIMETABLE PROFILE RESPONSE:",
          response
        );

        const studentData =
          response?.student ||
          response?.data?.student ||
          response?.data ||
          null;

        console.log(
          "STUDENT TIMETABLE STUDENT:",
          studentData
        );

        const classId =
          studentData?.enrollment?.class?._id;

        console.log(
          "STUDENT TIMETABLE CLASS ID:",
          classId
        );

        if (!classId) {
          setError(
            "Your class information is missing."
          );
          return;
        }

        setSelectedClass(classId);

        setForm((prev) => ({
          ...prev,
          classId,
        }));

        await loadTimetable(classId);

        return;
      }

      /*
       * ADMIN / SUPER ADMIN / TEACHER
       */

      if (!schoolId) {
        setError(
          "School information is missing."
        );
        return;
      }

      const [
        classResponse,
        subjectResponse,
        teacherResponse,
      ] = await Promise.all([
        classApi.getClasses(
          schoolId,
          ACADEMIC_SESSION_ID
        ),

        getSchoolSubjects(schoolId),

        teacherApi.getTeachersBySchool(
          schoolId
        ),
      ]);

      console.log(
        "TIMETABLE CLASSES:",
        classResponse
      );

      console.log(
        "TIMETABLE SUBJECTS:",
        subjectResponse
      );

      console.log(
        "TIMETABLE TEACHERS:",
        teacherResponse
      );

      const classData =
        classResponse?.classes ||
        classResponse?.data ||
        [];

      const subjectData =
        subjectResponse?.subjects ||
        subjectResponse?.data ||
        [];

      const teacherData =
        teacherResponse?.teachers ||
        teacherResponse?.data ||
        [];

      setClasses(
        Array.isArray(classData)
          ? classData
          : []
      );

      setSubjects(
        Array.isArray(subjectData)
          ? subjectData
          : []
      );

      setTeachers(
        Array.isArray(teacherData)
          ? teacherData
          : []
      );

      if (classData.length > 0) {
        const firstClassId =
          classData[0]._id ||
          classData[0].id;

        setSelectedClass(firstClassId);

        setForm((prev) => ({
          ...prev,
          classId: firstClassId,
        }));

        await loadTimetable(
          firstClassId
        );
      }
    } catch (err) {
      console.error(
        "Failed to load timetable data:",
        err
      );

      setError(
        err?.message ||
          "Failed to load timetable data."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * LOAD CLASS TIMETABLE
   * =========================================================
   */

  const loadTimetable = async (classId) => {
    try {
      setError("");

      const response =
        await timetableApi.getClassTimetable(
          classId,
          ACADEMIC_SESSION_ID
        );

      console.log(
        "TIMETABLE RESPONSE:",
        response
      );

      const timetableData =
        response?.timetable ||
        response?.data?.timetable ||
        [];

      setEntries(
        Array.isArray(timetableData)
          ? timetableData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load timetable:",
        err
      );

      setError(
        err?.message ||
          "Failed to load timetable."
      );

      setEntries([]);
    }
  };

  /*
   * =========================================================
   * CLASS CHANGE
   * =========================================================
   */

  const handleClassChange = (e) => {
    const classId = e.target.value;

    setSelectedClass(classId);

    setForm((prev) => ({
      ...prev,
      classId,
    }));
  };

  /*
   * =========================================================
   * CREATE TIMETABLE
   * =========================================================
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!schoolId) {
        setError(
          "School information is missing."
        );
        return;
      }

      if (!form.classId) {
        setError(
          "Please select a class."
        );
        return;
      }

      if (!form.subjectId) {
        setError(
          "Please select a subject."
        );
        return;
      }

      if (!form.teacherId) {
        setError(
          "Please select a teacher."
        );
        return;
      }

      const payload = {
        school: schoolId,
        class: form.classId,
        subject: form.subjectId,
        teacher: form.teacherId,
        academicSession:
          ACADEMIC_SESSION_ID,
        day: form.day,
        startTime: form.startTime,
        endTime: form.endTime,
        room: form.room,
      };

      console.log(
        "CREATING TIMETABLE:",
        payload
      );

      await timetableApi.createTimetable(
        payload
      );

      setSuccess(
        "Timetable entry created successfully."
      );

      setShowForm(false);

      setForm({
        classId: selectedClass,
        day: "Monday",
        startTime: "08:00",
        endTime: "08:45",
        subjectId: "",
        teacherId: "",
        room: "",
      });

      await loadTimetable(
        selectedClass
      );
    } catch (err) {
      console.error(
        "Failed to create timetable:",
        err
      );

      setError(
        err?.message ||
          "Failed to create timetable entry."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================================================
   * FILTER BY DAY
   * =========================================================
   */

  const entriesForDay = (day) => {
    return entries
      .filter(
        (entry) => entry.day === day
      )
      .sort((a, b) =>
        (a.startTime || "").localeCompare(
          b.startTime || ""
        )
      );
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div className="page">
        <Header
          title="Timetable"
          subtitle={
            isStudent
              ? "View your class timetable"
              : "Create and manage class timetables"
          }
        />

        <p>Loading timetable...</p>
      </div>
    );
  }

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <div className="page">
      <Header
        title="Timetable"
        subtitle={
          isStudent
            ? "View your class timetable"
            : "Create and manage class timetables"
        }
      />

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="page-actions">
        {!isStudent && (
          <div
            className="form-group"
            style={{
              minWidth: "220px",
              margin: 0,
            }}
          >
            <label>Class</label>

            <select
              value={selectedClass}
              onChange={handleClassChange}
            >
              <option value="">
                Select Class
              </option>

              {classes.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                  {item.arm
                    ? ` (${item.arm})`
                    : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {canManage && (
          <button
            className="btn-primary"
            onClick={() => {
              setSuccess("");
              setError("");
              setShowForm(true);
            }}
          >
            + Add Period
          </button>
        )}
      </div>

      {showForm && canManage && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowForm(false)
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2>
              Add Timetable Period
            </h2>

            <form
              onSubmit={handleSubmit}
              className="form-grid"
            >
              <div className="form-group">
                <label>Class</label>

                <select
                  required
                  value={form.classId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      classId:
                        e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select Class
                  </option>

                  {classes.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                      {item.arm
                        ? ` (${item.arm})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Day</label>

                <select
                  value={form.day}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      day: e.target.value,
                    })
                  }
                >
                  {DAYS.map((day) => (
                    <option
                      key={day}
                      value={day}
                    >
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subject</label>

                <select
                  required
                  value={form.subjectId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subjectId:
                        e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select Subject
                  </option>

                  {subjects.map(
                    (subject) => (
                      <option
                        key={subject._id}
                        value={
                          subject._id
                        }
                      >
                        {subject.name}
                        {subject.code
                          ? ` (${subject.code})`
                          : ""}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Teacher</label>

                <select
                  required
                  value={form.teacherId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      teacherId:
                        e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select Teacher
                  </option>

                  {teachers.map(
                    (teacher) => (
                      <option
                        key={teacher._id}
                        value={
                          teacher._id
                        }
                      >
                        {teacher.firstName}{" "}
                        {teacher.lastName}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Start Time
                </label>

                <input
                  type="time"
                  required
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startTime:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  End Time
                </label>

                <input
                  type="time"
                  required
                  value={form.endTime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      endTime:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group full-width">
                <label>Room</label>

                <input
                  type="text"
                  value={form.room}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      room: e.target.value,
                    })
                  }
                  placeholder="e.g. Classroom 1"
                />
              </div>

              <div className="form-actions full-width">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="timetable-grid">
        {DAYS.map((day) => {
          const dayEntries =
            entriesForDay(day);

          return (
            <div
              key={day}
              className="timetable-day"
            >
              <h3>{day}</h3>

              {dayEntries.length === 0 ? (
                <p className="empty-day">
                  No periods
                </p>
              ) : (
                dayEntries.map(
                  (entry) => (
                    <div
                      key={entry._id}
                      className="timetable-period"
                    >
                      <div className="period-time">
                        {entry.startTime} -{" "}
                        {entry.endTime}
                      </div>

                      <div className="period-subject">
                        {entry.subject
                          ?.name ||
                          "Subject"}
                      </div>

                      <div className="period-meta">
                        {entry.subject
                          ?.code
                          ? `${entry.subject.code} • `
                          : ""}

                        {entry.teacher
                          ? `${entry.teacher.firstName || ""} ${
                              entry.teacher.lastName || ""
                            }`.trim()
                          : "Teacher not assigned"}

                        {entry.room
                          ? ` • ${entry.room}`
                          : ""}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}