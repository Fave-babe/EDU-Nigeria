import React, { useEffect, useState } from "react";
import { Plus, RefreshCw, X, BookOpen } from "lucide-react";

import http from "../api/http";
import { classApi } from "../api/class.api";
import { classSubjectApi } from "../api/classSubject.api";

export default function ClassSubjects() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    academicSession: "6aa71820239080fa23f5f8eb",
    class: "",
    subject: "",
    teacher: "",
    isCompulsory: false,
  });

  const schoolId = "6a8485d60293d305ecd84878";

  const loadData = async () => {
    try {
      setLoading(true);

      const [subjectsResponse, teachersResponse, classesResponse] =
  await Promise.all([
    http.get(`/subject/school/${schoolId}`),
    http.get(`/teacher/school/${schoolId}`),
    classApi.getClasses(
      schoolId,
      "6aa71820239080fa23f5f8eb"
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

      setSubjects(schoolSubjects);
      setTeachers(schoolTeachers);

      setClasses(
        schoolClasses.filter(
          (item) =>
            !item.school ||
            item.school === schoolId ||
            item.school?._id === schoolId
        )
      );
    } catch (error) {
      console.error("Failed to load class subject data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.class || !form.subject || !form.teacher) {
      alert("Please select a class, subject and teacher.");
      return;
    }

    try {
      const response = await classSubjectApi.createClassSubject({
        school: schoolId,
        academicSession: form.academicSession,
        class: form.class,
        subject: form.subject,
        teacher: form.teacher,
        isCompulsory: form.isCompulsory,
      });

      console.log("CLASS SUBJECT CREATED:", response);

      alert("Subject assigned successfully.");

      setForm({
        academicSession: "6aa71820239080fa23f5f8eb",
        class: "",
        subject: "",
        teacher: "",
        isCompulsory: false,
      });

      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error("Failed to create class subject:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to assign subject."
      );
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1>Class Subjects</h1>
          <p>
            Assign subjects and teachers to school classes.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={loadData}>
            <RefreshCw size={16} />
            Refresh
          </button>

          <button onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Assign Subject
          </button>
        </div>
      </div>

      {showForm && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "24px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2>Assign Subject</h2>

            <button onClick={() => setShowForm(false)}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label>Class</label>

              <select
                name="class"
                value={form.class}
                onChange={handleChange}
                required
              >
                <option value="">Select class</option>

                {classes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                    {item.level
                      ? ` - ${item.level}`
                      : ""}
                    {item.arm ? ` ${item.arm}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Subject</label>

              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select subject</option>

                {subjects.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} ({item.code})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Teacher</label>

              <select
                name="teacher"
                value={form.teacher}
                onChange={handleChange}
                required
              >
                <option value="">Select teacher</option>

                {teachers.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.firstName} {item.lastName}
                  </option>
                ))}
              </select>
            </div>

            <label
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "15px",
              }}
            >
              <input
                type="checkbox"
                name="isCompulsory"
                checked={form.isCompulsory}
                onChange={handleChange}
              />

              Compulsory subject
            </label>

            <button type="submit">
              <BookOpen size={16} />
              Assign Subject
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : classes.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        <div>
          <h2>Available Classes</h2>

          {classes.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ddd",
                padding: "16px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <strong>{item.name}</strong>

              <div>
                Level: {item.level || "Not specified"}
              </div>

              <div>
                Arm: {item.arm || "Not specified"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}