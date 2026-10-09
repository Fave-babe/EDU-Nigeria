import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { getPublicSchools } from "../api/school.api";
import {
getStudents,
getStudent,
createStudent,
updateStudent,
deleteStudent,
} from "../api/student.api";
import "./Students.css";

/* =========================================================
STUDENT PROFILE
========================================================= */

export function StudentProfile() {
const { id } = useParams();

const [student, setStudent] = useState(null);
const [activeTab, setActiveTab] = useState("Profile");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
let cancelled = false;


async function fetchStudent() {
  try {
    setLoading(true);
    setError("");

    const response = await getStudent(id);

    console.log("STUDENT PROFILE RESPONSE:", response);

    const studentData = response?.student ?? response?.data?.student;

    if (!cancelled) {
      setStudent(studentData || null);

      if (!studentData) {
        setError("No student record was returned by the server.");
      }
    }
  } catch (err) {
    console.error("GET STUDENT PROFILE ERROR:", err);
    console.error("ERROR STATUS:", err.status);
    console.error("ERROR MESSAGE:", err.message);

    if (!cancelled) {
      setError(err.message || "Failed to load student profile.");
    }
  } finally {
    if (!cancelled) {
      setLoading(false);
    }
  }
}

if (!id) {
  setError("Student ID is missing.");
  setLoading(false);
} else {
  fetchStudent();
}

return () => {
  cancelled = true;
};


}, [id]);

const formatDate = (value, includeTime = false) => {
if (!value) return "N/A";


const date = new Date(value);

if (Number.isNaN(date.getTime())) return "N/A";

return includeTime
  ? date.toLocaleString()
  : date.toLocaleDateString();


};

if (loading) {
return ( <div className="page"> <Header
       title="Student Profile"
       subtitle="Loading student information..."
     /> <div className="profile-card">
Loading student information... </div> </div>
);
}

if (error || !student) {
return ( <div className="page"> <Header
       title="Student Profile"
       subtitle="Unable to load student information"
     />
    <div className="profile-card">
      <p>{error || "Student record not found."}</p>

      <Link to="/students" className="btn-secondary">
        Back to Students
      </Link>
    </div>
  </div>
);


}

const school = student.school;
const payment = student.payment;

const profileSections = [
{
title: "Personal Information",
fields: [
["First Name", student.firstName],
["Last Name", student.lastName],
["Gender", student.gender],
["Date of Birth", formatDate(student.dob)],
["Email", student.email],
["Address", student.address],
],
},
{
title: "Academic Information",
fields: [
[
"School",
typeof school === "object" ? school?.name : undefined,
],
[
"School Type",
typeof school === "object" ? school?.schoolType : undefined,
],
["Admission Number", student.admissionNo],
["Registration Number", student.registrationNumber],
[
"Session",
typeof student.session === "object"
? student.session?.name
: student.session,
],
["Previous School", student.previousSchool],
],
},
{
title: "Registration Information",
fields: [
["Registration Status", student.registrationStatus],
["Set Number", student.setNumber],
[
"Biometric Verification",
student.biometricVerification ? "Verified" : "Not Verified",
],
["Student ID", student._id],
],
},
{
title: "Health Information",
fields: [
["Medical Notes", student.medicalNotes || "No medical notes"],
],
},
{
title: "Payment Information",
fields: [
["Payment Status", payment?.status],
[
"Amount",
payment?.amount != null
? `₦${Number(payment.amount).toLocaleString()}`
: "N/A",
],
["Payment Method", payment?.method],
["Payment Reference", payment?.reference],
],
},
{
title: "System Information",
fields: [
["Created At", formatDate(student.createdAt, true)],
["Updated At", formatDate(student.updatedAt, true)],
],
},
];

