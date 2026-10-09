import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GraduationCap, ArrowLeft, UserPlus, Eye, EyeOff } from "lucide-react";
import http from "../api/http";
import { authApi } from "../api/auth.api";
import "./SchoolUserRegister.css";

const ROLES = [
{ value: "student", label: "Student" },
{ value: "parent", label: "Parent" },
{ value: "teacher", label: "Teacher" },
{ value: "staff", label: "Staff" },
];

function getResponseData(response) {
return response?.data?.data ?? response?.data ?? response;
}

export default function SchoolUserRegister() {
const navigate = useNavigate();
const [searchParams] = useSearchParams();

const schoolId = searchParams.get("school");

const [school, setSchool] = useState(null);
const [role, setRole] = useState("student");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [loadingSchool, setLoadingSchool] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const [form, setForm] = useState({
firstName: "",
lastName: "",
fullName: "",
email: "",
password: "",
confirmPassword: "",
gender: "",
previousSchool: "",
phone: "",
staffRole: "",
});

useEffect(() => {
let cancelled = false;


async function loadSchool() {
  setLoadingSchool(true);
  setError("");

  if (!schoolId) {
    setError(
      "No school was selected. Please return to the school's homepage and click Register."
    );
    setLoadingSchool(false);
    return;
  }

  try {
    const response = await http.get("/school/public");
    const data = getResponseData(response);

    const schools = Array.isArray(data)
      ? data
      : Array.isArray(data?.schools)
        ? data.schools
        : Array.isArray(data?.data)
          ? data.data
          : [];

    const selectedSchool = schools.find(
      (item) => String(item._id) === String(schoolId)
    );

    if (!selectedSchool) {
      throw new Error(
        "This school could not be found. Please return to its homepage."
      );
    }

    if (
      selectedSchool.status &&
      selectedSchool.status !== "approved"
    ) {
      throw new Error(
        "This school has not been approved for registration."
      );
    }

    if (selectedSchool.isActive === false) {
      throw new Error(
        "Registration for this school is currently unavailable."
      );
    }

    if (!cancelled) {
      setSchool(selectedSchool);
    }
  } catch (err) {
    if (!cancelled) {
      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Unable to load this school. Please try again."
      );
    }
  } finally {
    if (!cancelled) {
      setLoadingSchool(false);
    }
  }
}

loadSchool();

return () => {
  cancelled = true;
};


}, [schoolId]);

function handleChange(event) {
const { name, value } = event.target;


setForm((previous) => ({
  ...previous,
  [name]: value,
}));

setError("");
setSuccess("");


}

function handleRoleChange(event) {
setRole(event.target.value);
setError("");
setSuccess("");
}

async function handleSubmit(event) {
event.preventDefault();

setError("");
setSuccess("");

if (!schoolId || !school?._id) {
  setError("Please select a valid school before registering.");
  return;
}

if (!form.email.trim()) {
  setError("Please enter your email address.");
  return;
}

if (form.password.length < 8) {
  setError("Your password must contain at least 8 characters.");
  return;
}

if (form.password !== form.confirmPassword) {
  setError("Your passwords do not match.");
  return;
}

if (role === "student" || role === "parent" || role === "teacher") {
  if (!form.firstName.trim() || !form.lastName.trim()) {
    setError("Please enter your first name and last name.");
    return;
  }
}

if (role === "student" && !form.gender) {
  setError("Please select your gender.");
  return;
}

if (role === "staff" && !form.fullName.trim()) {
  setError("Please enter your full name.");
  return;
}

setSubmitting(true);

try {
  const payload = {
    role,
    email: form.email.trim().toLowerCase(),
    password: form.password,
    school: school._id,
  };

  if (role === "student") {
    payload.firstName = form.firstName.trim();
    payload.lastName = form.lastName.trim();
    payload.gender = form.gender;
    payload.previousSchool = form.previousSchool.trim();
  }

  if (role === "parent") {
    payload.firstName = form.firstName.trim();
    payload.lastName = form.lastName.trim();
  }

  if (role === "teacher") {
    payload.firstName = form.firstName.trim();
    payload.lastName = form.lastName.trim();
  }

  if (role === "staff") {
    payload.fullName = form.fullName.trim();
    payload.phone = form.phone.trim();
    payload.staffRole = form.staffRole.trim();
  }

  await authApi.register(payload);

  setSuccess(
    "Your registration was successful. You can now proceed to the login page."
  );

  setTimeout(() => {
    navigate("/login", { replace: true });
  }, 1800);
} catch (err) {
  setError(
    err?.response?.data?.message ||
      err?.message ||
      "Registration failed. Please check your details and try again."
  );
} finally {
  setSubmitting(false);
}


}

if (loadingSchool) {
return ( <main className="school-user-register-page"> <div className="school-user-register-card"> <p className="school-register-loading">
Loading school information... </p> </div> </main>
);
}

return ( <main className="school-user-register-page"> <div className="school-user-register-container">
<Link
to={school ? `/school/${school.slug}` : "/"}
className="school-register-back"
> <ArrowLeft size={18} />
Back to school homepage </Link>

```
    <section className="school-user-register-card">
      <div className="school-register-brand">
        <div className="school-register-logo">
          <GraduationCap size={30} />
        </div>

        <span>EduNigeria</span>
      </div>

      <div className="school-register-heading">
        <h1>Create Your Account</h1>

        <p>
          Register with{" "}
          <strong>{school?.name || "your selected school"}</strong>
        </p>
      </div>

      {error && (
        <div className="school-register-alert school-register-error">
          {error}
        </div>
      )}

      {success && (
        <div className="school-register-alert school-register-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="school-register-field">
          <label htmlFor="role">I want to register as</label>

          <select
            id="role"
            value={role}
            onChange={handleRoleChange}
            required
          >
            {ROLES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {role === "staff" ? (
          <>
            <div className="school-register-field">
              <label htmlFor="fullName">Full name</label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="school-register-field">
              <label htmlFor="staffRole">Job title</label>

              <input
                id="staffRole"
                name="staffRole"
                type="text"
                placeholder="e.g. Librarian or IT Support"
                value={form.staffRole}
                onChange={handleChange}
              />
            </div>

            <div className="school-register-field">
              <label htmlFor="phone">Phone number</label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
          </>
        ) : (
          <>
            <div className="school-register-two-columns">
              <div className="school-register-field">
                <label htmlFor="firstName">First name</label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />
              </div>

              <div className="school-register-field">
                <label htmlFor="lastName">Last name</label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            {role === "student" && (
              <>
                <div className="school-register-field">
                  <label htmlFor="gender">Gender</label>

                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="school-register-field">
                  <label htmlFor="previousSchool">
                    Previous school (optional)
                  </label>

                  <input
                    id="previousSchool"
                    name="previousSchool"
                    type="text"
                    placeholder="Enter previous school"
                    value={form.previousSchool}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </>
        )}

        <div className="school-register-field">
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div className="school-register-field">
          <label htmlFor="password">Password</label>

          <div className="school-register-password">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        <div className="school-register-field">
          <label htmlFor="confirmPassword">Confirm password</label>

          <div className="school-register-password">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter your password again"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((value) => !value)
              }
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        <button
          className="school-register-submit"
          type="submit"
          disabled={submitting || Boolean(success)}
        >
          <UserPlus size={19} />

          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="school-register-login">
        Already have an account? <Link to="/login">Log in</Link>
      </p>

      <p className="school-register-footer">
        Your account will be associated with{" "}
        <strong>{school?.name || "your selected school"}</strong>.
      </p>
    </section>
  </div>
</main>
);
}
