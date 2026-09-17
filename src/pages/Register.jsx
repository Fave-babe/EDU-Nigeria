import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  BookOpen,
  Users,
  ClipboardList,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";

const ROLES = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "teacher", label: "Teacher", icon: BookOpen },
  { id: "parent", label: "Parent", icon: Users },
  { id: "staff", label: "Staff", icon: ClipboardList },
];

const CLASS_OPTIONS = [
  "Nursery 1",
  "Nursery 2",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SS 1",
  "SS 2",
  "SS 3",
];

const STAFF_ROLE_OPTIONS = [
  "Counsellor",
  "Cleaner",
  "Bursar",
  "Receptionist",
  "Security",
  "Librarian",
  "IT Support",
  "Cook / Kitchen Staff",
  "Driver",
  "Nurse",
  "Administrator",
  "Other",
];

const SUBJECT_OPTIONS = [
  "Mathematics",
  "English Language",
  "Basic Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Agricultural Science",
  "Social Studies",
  "Civic Education",
  "Government",
  "Economics",
  "Geography",
  "History",
  "Literature in English",
  "French",
  "Computer Studies / ICT",
  "Fine Art",
  "Music",
  "Physical Education",
  "Christian Religious Studies",
  "Islamic Religious Studies",
  "Business Studies",
  "Home Economics",
  "Other",
];

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("student");

  const [schools, setSchools] = useState([]);
  const [school, setSchool] = useState("");
  const [loadingSchools, setLoadingSchools] = useState(false);

  // Student-only fields
  const [studentClass, setStudentClass] = useState("");
  const [gender, setGender] = useState("");
  const [previousSchool, setPreviousSchool] = useState("");

  // Parent-only fields
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [children, setChildren] = useState([""]);

  // Staff-only fields
  const [staffPhone, setStaffPhone] = useState("");
  const [staffRole, setStaffRole] = useState("");

  // Teacher-only fields
  const [teacherPhone, setTeacherPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

  // Load schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoadingSchools(true);

        const response = await fetch("/api/v1/school/public");

        if (!response.ok) {
          throw new Error("Failed to load schools");
        }

        const data = await response.json();

        console.log("Schools response:", data);

        const schoolList =
          data.data?.schools ||
          data.data ||
          data.schools ||
          [];

        setSchools(schoolList);
      } catch (error) {
        console.error("Error loading schools:", error);
      } finally {
        setLoadingSchools(false);
      }
    };

    fetchSchools();
  }, []);

  // Parent children
  const handleChildChange = (index, value) => {
    setChildren((prev) =>
      prev.map((child, i) => (i === index ? value : child))
    );
  };

  const addChildField = () => {
    setChildren((prev) => [...prev, ""]);
  };

  const removeChildField = (index) => {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Student and teacher must select a school
    if (
      (role === "student" || role === "teacher") &&
      !school
    ) {
      alert("Please select your school.");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      password,
      role,
    };

    // Student
    if (role === "student") {
      payload.school = school;
      payload.studentClass = studentClass;
      payload.gender = gender;
      payload.previousSchool = previousSchool;
    }

    // Teacher
    if (role === "teacher") {
      payload.school = school;
      payload.phone = teacherPhone;
      payload.subject = subject;
      payload.employmentType = employmentType;
    }

    // Parent
    if (role === "parent") {
      payload.phone = phone;
      payload.address = address;
      payload.children = children;
    }

    // Staff
    if (role === "staff") {
      payload.phone = staffPhone;
      payload.staffRole = staffRole;
    }

    console.log("Registration payload:", payload);

    try {
      const result = await register(payload);

      console.log("Registration result:", result);

      if (result.success) {
        if (role === "student") {
          alert(
            "Registration successful! Your admission details have been submitted to the admin dashboard. Please proceed to login when your admission is approved."
          );

          navigate("/login");
        } else if (role === "parent") {
          navigate("/Pdashboard");
        } else if (role === "teacher") {
          navigate("/Tdashboard");
        } else if (role === "staff") {
          navigate("/Sdashboard");
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("REGISTRATION ERROR:", error);
      console.error("ERROR MESSAGE:", error?.message);
      console.error("ERROR RESPONSE:", error?.response);
      console.error(
        "ERROR RESPONSE DATA:",
        error?.response?.data
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="reg-page">
      <style>{`
        .reg-page {
          --ink: #1557b0;
          --gold: #f7f3e8;
          --blue: #2f4b7c;
          --paper: #f7f3e8;
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: var(--paper);
          padding: 40px 16px;
        }

        @media (min-height: 700px) {
          .reg-page {
            align-items: center;
          }
        }

        .reg-card {
          width: 100%;
          max-width: 420px;
          max-height: calc(100vh - 48px);
          overflow-y: auto;
          background: #fff;
          border: 1px solid rgba(33, 48, 31, 0.1);
          border-radius: 14px;
          box-shadow:
            0 1px 3px rgba(21, 87, 176, 0.06),
            0 8px 24px rgba(21, 87, 176, 0.06);
          padding: 32px 28px;
        }

        .reg-eyebrow {
          font-family: monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--blue);
          opacity: 0.55;
        }

        .reg-card h2 {
          font-size: 1.35rem;
          color: var(--ink);
          margin: 6px 0 2px;
          font-weight: 600;
        }

        .reg-subtitle {
          font-size: 13px;
          color: rgba(33, 48, 31, 0.5);
          margin: 0 0 20px;
        }

        .reg-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .reg-label {
          display: block;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(28, 60, 11, 0.45);
          margin-bottom: 6px;
        }

        .reg-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 380px) {
          .reg-row {
            grid-template-columns: 1fr;
          }
        }

        .reg-input,
        .reg-select {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(33, 48, 31, 0.15);
          outline: none;
          padding: 6px 0;
          font-size: 14px;
          color: var(--ink);
          transition: border-color 0.2s ease;
        }

        .reg-select {
          background: #fff;
        }

        .reg-input:focus,
        .reg-select:focus {
          border-bottom-color: var(--blue);
        }

        .role-picker {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-top: 6px;
        }

        .role-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 9px 2px;
          border-radius: 8px;
          border: 1px solid rgba(33, 48, 31, 0.15);
          background: transparent;
          color: rgba(33, 48, 31, 0.5);
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .role-chip:hover {
          border-color: rgba(21, 87, 176, 0.3);
        }

        .role-chip.active {
          border-color: var(--ink);
          background: rgba(21, 87, 176, 0.07);
          color: var(--ink);
        }

        .gender-picker,
        .employment-picker {
          display: flex;
          gap: 8px;
          margin-top: 6px;
        }

        .gender-chip,
        .employment-chip {
          flex: 1;
          padding: 8px 4px;
          border-radius: 8px;
          border: 1px solid rgba(33, 48, 31, 0.15);
          background: transparent;
          color: rgba(33, 48, 31, 0.5);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .gender-chip:hover,
        .employment-chip:hover {
          border-color: rgba(21, 87, 176, 0.3);
        }

        .gender-chip.active,
        .employment-chip.active {
          border-color: var(--ink);
          background: rgba(21, 87, 176, 0.07);
          color: var(--ink);
        }

        .role-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 4px;
          border-top: 1px dashed rgba(33, 48, 31, 0.12);
        }

        .child-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .child-row:last-child {
          margin-bottom: 0;
        }

        .child-row .reg-input {
          flex: 1;
        }

        .child-remove-btn {
          background: transparent;
          border: none;
          color: rgba(33, 48, 31, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .child-remove-btn:hover {
          color: #c0392b;
        }

        .add-child-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px dashed rgba(33, 48, 31, 0.3);
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 12px;
          color: var(--blue);
          cursor: pointer;
          margin-top: 2px;
        }

        .add-child-btn:hover {
          border-color: var(--blue);
        }

        .reg-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--ink);
          color: #fff;
          font-weight: 500;
          font-size: 14px;
          padding: 11px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-top: 4px;
        }

        .reg-submit:hover {
          background: var(--blue);
        }

        .reg-signin {
          text-align: center;
          font-size: 13px;
          color: rgba(33, 48, 31, 0.6);
          margin: 0;
        }

        .reg-signin span {
          color: var(--blue);
          font-weight: 500;
          cursor: pointer;
        }
      `}</style>

      <div className="reg-card">
        <span className="reg-eyebrow">
          Enrollment · EDU Nigeria
        </span>

        <h2>Create your entry</h2>

        <p className="reg-subtitle">
          Fields marked below are required for enrollment.
        </p>

        <form onSubmit={handleSubmit} className="reg-form">

          {/* Role picker */}
          <div>
            <label className="reg-label">Role</label>

            <div className="role-picker">
              {ROLES.map(({ id, label, icon: Icon }) => {
                const active = role === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRole(id)}
                    className={`role-chip${active ? " active" : ""}`}
                  >
                    <Icon
                      size={16}
                      strokeWidth={active ? 2.25 : 1.75}
                    />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name row */}
          <div className="reg-row">
            <div>
              <label className="reg-label">
                First name
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="reg-input"
                placeholder="Ada"
                required
              />
            </div>

            <div>
              <label className="reg-label">
                Last name
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="reg-input"
                placeholder="Lovelace"
                required
              />
            </div>
          </div>

          {/* Email + Password */}
          <div className="reg-row">
            <div>
              <label className="reg-label">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="reg-input"
                placeholder="ada@school.edu"
                required
              />
            </div>

            <div>
              <label className="reg-label">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="reg-input"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* School */}
          {(role === "student" || role === "teacher") && (
            <div>
              <label className="reg-label">
                School
              </label>

              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="reg-select"
                required
                disabled={loadingSchools}
              >
                <option value="" disabled>
                  {loadingSchools
                    ? "Loading schools..."
                    : "Select your school"}
                </option>

                {schools.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Student fields */}
          {role === "student" && (
            <div className="role-section">

              <div className="reg-row">
                <div>
                  <label className="reg-label">
                    Class
                  </label>

                  <select
                    value={studentClass}
                    onChange={(e) =>
                      setStudentClass(e.target.value)
                    }
                    className="reg-select"
                    required
                  >
                    <option value="" disabled>
                      Select class
                    </option>

                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="reg-label">
                    Gender
                  </label>

                  <div className="gender-picker">
                    {["Male", "Female"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`gender-chip${
                          gender === g ? " active" : ""
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="reg-label">
                  Previous school attended
                </label>

                <input
                  type="text"
                  value={previousSchool}
                  onChange={(e) =>
                    setPreviousSchool(e.target.value)
                  }
                  className="reg-input"
                  placeholder="e.g. Bright Stars Nursery & Primary"
                  required
                />
              </div>

              <p className="reg-signin">
                Ready to move forward?{" "}
                <span
                  onClick={() =>
                    navigate("/entrance", {
                      state: { studentClass },
                    })
                  }
                >
                  Take The Entrance Exams
                </span>
              </p>
            </div>
          )}

          {/* Teacher fields */}
          {role === "teacher" && (
            <div className="role-section">

              <div className="reg-row">
                <div>
                  <label className="reg-label">
                    Phone number
                  </label>

                  <input
                    type="tel"
                    value={teacherPhone}
                    onChange={(e) =>
                      setTeacherPhone(e.target.value)
                    }
                    className="reg-input"
                    placeholder="080X XXX XXXX"
                    required
                  />
                </div>

                <div>
                  <label className="reg-label">
                    Employment type
                  </label>

                  <div className="employment-picker">
                    {["Full-time", "Part-time"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setEmploymentType(type)
                        }
                        className={`employment-chip${
                          employmentType === type
                            ? " active"
                            : ""
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="reg-label">
                  Subject taught
                </label>

                <select
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                  className="reg-select"
                  required
                >
                  <option value="" disabled>
                    Select subject
                  </option>

                  {SUBJECT_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Parent fields */}
          {role === "parent" && (
            <div className="role-section">

              <div>
                <label className="reg-label">
                  Phone number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="reg-input"
                  placeholder="080X XXX XXXX"
                  required
                />
              </div>

              <div>
                <label className="reg-label">
                  Home address
                </label>

                <input
                  type="text"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  className="reg-input"
                  placeholder="12 Allen Avenue, Ikeja, Lagos"
                  required
                />
              </div>

              <div>
                <label className="reg-label">
                  Child / children
                </label>

                {children.map((child, index) => (
                  <div
                    className="child-row"
                    key={index}
                  >
                    <input
                      type="text"
                      value={child}
                      onChange={(e) =>
                        handleChildChange(
                          index,
                          e.target.value
                        )
                      }
                      className="reg-input"
                      placeholder={`Child ${
                        index + 1
                      } full name`}
                      required
                    />

                    {children.length > 1 && (
                      <button
                        type="button"
                        className="child-remove-btn"
                        onClick={() =>
                          removeChildField(index)
                        }
                        aria-label="Remove child"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="add-child-btn"
                  onClick={addChildField}
                >
                  <Plus size={13} />
                  Add another child
                </button>
              </div>
            </div>
          )}

          {/* Staff fields */}
          {role === "staff" && (
            <div className="role-section">

              <div>
                <label className="reg-label">
                  Phone number
                </label>

                <input
                  type="tel"
                  value={staffPhone}
                  onChange={(e) =>
                    setStaffPhone(e.target.value)
                  }
                  className="reg-input"
                  placeholder="080X XXX XXXX"
                  required
                />
              </div>

              <div>
                <label className="reg-label">
                  Staff role
                </label>

                <select
                  value={staffRole}
                  onChange={(e) =>
                    setStaffRole(e.target.value)
                  }
                  className="reg-select"
                  required
                >
                  <option value="" disabled>
                    Select role
                  </option>

                  {STAFF_ROLE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="reg-submit"
          >
            Register
            <ArrowRight size={16} />
          </button>

          <p className="reg-signin">
            Already enrolled?{" "}
            <span onClick={() => navigate("/login")}>
              Sign in
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;