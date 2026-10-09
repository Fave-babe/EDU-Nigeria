import React, { useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  X,
  BookOpen,
  GraduationCap,
  Users,
  Layers,
  LoaderCircle,
} from "lucide-react";

import http from "../api/http";
import { classApi } from "../api/class.api";
import { classSubjectApi } from "../api/classSubject.api";
import "./ClassSubjects.css";

const SCHOOL_ID = "6a8485d60293d305ecd84878";
const ACADEMIC_SESSION_ID = "6aa71820239080fa23f5f8eb";

const INITIAL_FORM = {
  academicSession: ACADEMIC_SESSION_ID,
  class: "",
  subject: "",
  teacher: "",
  isCompulsory: false,
};

export default function ClassSubjects() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ ...INITIAL_FORM });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        subjectsResponse,
        teachersResponse,
        classesResponse,
      ] = await Promise.all([
        http.get(`/subject/school/${SCHOOL_ID}`),
        http.get(`/teacher/school/${SCHOOL_ID}`),
        classApi.getClasses(
          SCHOOL_ID,
          ACADEMIC_SESSION_ID
        ),
      ]);

      const schoolSubjects =
        subjectsResponse?.data?.subjects ||
        subjectsResponse?.subjects ||
        [];

      const schoolTeachers =
        teachersResponse?.data?.teachers ||
        teachersResponse?.teachers ||
        [];

      const schoolClasses =
        classesResponse?.data?.classes ||
        classesResponse?.classes ||
        [];

      setSubjects(
        Array.isArray(schoolSubjects)
          ? schoolSubjects
          : []
      );

      setTeachers(
        Array.isArray(schoolTeachers)
          ? schoolTeachers
          : []
      );

      setClasses(
        (Array.isArray(schoolClasses)
          ? schoolClasses
          : []
        ).filter((item) => {
          const itemSchool =
            item.school?._id || item.school;

          return (
            !itemSchool ||
            String(itemSchool) === SCHOOL_ID
          );
        })
      );
    } catch (err) {
      console.error(
        "Failed to load class subject data:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load classes, subjects, and teachers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const openForm = () => {
    setForm({ ...INITIAL_FORM });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setForm({ ...INITIAL_FORM });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.class ||
      !form.subject ||
      !form.teacher
    ) {
      setError(
        "Please select a class, subject, and teacher."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response =
        await classSubjectApi.createClassSubject({
          school: SCHOOL_ID,
          academicSession: form.academicSession,
          class: form.class,
          subject: form.subject,
          teacher: form.teacher,
          isCompulsory: form.isCompulsory,
        });

      console.log(
        "CLASS SUBJECT CREATED:",
        response
      );

      setSuccess("Subject assigned successfully.");
      setForm({ ...INITIAL_FORM });
      setShowForm(false);

      await loadData();
    } catch (err) {
      console.error(
        "Failed to create class subject:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to assign subject. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="class-subjects-page">
      {/* PAGE HEADER */}
      <header className="cs-header">
        <div className="cs-header-content">
          <div className="cs-header-icon">
            <BookOpen size={27} />
          </div>

          <div>
            <h1>Class Subjects</h1>
            <p>
              Organise subjects and assign teachers
              to your school classes.
            </p>
          </div>
        </div>

        <div className="cs-header-actions">
          <button
            type="button"
            className="cs-btn cs-btn-secondary"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={
                loading ? "cs-spinner" : ""
              }
            />
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            className="cs-btn cs-btn-primary"
            onClick={openForm}
          >
            <Plus size={17} />
            Assign Subject
          </button>
        </div>
      </header>

      {/* NOTIFICATIONS */}
      {error && (
        <div
          role="alert"
          style={{
            padding: "13px 16px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #fecaca",
            background: "#fff1f2",
            color: "#b91c1c",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          style={{
            padding: "13px 16px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #bbf7d0",
            background: "#f0fdf4",
            color: "#15803d",
            fontSize: "13px",
          }}
        >
          {success}
        </div>
      )}

      {/* SUMMARY */}
      <section className="cs-summary-grid">
        <div className="cs-summary-card">
          <div className="cs-summary-icon navy">
            <Layers size={23} />
          </div>

          <div>
            <div className="cs-summary-label">
              Total Classes
            </div>
            <div className="cs-summary-value">
              {loading ? "—" : classes.length}
            </div>
          </div>
        </div>

        <div className="cs-summary-card">
          <div className="cs-summary-icon">
            <BookOpen size={23} />
          </div>

          <div>
            <div className="cs-summary-label">
              Available Subjects
            </div>
            <div className="cs-summary-value">
              {loading ? "—" : subjects.length}
            </div>
          </div>
        </div>

        <div className="cs-summary-card">
          <div className="cs-summary-icon purple">
            <Users size={23} />
          </div>

          <div>
            <div className="cs-summary-label">
              Available Teachers
            </div>
            <div className="cs-summary-value">
              {loading ? "—" : teachers.length}
            </div>
          </div>
        </div>
      </section>

      {/* ASSIGN SUBJECT FORM */}
      {showForm && (
        <section className="cs-form-panel">
          <div className="cs-form-header">
            <div className="cs-form-title">
              <div className="cs-form-title-icon">
                <GraduationCap size={23} />
              </div>

              <div>
                <h2>Assign a Subject</h2>
                <p>
                  Choose a class, subject, and teacher
                  for this academic session.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="cs-close-btn"
              onClick={closeForm}
              disabled={saving}
              aria-label="Close form"
            >
              <X size={19} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="cs-form-grid">
              <div className="cs-form-group">
                <label htmlFor="class">
                  Select Class *
                </label>

                <select
                  id="class"
                  name="class"
                  value={form.class}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Choose a class
                  </option>

                  {classes.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                      {item.level
                        ? ` - ${item.level}`
                        : ""}
                      {item.arm
                        ? ` ${item.arm}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cs-form-group">
                <label htmlFor="subject">
                  Select Subject *
                </label>

                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Choose a subject
                  </option>

                  {subjects.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                      {item.code
                        ? ` (${item.code})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cs-form-group">
                <label htmlFor="teacher">
                  Assign Teacher *
                </label>

                <select
                  id="teacher"
                  name="teacher"
                  value={form.teacher}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Choose a teacher
                  </option>

                  {teachers.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.firstName} {item.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="cs-checkbox-row">
              <input
                type="checkbox"
                name="isCompulsory"
                checked={form.isCompulsory}
                onChange={handleChange}
              />

              <span className="cs-checkbox-text">
                <strong>
                  Compulsory subject
                </strong>
                <span>
                  Mark this subject as required for
                  students in the selected class.
                </span>
              </span>
            </label>

            <div className="cs-form-actions">
              <button
                type="button"
                className="cs-btn cs-btn-secondary"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="cs-btn cs-btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="cs-spinner"
                    />
                    Assigning...
                  </>
                ) : (
                  <>
                    <BookOpen size={16} />
                    Assign Subject
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* AVAILABLE CLASSES */}
      <section className="cs-section">
        <div className="cs-section-heading">
          <div>
            <h2>Available Classes</h2>
            <p>
              Classes available for subject assignment.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="cs-state">
            <div className="cs-state-icon">
              <LoaderCircle
                size={25}
                className="cs-spinner"
              />
            </div>
            <h3>Loading classes</h3>
            <p>
              Fetching your school's class information.
            </p>
          </div>
        ) : classes.length === 0 ? (
          <div className="cs-state">
            <div className="cs-state-icon">
              <GraduationCap size={26} />
            </div>
            <h3>No classes found</h3>
            <p>
              There are currently no classes available
              for this school.
            </p>
          </div>
        ) : (
          <div className="cs-class-grid">
            {classes.map((item) => (
              <article
                className="cs-class-card"
                key={item._id}
              >
                <div className="cs-class-card-top">
                  <div className="cs-class-icon">
                    <GraduationCap size={24} />
                  </div>

                  <span className="cs-class-label">
                    Class
                  </span>
                </div>

                <h3>{item.name}</h3>

                <div className="cs-class-details">
                  <div className="cs-class-detail">
                    <span>Level</span>
                    <strong>
                      {item.level || "Not specified"}
                    </strong>
                  </div>

                  <div className="cs-class-detail">
                    <span>Arm</span>
                    <strong>
                      {item.arm || "Not specified"}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}