return ( <div className="page">
<Header
title={`${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student Profile"}
subtitle={`Admission No: ${student.admissionNo || "N/A"}`}
/>


  <div className="profile-tabs">
    <button
      type="button"
      className={`profile-tab ${activeTab === "Profile" ? "active" : ""}`}
      onClick={() => setActiveTab("Profile")}
    >
      Profile
    </button>

    <button
      type="button"
      className={`profile-tab ${activeTab === "Messages" ? "active" : ""}`}
      onClick={() => setActiveTab("Messages")}
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

    .profile-section,
    .profile-card,
    .message-placeholder {
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
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

    .message-placeholder {
      text-align: center;
      color: rgba(51,49,44,0.6);
    }
  `}</style>

  {activeTab === "Profile" && (
    <div>
      {profileSections.map((section) => (
        <div className="profile-section" key={section.title}>
          <h3>{section.title}</h3>

          <div className="profile-info-grid">
            {section.fields.map(([label, value]) => (
              <div className="profile-info-item" key={label}>
                <label>{label}</label>
                <p>
                  {value == null || value === "" ? "N/A" : value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

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
        Student messaging will be connected to the backend separately.
      </p>
    </div>
  )}
</div>


);
}

/* =========================================================
STUDENTS LIST PAGE
========================================================= */

export default function Students() {
const [students, setStudents] = useState([]);
const [schools, setSchools] = useState([]);
const [showForm, setShowForm] = useState(false);
const [editing, setEditing] = useState(null);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

const initialForm = {
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
};

const [form, setForm] = useState(initialForm);

const fetchStudents = useCallback(async () => {
try {
setLoading(true);
setError("");


  const response = await getStudents();

  console.log("STUDENTS RESPONSE:", response);

  const studentList =
    response?.students ??
    response?.data?.students ??
    response?.data ??
    [];

  setStudents(Array.isArray(studentList) ? studentList : []);
} catch (err) {
  console.error("GET STUDENTS ERROR:", err);
  console.error("ERROR STATUS:", err.status);
  console.error("ERROR MESSAGE:", err.message);

  setError(err.message || "Failed to load students.");
  setStudents([]);
} finally {
  setLoading(false);
}


}, []);

const fetchSchools = useCallback(async () => {
try {
const response = await getPublicSchools();


  console.log("SCHOOLS RESPONSE:", response);

  const schoolList =
    response?.schools ??
    response?.data?.schools ??
    response?.data ??
    [];

  setSchools(Array.isArray(schoolList) ? schoolList : []);
} catch (err) {
  console.error("GET SCHOOLS ERROR:", err);
  console.error("ERROR STATUS:", err.status);
  console.error("ERROR MESSAGE:", err.message);

  setSchools([]);
}


}, []);

useEffect(() => {
fetchStudents();
fetchSchools();
}, [fetchStudents, fetchSchools]);

function resetForm() {
setForm({ ...initialForm });
}

function openAddForm() {
setEditing(null);
resetForm();
setError("");
setShowForm(true);
}

function openEditForm(student) {
setEditing(student);


setForm({
  firstName: student.firstName || "",
  lastName: student.lastName || "",
  gender: student.gender || "Male",
  dob: student.dob
    ? new Date(student.dob).toISOString().split("T")[0]
    : "",
  address: student.address || "",
  email: student.email || "",
  admissionNo: student.admissionNo || "",
  session:
    typeof student.session === "object"
      ? student.session?.name || ""
      : student.session || "2026/2027",
  medicalNotes: student.medicalNotes || "",
  registrationStatus: student.registrationStatus || "initiated",
  school:
    typeof student.school === "object"
      ? student.school?._id || ""
      : student.school || "",
});

setError("");
setShowForm(true);


}

function handleChange(event) {
const { name, value } = event.target;


setForm((previous) => ({
  ...previous,
  [name]: value,
}));


}

async function handleSubmit(event) {
event.preventDefault();


try {
  setSaving(true);
  setError("");

  const data = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    gender: form.gender,
    dob: form.dob,
    address: form.address.trim(),
    email: form.email.trim(),
    admissionNo: form.admissionNo.trim(),
    session: form.session.trim(),
    medicalNotes: form.medicalNotes.trim(),
    registrationStatus: form.registrationStatus,
    school: form.school,
  };

  console.log("STUDENT DATA BEING SENT:", data);

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
  console.error("ERROR STATUS:", err.status);
  console.error("ERROR MESSAGE:", err.message);
  console.error("ERROR DETAILS:", err.errors);

  setError(err.message || "Failed to save student.");
} finally {
  setSaving(false);
}


}

async function handleDelete(id) {
const confirmed = window.confirm(
"Are you sure you want to delete this student?"
);


if (!confirmed) return;

try {
  setError("");

  await deleteStudent(id);
  await fetchStudents();
} catch (err) {
  console.error("DELETE STUDENT ERROR:", err);
  console.error("ERROR STATUS:", err.status);
  console.error("ERROR MESSAGE:", err.message);

  setError(err.message || "Failed to delete student.");
}


}

return ( <div className="page"> <Header
     title="Students"
     subtitle="Manage student profiles and enrollment"
   />


  <div className="page-actions">
    <button
      type="button"
      className="btn-primary"
      onClick={openAddForm}
    >
      + Add Student
    </button>
  </div>

  {error && (
    <div
      role="alert"
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

  {showForm && (
    <div
      className="modal-overlay"
      onClick={() => {
        if (!saving) setShowForm(false);
      }}
    >
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>{editing ? "Edit Student" : "New Student"}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="school">School</label>

            <select
              id="school"
              name="school"
              required
              value={form.school}
              onChange={handleChange}
            >
              <option value="">Select School</option>

              {schools.map((school) => (
                <option key={school._id} value={school._id}>
                  {school.name}
                </option>
              ))}
            </select>

            {schools.length === 0 && (
              <small>
                No public schools were loaded. Check the browser console.
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admissionNo">Admission No</label>
            <input
              id="admissionNo"
              name="admissionNo"
              value={form.admissionNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="session">Session</label>
            <input
              id="session"
              name="session"
              value={form.session}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="medicalNotes">Medical Notes</label>
            <textarea
              id="medicalNotes"
              name="medicalNotes"
              value={form.medicalNotes}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="form-actions full-width">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
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
                ? "Update Student"
                : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          <th>Admission No</th>
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
            <td colSpan={7} style={{ textAlign: "center" }}>
              Loading students...
            </td>
          </tr>
        ) : students.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ textAlign: "center" }}>
              No students found.
            </td>
          </tr>
        ) : (
          students.map((student) => (
            <tr key={student._id}>
              <td>{student.admissionNo || "-"}</td>
              <td>
                {student.firstName} {student.lastName}
              </td>
              <td>{student.email || "-"}</td>
              <td>{student.gender || "-"}</td>
              <td>
                {typeof student.session === "object"
                  ? student.session?.name || "-"
                  : student.session || "-"}
              </td>
              <td>
                <span className="badge badge-success">
                  {student.registrationStatus || "initiated"}
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
                  type="button"
                  className="btn-sm"
                  onClick={() => openEditForm(student)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn-sm btn-danger"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>


);
}
