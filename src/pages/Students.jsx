import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import {
  getPublicSchools,
} from "../api/school.api";
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/student.api";

/* =========================================================================
   STUDENT PROFILE
   ========================================================================= */

export function StudentProfile() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("Profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudent();
  }, [id]);

  async function fetchStudent() {
    try {
      setLoading(true);
      setError("");

      const response = await getStudent(id);

      console.log(
        "STUDENT PROFILE RESPONSE:",
        response
      );

      setStudent(response.student || null);
    } catch (err) {
      console.error(
        "GET STUDENT PROFILE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load student profile"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <Header
          title="Student Profile"
          subtitle="Loading student information..."
        />

        <div className="profile-card">
          Loading student information...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Header
          title="Student Profile"
          subtitle="Unable to load student"
        />

        <div className="profile-card">
          <p>{error}</p>

          <Link
            to="/students"
            className="btn-secondary"
          >
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="page">
        <Header
          title="Student Not Found"
          subtitle="This student record does not exist."
        />

        <Link
          to="/students"
          className="btn-secondary"
        >
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Header
        title={`${student.firstName || ""} ${
          student.lastName || ""
        }`}
        subtitle={`Admission No: ${
          student.admissionNo || "N/A"
        }`}
      />

      <div className="profile-tabs">
        <button
          type="button"
          className={`profile-tab ${
            activeTab === "Profile"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveTab("Profile")
          }
        >
          Profile
        </button>

        <button
          type="button"
          className={`profile-tab ${
            activeTab === "Messages"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveTab("Messages")
          }
        >
          Messages
        </button>
      </div>

      <style>{`
        .profile-tabs {
          display: flex;
          gap: 4px;
          border-bottom: 1px solid #E2DCC9;
          margin: 18px 0;
        }

        .profile-tab {
          background: none;
          border: none;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(51,49,44,0.55);
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }

        .profile-tab:hover {
          color: #1B2A4A;
        }

        .profile-tab.active {
          color: #1B2A4A;
          border-bottom-color: #B8862B;
        }

        .profile-section {
          background: #fff;
          border: 1px solid #E2DCC9;
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 18px;
        }

        .profile-section h3 {
          margin: 0 0 18px;
          color: #1B2A4A;
          font-size: 16px;
        }

        .profile-info-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(200px, 1fr)
          );
          gap: 18px;
        }

        .profile-info-item label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: rgba(51,49,44,0.5);
          margin-bottom: 5px;
        }

        .profile-info-item p {
          margin: 0;
          font-size: 14px;
          color: #33312C;
          word-break: break-word;
        }

        .profile-back {
          display: inline-block;
          margin-top: 4px;
        }

        .profile-card {
          background: #fff;
          border: 1px solid #E2DCC9;
          border-radius: 6px;
          padding: 20px;
        }

        .message-placeholder {
          background: #fff;
          border: 1px solid #E2DCC9;
          border-radius: 6px;
          padding: 30px;
          text-align: center;
          color: rgba(51,49,44,0.6);
        }
      `}</style>

      {activeTab === "Profile" && (
        <div>

          {/* PERSONAL INFORMATION */}
          <div className="profile-section">
            <h3>Personal Information</h3>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <label>First Name</label>
                <p>
                  {student.firstName || "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Last Name</label>
                <p>
                  {student.lastName || "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Gender</label>
                <p>
                  {student.gender || "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Date of Birth</label>
                <p>
                  {student.dob
                    ? new Date(
                        student.dob
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Email</label>
                <p>
                  {student.email || "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Address</label>
                <p>
                  {student.address || "N/A"}
                </p>
              </div>

            </div>
          </div>

          {/* ACADEMIC INFORMATION */}
          <div className="profile-section">
            <h3>Academic Information</h3>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <label>School</label>
                <p>
                  {student.school?.name ||
                    "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>School Type</label>
                <p>
                  {student.school?.schoolType ||
                    "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Admission Number</label>
                <p>
                  {student.admissionNo ||
                    "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Registration Number</label>
                <p>
                  {student.registrationNumber ||
                    "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Session</label>
                <p>
                  {student.session || "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Previous School</label>
                <p>
                  {student.previousSchool ||
                    "N/A"}
                </p>
              </div>

            </div>
          </div>

          {/* REGISTRATION INFORMATION */}
          <div className="profile-section">
            <h3>Registration Information</h3>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <label>Registration Status</label>
                <p>
                  {student.registrationStatus ||
                    "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Set Number</label>
                <p>
                  {student.setNumber || "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Biometric Verification</label>
                <p>
                  {student.biometricVerification
                    ? "Verified"
                    : "Not Verified"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Student ID</label>
                <p>
                  {student._id || "N/A"}
                </p>
              </div>

            </div>
          </div>

          {/* HEALTH INFORMATION */}
          <div className="profile-section">
            <h3>Health Information</h3>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <label>Medical Notes</label>
                <p>
                  {student.medicalNotes ||
                    "No medical notes"}
                </p>
              </div>

            </div>
          </div>

          {/* PAYMENT INFORMATION */}
          <div className="profile-section">
            <h3>Payment Information</h3>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <label>Payment Status</label>
                <p>
                  {student.payment?.status ||
                    "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Amount</label>
                <p>
                  {student.payment?.amount ??
                    "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Payment Method</label>
                <p>
                  {student.payment?.method ||
                    "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Payment Reference</label>
                <p>
                  {student.payment?.reference ||
                    "N/A"}
                </p>
              </div>

            </div>
          </div>

          {/* SYSTEM INFORMATION */}
          <div className="profile-section">
            <h3>System Information</h3>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <label>Created At</label>
                <p>
                  {student.createdAt
                    ? new Date(
                        student.createdAt
                      ).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div className="profile-info-item">
                <label>Updated At</label>
                <p>
                  {student.updatedAt
                    ? new Date(
                        student.updatedAt
                      ).toLocaleString()
                    : "N/A"}
                </p>
              </div>

            </div>
          </div>

          <Link
            to="/students"
            className="btn-secondary profile-back"
          >
            Back to Students
          </Link>

        </div>
      )}

      {activeTab === "Messages" && (
        <div className="message-placeholder">
          <h3>Messages</h3>
          <p>
            Student messaging will be connected
            to the backend separately.
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   STUDENTS LIST PAGE
   ========================================================================= */

export default function Students() {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  gender: "Male",
  dob: "",
  address: "",
  email: "",
  admissionNo: "",
  session: "2026/2027",
  medicalNotes: "",
  registrationStatus: "initiated",
  school: "",
});

  useEffect(() => {
    fetchStudents();
    fetchSchools();
  }, []);

  async function fetchStudents() {
    try {
      setLoading(true);
      setError("");

      const response = await getStudents();

      console.log(
        "STUDENTS RESPONSE:",
        response
      );

      setStudents(
        response.students || []
      );
    } catch (err) {
      console.error(
        "GET STUDENTS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  }
  async function fetchSchools() {
  try {
    const response = await getPublicSchools();

    console.log("SCHOOLS RESPONSE:", response);
    console.log("SCHOOLS:", response?.schools);

    setSchools(
      Array.isArray(response?.schools)
        ? response.schools
        : []
    );
  } catch (err) {
    console.error("GET SCHOOLS ERROR:", err);

    setSchools([]);
  }
}

  function resetForm() {
    setForm({
      firstName: "",
      lastName: "",
      gender: "Male",
      dob: "",
      address: "",
      email: "",
      admissionNo: "",
      session: "2026/2027",
      medicalNotes: "",
      registrationStatus: "initiated",
      school: "",
    });
  }

  function openAddForm() {
    setEditing(null);
    resetForm();
    setShowForm(true);
    setError("");
  }

  function openEditForm(student) {
    setEditing(student);

    setForm({
      firstName:
        student.firstName || "",

      lastName:
        student.lastName || "",

      gender:
        student.gender || "Male",

      dob: student.dob
        ? new Date(student.dob)
            .toISOString()
            .split("T")[0]
        : "",

      address:
        student.address || "",

      email:
        student.email || "",

      admissionNo:
        student.admissionNo || "",

      session:
        student.session || "2026/2027",

      medicalNotes:
        student.medicalNotes || "",

      registrationStatus:
        student.registrationStatus ||
        "initiated",

        school:
  student.school?._id ||
  student.school ||
  "",
    });

    setShowForm(true);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        dob: form.dob,
        address: form.address,
        email: form.email,
        admissionNo: form.admissionNo,
        session: form.session,
        medicalNotes: form.medicalNotes,
        registrationStatus:
          form.registrationStatus,
            school: form.school,
      };

      try {
  if (editing) {
    await updateStudent(editing._id, data);
  } else {
    await createStudent(data);
  }

  await fetchStudents();

  resetForm();
  setShowForm(false);
  setEditing(null);
} catch (err) {
  console.error("SAVE STUDENT ERROR:", err);
}

      setError(
        err.response?.data?.message ||
          "Failed to save student"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this student?"
      )
    ) {
      return;
    }

    try {
      setError("");

      await deleteStudent(id);

      await fetchStudents();

    } catch (err) {
      console.error(
        "DELETE STUDENT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete student"
      );
    }
  }

  return (
    <div className="page">

      <Header
        title="Students"
        subtitle="Manage student profiles and enrollment"
      />

      <div className="page-actions">
        <button
          className="btn-primary"
          onClick={openAddForm}
        >
          + Add Student
        </button>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "15px",
            padding: "12px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      )}

      {/* ADD / EDIT FORM */}

      {showForm && (
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
              {editing
                ? "Edit Student"
                : "New Student"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="form-grid"
            >
              <div className="form-group full-width">
  <label>
    School
  </label>

  <select
    required
    value={form.school}
    onChange={(e) =>
      setForm({
        ...form,
        school: e.target.value,
      })
    }
  >
    <option value="">
      Select School
    </option>

    {schools.map((school) => (
      <option
        key={school._id}
        value={school._id}
      >
        {school.name}
      </option>
    ))}
  </select>
</div>


              <div className="form-group">
                <label>
                  First Name
                </label>

                <input
                  required
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      firstName:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Last Name
                </label>

                <input
                  required
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lastName:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Gender
                </label>

                <select
                  value={form.gender}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      gender:
                        e.target.value,
                    })
                  }
                >
                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Date of Birth
                </label>

                <input
                  type="date"
                  required
                  value={form.dob}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dob:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Admission No
                </label>

                <input
                  required
                  value={
                    form.admissionNo
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      admissionNo:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Address
                </label>

                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Session
                </label>

                <input
                  required
                  value={form.session}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      session:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group full-width">
                <label>
                  Medical Notes
                </label>

                <textarea
                  value={
                    form.medicalNotes
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      medicalNotes:
                        e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="form-actions full-width">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    setShowForm(false)
                  }
                  disabled={saving}
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
                    : editing
                    ? "Update"
                    : "Create"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* STUDENTS TABLE */}

      <div className="table-wrapper">

        <table className="data-table">

          <thead>
            <tr>
              <th>
                Admission No
              </th>

              <th>Name</th>

              <th>Email</th>

              <th>Gender</th>

              <th>Session</th>

              <th>Status</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  Loading students...
                </td>
              </tr>

            ) : students.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  No students found.
                </td>
              </tr>

            ) : (

              students.map(
                (student) => (
                  <tr
                    key={
                      student._id
                    }
                  >

                    <td>
                      {student.admissionNo ||
                        "-"}
                    </td>

                    <td>
                      {student.firstName}{" "}
                      {student.lastName}
                    </td>

                    <td>
                      {student.email ||
                        "-"}
                    </td>

                    <td>
                      {student.gender ||
                        "-"}
                    </td>

                    <td>
                      {student.session ||
                        "-"}
                    </td>

                    <td>
                      <span className="badge badge-success">
                        {student.registrationStatus ||
                          "initiated"}
                      </span>
                    </td>

                    <td className="actions-cell">

                      <Link
                        to={`/students/${student._id}`}
                        className="btn-sm"
                      >
                        View
                      </Link>

                      <button
                        className="btn-sm"
                        onClick={() =>
                          openEditForm(
                            student
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn-sm btn-danger"
                        onClick={() =>
                          handleDelete(
                            student._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}