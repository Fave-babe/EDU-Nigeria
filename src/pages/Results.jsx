import React, { useEffect, useState } from "react";
import {
  FileText,
  GraduationCap,
  Plus,
  Send,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import http from "../api/http";
import "./Pages.css";

export default function Results() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [selectedClass, setSelectedClass] = useState("");

  const [form, setForm] = useState({
    student: "",
    subject: "",
    class: "",
    academicSession: "",
    term: "First Term",
    caScore: "",
    examScore: "",
  });

  const getSchoolId = () => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("Edu-Nigeria_user") || "{}"
      );

      return (
        storedUser?.school?._id ||
        storedUser?.school ||
        storedUser?.user?.school?._id ||
        storedUser?.user?.school ||
        null
      );
    } catch (err) {
      console.error("FAILED TO READ USER:", err);
      return null;
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const schoolId = getSchoolId();

      if (!schoolId) {
        throw new Error("School information could not be found.");
      }

      const [
        studentResponse,
        subjectResponse,
        classResponse,
        sessionResponse,
      ] = await Promise.all([
        http.get(`/student/school/${schoolId}`),
        http.get(`/subject/school/${schoolId}`),
        http.get(`/class/school/${schoolId}`),
        http.get(`/academic-sessions/school/${schoolId}`),
      ]);

      console.log("STUDENTS:", studentResponse);
      console.log("SUBJECTS:", subjectResponse);
      console.log("CLASSES:", classResponse);
      console.log("SESSIONS:", sessionResponse);

      setStudents(studentResponse.students || []);
      setSubjects(subjectResponse.subjects || []);
      setClasses(classResponse.classes || []);
      setSessions(sessionResponse.sessions || []);
    } catch (err) {
      console.error("RESULT DATA ERROR:", err);
      setError(err.message || "Failed to load result data.");
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async (classId) => {
    if (!classId) {
      setResults([]);
      return;
    }

    try {
      const response = await http.get(`/results/class/${classId}`, {
        params: {
          academicSession: form.academicSession || undefined,
          term: form.term,
        },
      });

      console.log("CLASS RESULTS RESPONSE:", response);

      setResults(response.results || []);
    } catch (err) {
      console.error("LOAD RESULTS ERROR:", err);
      setResults([]);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadResults(selectedClass);
    }
  }, [selectedClass, form.academicSession, form.term]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "class") {
      setSelectedClass(value);
    }
  };

  const createResult = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const schoolId = getSchoolId();

      if (!schoolId) {
        throw new Error("School information could not be found.");
      }

      if (!form.student) {
        throw new Error("Please select a student.");
      }

      if (!form.subject) {
        throw new Error("Please select a subject.");
      }

      if (!form.class) {
        throw new Error("Please select a class.");
      }

      if (!form.academicSession) {
        throw new Error("Please select an academic session.");
      }

      const caScore = Number(form.caScore);
      const examScore = Number(form.examScore);

      if (caScore < 0 || caScore > 40) {
        throw new Error("CA score must be between 0 and 40.");
      }

      if (examScore < 0 || examScore > 60) {
        throw new Error("Exam score must be between 0 and 60.");
      }

      const response = await http.post("/results", {
        school: schoolId,
        student: form.student,
        subject: form.subject,
        class: form.class,
        academicSession: form.academicSession,
        term: form.term,
        caScore,
        examScore,
      });

      console.log("RESULT CREATED:", response);

      setSuccess(
        "Result created successfully. You can now publish it."
      );

      setShowForm(false);

      const createdClass = form.class;

      setForm({
        student: "",
        subject: "",
        class: createdClass,
        academicSession: form.academicSession,
        term: form.term,
        caScore: "",
        examScore: "",
      });

      setSelectedClass(createdClass);

      await loadResults(createdClass);
    } catch (err) {
      console.error("CREATE RESULT ERROR:", err);
      setError(err.message || "Failed to create result.");
    } finally {
      setSaving(false);
    }
  };

  const publishResult = async (resultId) => {
    try {
      setPublishing(resultId);
      setError("");
      setSuccess("");

      await http.patch(`/results/${resultId}/publish`);

      setSuccess("Result published successfully.");

      await loadResults(selectedClass);
    } catch (err) {
      console.error("PUBLISH RESULT ERROR:", err);
      setError(err.message || "Failed to publish result.");
    } finally {
      setPublishing(null);
    }
  };

  const openCreateForm = () => {
    setError("");
    setSuccess("");

    setForm({
      student: "",
      subject: "",
      class: selectedClass || "",
      academicSession: form.academicSession || "",
      term: form.term || "First Term",
      caScore: "",
      examScore: "",
    });

    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <RefreshCw size={36} className="spin" />
          <h2>Loading Results...</h2>
          <p>Please wait while result data is loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Results</h1>
          <p>Manage student academic results and performance.</p>
        </div>

        <div className="page-header-icon">
          <GraduationCap size={28} />
        </div>
      </div>

      {error && (
        <div className="content-card">
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>

            <button onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="content-card">
          <div className="success-message">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="content-card">
        <div className="results-toolbar">
          <div>
            <h2>Academic Results</h2>
            <p>Create, review and publish student results.</p>
          </div>

          <button
            className="primary-button"
            onClick={openCreateForm}
          >
            <Plus size={18} />
            Add Result
          </button>
        </div>

        <div className="results-filters">
          <div className="form-group">
            <label>Class</label>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select class</option>

              {classes.map((schoolClass) => (
                <option
                  key={schoolClass._id}
                  value={schoolClass._id}
                >
                  {schoolClass.name}
                  {schoolClass.level
                    ? ` - ${schoolClass.level}`
                    : ""}
                  {schoolClass.arm
                    ? ` ${schoolClass.arm}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Academic Session</label>

            <select
              name="academicSession"
              value={form.academicSession}
              onChange={handleChange}
            >
              <option value="">All sessions</option>

              {sessions.map((session) => (
                <option key={session._id} value={session._id}>
                  {session.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Term</label>

            <select
              name="term"
              value={form.term}
              onChange={handleChange}
            >
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Third Term">Third Term</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="content-card">
          <div className="results-form-header">
            <div>
              <h2>Create Result</h2>
              <p>Enter the student's academic scores.</p>
            </div>

            <button
              className="icon-button"
              onClick={() => setShowForm(false)}
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={createResult}
            className="results-form"
          >
            <div className="form-grid">
              <div className="form-group">
                <label>Student</label>

                <select
                  name="student"
                  value={form.student}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select student
                  </option>

                  {students.map((student) => (
                    <option
                      key={student._id}
                      value={student._id}
                    >
                      {student.firstName}{" "}
                      {student.lastName}
                      {student.registrationNumber
                        ? ` - ${student.registrationNumber}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subject</label>

                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select subject
                  </option>

                  {subjects.map((subject) => (
                    <option
                      key={subject._id}
                      value={subject._id}
                    >
                      {subject.name}
                      {subject.code
                        ? ` (${subject.code})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Class</label>

                <select
                  name="class"
                  value={form.class}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select class
                  </option>

                  {classes.map((schoolClass) => (
                    <option
                      key={schoolClass._id}
                      value={schoolClass._id}
                    >
                      {schoolClass.name}
                      {schoolClass.level
                        ? ` - ${schoolClass.level}`
                        : ""}
                      {schoolClass.arm
                        ? ` ${schoolClass.arm}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Academic Session</label>

                <select
                  name="academicSession"
                  value={form.academicSession}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select session
                  </option>

                  {sessions.map((session) => (
                    <option
                      key={session._id}
                      value={session._id}
                    >
                      {session.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Term</label>

                <select
                  name="term"
                  value={form.term}
                  onChange={handleChange}
                  required
                >
                  <option value="First Term">
                    First Term
                  </option>
                  <option value="Second Term">
                    Second Term
                  </option>
                  <option value="Third Term">
                    Third Term
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>CA Score / 40</label>

                <input
                  type="number"
                  name="caScore"
                  min="0"
                  max="40"
                  value={form.caScore}
                  onChange={handleChange}
                  placeholder="0 - 40"
                  required
                />
              </div>

              <div className="form-group">
                <label>Exam Score / 60</label>

                <input
                  type="number"
                  name="examScore"
                  min="0"
                  max="60"
                  value={form.examScore}
                  onChange={handleChange}
                  placeholder="0 - 60"
                  required
                />
              </div>
            </div>

            <div className="results-form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Create Result
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card">
        {!selectedClass ? (
          <div className="empty-state">
            <FileText size={48} />

            <h2>Select a Class</h2>

            <p>
              Select a class above to view its academic
              results.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />

            <h2>No Results Yet</h2>

            <p>
              No results have been created for this
              class and term.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>CA</th>
                  <th>Exam</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {results.map((result) => (
                  <tr key={result._id}>
                    <td>
                      {result.student?.firstName}{" "}
                      {result.student?.lastName}
                    </td>

                    <td>
                      {result.subject?.name || "—"}
                    </td>

                    <td>
                      {result.caScore}/40
                    </td>

                    <td>
                      {result.examScore}/60
                    </td>

                    <td>
                      {result.totalScore}/100
                    </td>

                    <td>
                      {result.grade || "—"}
                    </td>

                    <td>
                      <span className="status-badge">
                        {result.status}
                      </span>
                    </td>

                    <td>
                      {result.status !== "published" ? (
                        <button
                          className="secondary-button"
                          onClick={() =>
                            publishResult(result._id)
                          }
                          disabled={
                            publishing === result._id
                          }
                        >
                          {publishing === result._id ? (
                            <>
                              <RefreshCw
                                size={15}
                                className="spin"
                              />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <Send size={15} />
                              Publish
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="published-label">
                          <CheckCircle2 size={15} />
                          Published
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}