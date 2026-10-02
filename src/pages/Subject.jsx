import React, { useEffect, useState } from "react";
import { Plus, RefreshCw, BookOpen, X } from "lucide-react";
import http from "../api/http";
import { teacherApi } from "../api/teacher.api";
import { classSubjectApi } from "../api/classSubject.api";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "Core",
    description: "",
    isCompulsory: false,
  });

  const schoolId = "6a8485d60293d305ecd84878";
  useEffect(() => {
  const loadTeachers = async () => {
    try {
      const response = await teacherApi.getTeachersBySchool(schoolId);

      console.log(
        "SCHOOL TEACHERS:",
        JSON.stringify(
          response?.data?.teachers ||
            response?.teachers ||
            response?.data ||
            [],
          null,
          2
        )
      );
    } catch (error) {
      console.error("Failed to load school teachers:", error);
    }
  };

  loadTeachers();
}, []);
  const loadSubjects = async () => {
    try {
      setLoading(true);

      const response = await http.get(`/subject/school/${schoolId}`);

      setSubjects(
        response?.data?.subjects ||
          response?.subjects ||
          []
      );
    } catch (error) {
      console.error("Failed to load subjects:", error);
    } finally {
      setLoading(false);
    }
  };
  const assignEnglishToDiamond = async () => {
  try {
    const response = await classSubjectApi.createClassSubject({
      school: "6a8485d60293d305ecd84878",
      academicSession: "6aa71820239080fa23f5f8eb",
      class: "6abd82c94e325b2ff4c83ac8",
      subject: "6abd987f25da0e9da606322b",
      teacher: "6abd820c4e325b2ff4c83abe",
      isCompulsory: true,
    });

    console.log("CLASS SUBJECT CREATED:", response);

    alert("English assigned to Diamond class successfully");
  } catch (error) {
    console.error("FAILED TO ASSIGN SUBJECT:", error);

    alert(
      error?.response?.data?.message ||
        "Failed to assign English to Diamond"
    );
  }
};

  useEffect(() => {
    loadSubjects();
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

    try {
      await http.post("/subject", {
        school: schoolId,
        name: form.name,
        code: form.code,
        category: form.category,
        description: form.description,
        isCompulsory: form.isCompulsory,
      });

      setForm({
        name: "",
        code: "",
        category: "Core",
        description: "",
        isCompulsory: false,
      });

      setShowForm(false);

      await loadSubjects();
    } catch (error) {
      console.error("Failed to create subject:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to create subject"
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
          <h1>Subjects</h1>
          <p>Manage school subjects.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={loadSubjects}>
            <RefreshCw size={16} />
            Refresh
          </button>

          <button onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Add Subject
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
            }}
          >
            <h2>Add Subject</h2>

            <button onClick={() => setShowForm(false)}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Subject Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Mathematics"
                required
              />
            </div>

            <div>
              <label>Subject Code</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="MTH"
                required
              />
            </div>

            <div>
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Core">Core</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commercial">Commercial</option>
                <option value="Vocational">Vocational</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Subject description"
              />
            </div>

            <label>
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
              Create Subject
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading subjects...</p>
      ) : subjects.length === 0 ? (
        <p>No subjects have been created yet.</p>
      ) : (
        <div>
          {subjects.map((subject) => (
            <div
              key={subject._id}
              style={{
                border: "1px solid #ddd",
                padding: "16px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <strong>{subject.name}</strong>

              <div>
                Code: {subject.code}
              </div>

              <div>
                Category: {subject.category}
              </div>

              <div>
                {subject.isCompulsory
                  ? "Compulsory"
                  : "Optional"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}