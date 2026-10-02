import React, { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  RefreshCw,
  X,
  Save,
  Eye,
  Trash2,
  BookOpen,
  CalendarDays,
  Users,
  AlertCircle,
} from "lucide-react";

import { teacherApi } from "../api/teacher.api";

import "./LessonNotes.css";

export default function LessonNotes() {
  const [students, setStudents] = useState([]);
  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    className: "",
    date: "",
    content: "",
  });

  // =========================================================
  // LOAD TEACHER STUDENTS
  // =========================================================

  const loadStudents = async () => {
    try {
      setError("");

      const response = await teacherApi.getStudents();

      console.log(
        "LESSON NOTES TEACHER STUDENTS RESPONSE:",
        response
      );

      const teacherStudents = response?.students || [];

      setStudents(teacherStudents);
    } catch (err) {
      console.error("LESSON NOTES STUDENTS ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load your students."
      );
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await loadStudents();

      setLoading(false);
    };

    loadData();
  }, []);

  // =========================================================
  // GET TEACHER CLASSES
  // =========================================================

  const classes = useMemo(() => {
    const classMap = new Map();

    students.forEach((student) => {
      const studentClass = student?.class;

      if (!studentClass) return;

      const classId =
        studentClass?._id || studentClass;

      const className =
        studentClass?.name ||
        studentClass?.level ||
        "Unnamed Class";

      if (classId && !classMap.has(classId)) {
        classMap.set(classId, {
          id: classId,
          name: className,
        });
      }
    });

    return Array.from(classMap.values());
  }, [students]);

  // =========================================================
  // FILTER STUDENTS
  // =========================================================

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const studentClass = student?.class;

      const classId =
        studentClass?._id || studentClass;

      const fullName = `${student?.firstName || ""} ${
        student?.lastName || ""
      }`.trim();

      const matchesClass =
        selectedClass === "all" ||
        classId === selectedClass;

      const matchesSearch =
        !search ||
        fullName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        student?.registrationNumber
          ?.toLowerCase()
          .includes(search.toLowerCase());

      return matchesClass && matchesSearch;
    });
  }, [students, selectedClass, search]);

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError("");
      setMessage("");

      await loadStudents();

      setMessage("Lesson notes data refreshed.");
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  // =========================================================
  // FORM INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // OPEN CREATE FORM
  // =========================================================

  const openCreateForm = () => {
    setSelectedNote(null);

    setFormData({
      title: "",
      subject: "",
      className:
        selectedClass !== "all"
          ? classes.find(
              (item) => item.id === selectedClass
            )?.name || ""
          : "",
      date: new Date().toISOString().split("T")[0],
      content: "",
    });

    setShowForm(true);
    setError("");
    setMessage("");
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const closeForm = () => {
    setShowForm(false);
    setSelectedNote(null);
  };

  // =========================================================
  // SAVE NOTE
  // =========================================================

  const handleSave = (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!formData.title.trim()) {
      setError("Please enter a lesson note title.");
      return;
    }

    if (!formData.subject.trim()) {
      setError("Please enter the subject.");
      return;
    }

    if (!formData.className.trim()) {
      setError("Please select or enter a class.");
      return;
    }

    if (!formData.date) {
      setError("Please select a date.");
      return;
    }

    if (!formData.content.trim()) {
      setError("Please enter the lesson note content.");
      return;
    }

    const newNote = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);

    setMessage("Lesson note saved successfully.");

    setShowForm(false);

    setFormData({
      title: "",
      subject: "",
      className: "",
      date: "",
      content: "",
    });
  };

  // =========================================================
  // VIEW NOTE
  // =========================================================

  const handleView = (note) => {
    setSelectedNote(note);
  };

  // =========================================================
  // DELETE NOTE
  // =========================================================

  const handleDelete = (noteId) => {
    setNotes((prev) =>
      prev.filter((note) => note.id !== noteId)
    );

    setMessage("Lesson note deleted.");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="lesson-notes-page">
        <div className="lesson-notes-loading">
          <RefreshCw size={28} className="spin" />
          <p>Loading lesson notes...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="lesson-notes-page">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="lesson-notes-header">
        <div>
          <div className="page-title-row">
            <div className="page-icon">
              <FileText size={24} />
            </div>

            <div>
              <h1>Lesson Notes</h1>
              <p>
                Create and manage your lesson notes.
              </p>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              size={18}
              className={refreshing ? "spin" : ""}
            />
            Refresh
          </button>

          <button
            className="create-note-btn"
            onClick={openCreateForm}
          >
            <Plus size={18} />
            New Lesson Note
          </button>
        </div>
      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {error && (
        <div className="lesson-message error">
          <AlertCircle size={18} />
          <span>{error}</span>

          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {message && (
        <div className="lesson-message success">
          <span>{message}</span>

          <button onClick={() => setMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="lesson-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FileText size={21} />
          </div>

          <div>
            <span>Total Notes</span>
            <strong>{notes.length}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Users size={21} />
          </div>

          <div>
            <span>My Students</span>
            <strong>{students.length}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <BookOpen size={21} />
          </div>

          <div>
            <span>My Classes</span>
            <strong>{classes.length}</strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="lesson-filters">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={selectedClass}
          onChange={(e) =>
            setSelectedClass(e.target.value)
          }
        >
          <option value="all">All Classes</option>

          {classes.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* =====================================================
          NOTES AREA
      ===================================================== */}

      <div className="lesson-notes-content">
        {notes.length === 0 ? (
          <div className="empty-notes">
            <div className="empty-icon">
              <FileText size={34} />
            </div>

            <h3>No Lesson Notes Yet</h3>

            <p>
              You haven't created any lesson notes yet.
            </p>

            <button
              className="create-note-btn"
              onClick={openCreateForm}
            >
              <Plus size={18} />
              Create Your First Lesson Note
            </button>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div
                className="lesson-note-card"
                key={note.id}
              >
                <div className="note-card-header">
                  <div className="note-icon">
                    <FileText size={20} />
                  </div>

                  <button
                    className="delete-note-btn"
                    onClick={() =>
                      handleDelete(note.id)
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <h3>{note.title}</h3>

                <div className="note-meta">
                  <span>
                    <BookOpen size={15} />
                    {note.subject}
                  </span>

                  <span>
                    <Users size={15} />
                    {note.className}
                  </span>

                  <span>
                    <CalendarDays size={15} />
                    {note.date}
                  </span>
                </div>

                <p className="note-preview">
                  {note.content.length > 140
                    ? `${note.content.substring(
                        0,
                        140
                      )}...`
                    : note.content}
                </p>

                <button
                  className="view-note-btn"
                  onClick={() =>
                    handleView(note)
                  }
                >
                  <Eye size={17} />
                  View Note
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          CREATE NOTE MODAL
      ===================================================== */}

      {showForm && (
        <div className="lesson-modal-overlay">
          <div className="lesson-modal">
            <div className="modal-header">
              <div>
                <h2>New Lesson Note</h2>
                <p>
                  Create a lesson note for your class.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeForm}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Lesson Title</label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Introduction to Algebra"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>

                  <input
                    type="text"
                    name="subject"
                    placeholder="e.g. Mathematics"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Class</label>

                  {classes.length > 0 ? (
                    <select
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select class
                      </option>

                      {classes.map((item) => (
                        <option
                          key={item.id}
                          value={item.name}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="className"
                      placeholder="Enter class"
                      value={formData.className}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Lesson Date</label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Lesson Note</label>

                <textarea
                  name="content"
                  rows="10"
                  placeholder="Write your lesson note here..."
                  value={formData.content}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-note-btn"
                >
                  <Save size={18} />
                  Save Lesson Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW NOTE MODAL
      ===================================================== */}

      {selectedNote && (
        <div className="lesson-modal-overlay">
          <div className="lesson-modal view-modal">
            <div className="modal-header">
              <div>
                <h2>{selectedNote.title}</h2>

                <p>
                  {selectedNote.subject} •{" "}
                  {selectedNote.className} •{" "}
                  {selectedNote.date}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedNote(null)
                }
              >
                <X size={21} />
              </button>
            </div>

            <div className="full-note-content">
              {selectedNote.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}