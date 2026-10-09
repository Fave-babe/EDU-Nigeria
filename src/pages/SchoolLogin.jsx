import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import http from "../api/http";

export default function SchoolLogin() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [submitting, setSubmitting] = useState(false);
const [school, setSchool] = useState(null);
const [schoolLoading, setSchoolLoading] = useState(true);

const { login } = useAuth();
const navigate = useNavigate();
const [searchParams] = useSearchParams();

const schoolId = searchParams.get("school");
const schoolNameFromUrl = searchParams.get("schoolName");

useEffect(() => {
let cancelled = false;


async function loadSchool() {
  if (!schoolId) {
    setSchool(null);
    setSchoolLoading(false);
    return;
  }

  try {
    const response = await http.get("/school/public");
    const body = response?.data ?? response;

    const schools = Array.isArray(body)
      ? body
      : Array.isArray(body?.schools)
        ? body.schools
        : Array.isArray(body?.data?.schools)
          ? body.data.schools
          : Array.isArray(body?.data)
            ? body.data
            : [];

    const selectedSchool = schools.find(
      (item) => String(item._id) === String(schoolId)
    );

    if (!cancelled) {
      setSchool(selectedSchool || null);
    }
  } catch (err) {
    console.error("FAILED TO LOAD SCHOOL:", err);

    if (!cancelled) {
      setSchool(null);
    }
  } finally {
    if (!cancelled) {
      setSchoolLoading(false);
    }
  }
}

loadSchool();

return () => {
  cancelled = true;
};


}, [schoolId]);

function getRedirectPath(user) {
const role = (
user?.effectiveRole ||
user?.role ||
""
).toLowerCase();

if (role === "admin") return "/dashboard";

if (role === "staff") {
  const staffRole = user?.staffRole?.toLowerCase();

  if (staffRole === "counsellor") return "/Cdashboard";
  if (staffRole === "bursar") return "/Bdashboard";

  return "/Sdashboard";
}

if (role === "counsellor") return "/Cdashboard";
if (role === "teacher") return "/Tdashboard";
if (role === "bursar") return "/Bdashboard";
if (role === "student") return "/Stdashboard";
if (role === "parent") return "/Pdashboard";

return "/login";


}

async function handleSubmit(event) {
event.preventDefault();
setError("");


if (!schoolId) {
  setError(
    "Please open the login page from your school's website."
  );
  return;
}

if (schoolLoading) {
  setError("Please wait while your school information loads.");
  return;
}

if (!school) {
  setError(
    "We could not find this school. Please return to the school homepage."
  );
  return;
}

setSubmitting(true);

try {
  const result = await login(email.trim(), password);

  if (!result?.success) {
    setError(
      result?.message ||
        "Login failed. Please check your email and password."
    );
    return;
  }

  const user = result.user;

  const role = (
    user?.effectiveRole ||
    user?.role ||
    ""
  ).toLowerCase();

  if (role === "super_admin" || role === "superadmin") {
    setError(
      "This is a school login. Please use the EduNigeria Super Admin login."
    );
    return;
  }

  const userSchoolId =
    user?.school?._id ||
    user?.school?.id ||
    user?.schoolId;

  if (
    !userSchoolId ||
    String(userSchoolId) !== String(schoolId)
  ) {
    setError(
      "This account does not belong to this school. Please use your own school's login page."
    );
    return;
  }

  const destination = getRedirectPath(user);

  if (destination === "/login") {
    setError(
      "Your account role is not supported for school login. Please contact your school administrator."
    );
    return;
  }

  navigate(destination, { replace: true });
} catch (err) {
  console.error("SCHOOL LOGIN ERROR:", err);

  setError(
    err?.message ||
      "Unable to log in. Please try again."
  );
} finally {
  setSubmitting(false);
}


}

const displayedSchoolName =
school?.name || schoolNameFromUrl || "School Portal";

return ( <div className="login-page"> <div className="login-card"> <div className="login-header"> <div className="brand-icon-lg">
{displayedSchoolName.charAt(0).toUpperCase()} </div>


      <p>Welcome to</p>

      <h1 className="login-school-name">
        {schoolLoading
          ? "Loading school..."
          : displayedSchoolName}
      </h1>

      <p>School Management Portal</p>
      <p>Sign in to access your school account.</p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="login-form"
    >
      {error && (
        <div className="error-msg">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="school-login-email">
          School Account Email
        </label>

        <input
          id="school-login-email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="Enter your school account email"
          autoComplete="username"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="school-login-password">
          Password
        </label>

        <input
          id="school-login-password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={submitting || schoolLoading}
      >
        {submitting ? "Signing in..." : "Sign In to School"}
      </button>
    </form>

    <div className="login-footer">
      <Link
        to={
          schoolId
            ? `/school/register?school=${encodeURIComponent(schoolId)}`
            : "/register"
        }
      >
        Register with this school
      </Link>

      <p>
        Powered by <strong>EduNigeria</strong>
      </p>
    </div>
  </div>
</div>


);
}
