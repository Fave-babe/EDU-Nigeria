import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [submitting, setSubmitting] = useState(false);

const { login } = useAuth();
const navigate = useNavigate();

function getRedirectPath(user) {
const role = (
user?.effectiveRole ||
user?.role ||
""
).toLowerCase();


// Super Admin goes to the platform dashboard.
if (role === "super_admin" || role === "superadmin") {
  return "/super-admin";
}

// School administrator goes to their school's homepage.
if (role === "admin") {
  const schoolName =
    user?.school?.name ||
    user?.schoolName ||
    "";

  const schoolSlug =
    user?.school?.slug ||
    user?.schoolSlug ||
    schoolName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return schoolSlug
    ? `/school/${schoolSlug}`
    : "/dashboard";
}

// Other school users go to their role-specific dashboard.
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

async function handleSubmit(e) {
e.preventDefault();
setError("");
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
  const destination = getRedirectPath(user);

  if (destination === "/login") {
    setError(
      "Your account role could not be identified. Please contact your administrator."
    );
    return;
  }

  navigate(destination, { replace: true });
} catch (err) {
  console.error("EDUNIGERIA LOGIN ERROR:", err);

  setError(
    err?.message ||
      "Unable to log in. Please check your details and try again."
  );
} finally {
  setSubmitting(false);
}


}

return ( <div className="login-page"> <div className="login-card"> <div className="login-header"> <div className="brand-icon-lg">E</div>


      <h1>EduNigeria</h1>

      <p>School Management System</p>

      <p>
        Sign in to access your school or manage the EduNigeria platform.
      </p>
    </div>

    <form onSubmit={handleSubmit} className="login-form">
      {error && (
        <div className="error-msg" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email">Email Address</label>

        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          autoComplete="username"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>

        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={submitting}
      >
        {submitting ? "Signing in..." : "Sign In"}
      </button>
    </form>

    <div className="login-footer">
      <Link to="/register">Register a school</Link>

      <p>
        Powered by <strong>EduNigeria</strong>
      </p>
    </div>
  </div>
</div>


);
}
