import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";

const roleOptions = [
  "Primary School Teacher",
  "Mathematics Teacher",
  "English Language Teacher",
  "Science Lab Instructor",
  "Other / General Application",
];

function CareerApplication() {
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get("role") || "";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: preselectedRole,
    experience: "",
    coverLetter: "",
    resumeFile: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, resumeFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.role) {
      setError("Please fill in your name, email, and select a role.");
      return;
    }

    setSubmitting(true);
    try {
      // Replace this with your actual API call, e.g.:
      // const formData = new FormData();
      // Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      // await fetch("/api/careers/apply", { method: "POST", body: formData });

      await new Promise((res) => setTimeout(res, 800)); // placeholder delay
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong submitting your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="application-success">
        <CheckCircle size={48} className="success-icon" />
        <h1>Application Received</h1>
        <p>
          Thank you for applying. Our HR team will review your application
          and reach out if there's a match.
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="career-application">
      <div className="application-container">
        <Link to="/careers/teaching" className="back-link">
          <ArrowLeft size={16} />
          Back to Openings
        </Link>

        <h1>Apply for a Role</h1>
        <p className="application-subtitle">
          Fill in your details below and our team will be in touch.
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="application-form">
          <label>
            Full Name *
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email Address *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Role Applying For *
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select a role</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label>
            Years of Teaching Experience
            <input
              type="text"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="e.g. 3 years"
            />
          </label>

          <label>
            Cover Letter / Why You'd Be a Great Fit
            <textarea
              name="coverLetter"
              value={form.coverLetter}
              onChange={handleChange}
              rows={5}
            />
          </label>

          <label>
            Upload CV / Resume
            <input
              type="file"
              name="resumeFile"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </label>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CareerApplication;