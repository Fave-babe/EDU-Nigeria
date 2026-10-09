
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, School } from "lucide-react";
import { registerSchoolApplication } from "../api/school.api";

function Register() {
  const navigate = useNavigate();

  // School information
  const [schoolName, setSchoolName] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Nigeria");

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!schoolName.trim()) {
      alert("Please enter the school name.");
      return;
    }

    if (!schoolType) {
      alert("Please select the school type.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter the school email.");
      return;
    }

    if (!password) {
      alert("Please create a school password.");
      return;
    }

    if (password.length < 8) {
      alert("The school password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("The passwords do not match.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter the school phone number.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter the school address.");
      return;
    }

    if (!city.trim()) {
      alert("Please enter the city.");
      return;
    }

    if (!state.trim()) {
      alert("Please enter the state.");
      return;
    }

    const schoolData = {
      name: schoolName.trim(),
      schoolType,
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim() || "Nigeria",
    };

    try {
      setSubmitting(true);

      // Submit the school's own login credentials.
      // Never log the password to the browser console.
      await registerSchoolApplication(schoolData);

      alert(
        "School registration submitted successfully. Your application is waiting for Super Admin approval. You can log in after your school is approved."
      );

      navigate("/school/application-pending");
    } catch (error) {
      console.error("SCHOOL REGISTRATION ERROR:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to submit school registration. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="school-register-page">
      <style>{`
        .school-register-page {
          --ink: #1557b0;
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
          .school-register-page {
            align-items: center;
          }
        }

        .school-register-card {
          width: 100%;
          max-width: 520px;
          background: #ffffff;
          border: 1px solid rgba(33, 48, 31, 0.1);
          border-radius: 16px;
          box-shadow:
            0 1px 3px rgba(21, 87, 176, 0.06),
            0 8px 28px rgba(21, 87, 176, 0.08);
          padding: 34px 30px;
        }

        .school-register-icon {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(21, 87, 176, 0.08);
          color: var(--ink);
          margin-bottom: 16px;
        }

        .school-register-eyebrow {
          font-family: monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--blue);
          opacity: 0.6;
        }

        .school-register-card h2 {
          font-size: 1.5rem;
          color: var(--ink);
          margin: 7px 0 6px;
          font-weight: 600;
        }

        .school-register-subtitle {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(33, 48, 31, 0.58);
          margin: 0 0 24px;
        }

        .school-register-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .school-register-section-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
          margin-top: 8px;
          margin-bottom: -5px;
        }

        .school-register-label {
          display: block;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(28, 60, 11, 0.5);
          margin-bottom: 7px;
        }

        .school-register-input,
        .school-register-select {
          width: 100%;
          box-sizing: border-box;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(33, 48, 31, 0.15);
          outline: none;
          padding: 8px 0;
          font-size: 14px;
          color: var(--ink);
          transition: border-color 0.2s ease;
        }

        .school-register-select {
          background: #ffffff;
        }

        .school-register-input:focus,
        .school-register-select:focus {
          border-bottom-color: var(--blue);
        }

        .school-register-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .school-register-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--ink);
          color: #ffffff;
          font-weight: 500;
          font-size: 14px;
          padding: 12px;
          border: none;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-top: 5px;
        }

        .school-register-submit:hover {
          background: var(--blue);
        }

        .school-register-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .school-register-login {
          text-align: center;
          font-size: 13px;
          color: rgba(33, 48, 31, 0.6);
          margin: 3px 0 0;
        }

        .school-register-login span {
          color: var(--blue);
          font-weight: 500;
          cursor: pointer;
        }

        .school-register-note {
          background: rgba(21, 87, 176, 0.05);
          border-radius: 8px;
          padding: 12px 13px;
          font-size: 12px;
          line-height: 1.55;
          color: rgba(33, 48, 31, 0.62);
        }

        @media (max-width: 520px) {
          .school-register-card {
            padding: 28px 22px;
          }

          .school-register-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="school-register-card">
        <div className="school-register-icon">
          <School size={24} />
        </div>

        <span className="school-register-eyebrow">
          EduNigeria · School Registration
        </span>

        <h2>Register your school</h2>

        <p className="school-register-subtitle">
          Register your school using its official email and password.
          Your application will be reviewed by the Super Admin before
          your school can access its dashboard.
        </p>

        <form onSubmit={handleSubmit} className="school-register-form">
          <div className="school-register-section-title">
            School Information
          </div>

          <div>
            <label className="school-register-label">
              School name
            </label>

            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="school-register-input"
              placeholder="Favour International School"
              autoComplete="organization"
              required
            />
          </div>

          <div>
            <label className="school-register-label">
              School type
            </label>

            <select
              value={schoolType}
              onChange={(e) => setSchoolType(e.target.value)}
              className="school-register-select"
              required
            >
              <option value="" disabled>
                Select school type
              </option>

              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Primary & Secondary">
                Primary &amp; Secondary
              </option>
            </select>
          </div>

          <div className="school-register-row">
            <div>
              <label className="school-register-label">
                School email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="school-register-input"
                placeholder="school@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="school-register-label">
                Phone number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="school-register-input"
                placeholder="080X XXX XXXX"
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div>
            <label className="school-register-label">
              School password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="school-register-input"
              placeholder="Create a school password"
              autoComplete="new-password"
              minLength={8}
              required
            />

            <small>
              Use at least 8 characters. The school will use this password
              to log in.
            </small>
          </div>

          <div>
            <label className="school-register-label">
              Confirm school password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="school-register-input"
              placeholder="Enter the password again"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div>
            <label className="school-register-label">
              School address
            </label>

            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="school-register-input"
              placeholder="12 Allen Avenue"
              autoComplete="street-address"
              required
            />
          </div>

          <div className="school-register-row">
            <div>
              <label className="school-register-label">
                City
              </label>

              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="school-register-input"
                placeholder="Ikeja"
                autoComplete="address-level2"
                required
              />
            </div>

            <div>
              <label className="school-register-label">
                State
              </label>

              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="school-register-input"
                placeholder="Lagos"
                autoComplete="address-level1"
                required
              />
            </div>
          </div>

          <div>
            <label className="school-register-label">
              Country
            </label>

            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="school-register-input"
              placeholder="Nigeria"
              autoComplete="country-name"
              required
            />
          </div>

          <div className="school-register-note">
            <strong>What happens next?</strong>
            <br />
            Your school application will remain pending until the
            EduNigeria Super Admin reviews and approves it. After approval,
            you can log in with your school's email and password.
          </div>

          <button
            type="submit"
            className="school-register-submit"
            disabled={submitting}
          >
            {submitting
              ? "Submitting Application..."
              : "Submit School Application"}

            {!submitting && <ArrowRight size={16} />}
          </button>

          <p className="school-register-login">
            Already have an approved school account?{" "}
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

