import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Users,
  LogOut,
} from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/authcontext";
import http from "../api/http";

import "./Home.css";
import "./SchoolHome.css";

/* ======================================================
   MAIN EDUNIGERIA HOMEPAGE
====================================================== */

function EduNigeriaHome() {
  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="home-container home-nav-container">
          <Link to="/" className="home-brand">
            <div className="home-brand-icon">
              <GraduationCap size={22} />
            </div>
            <span>EduNigeria</span>
          </Link>

          <div className="home-nav-links">
            <a href="#home" className="active">
              Home
            </a>
            <a href="#platform">Platform</a>
            <a href="#why-edunigeria">Why EduNigeria</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="home-nav-actions">
            <ThemeToggle />
            <Link to="/login" className="home-login">
              Login
            </Link>
            <Link to="/register" className="home-get-started">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="home-hero" id="home">
        <div className="hero-background-shape hero-shape-one" />
        <div className="hero-background-shape hero-shape-two" />

        <div className="home-container hero-grid">
          <div className="hero-text">
            <div className="hero-label">
              <span className="hero-label-dot" />
              Smart School Management
            </div>

            <h1>
              Better education.
              <br />
              <span>Better future.</span>
            </h1>

            <p>
              EduNigeria helps schools manage students, teachers, attendance,
              results, fees, communication, and everyday school operations from
              one simple platform.
            </p>

            <div className="hero-actions">
              <Link to="/register-school" className="hero-primary-button">
                Get Started <ArrowRight size={18} />
              </Link>

              <Link to="/login" className="hero-secondary-button">
                Login to School
              </Link>
            </div>

            <div className="hero-trust">
              <div className="trust-icons">
                <div>
                  <Users size={16} />
                </div>
                <div>
                  <BookOpen size={16} />
                </div>
                <div>
                  <GraduationCap size={16} />
                </div>
              </div>
              <span>Built for schools across Nigeria</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-window">
              <div className="dashboard-topbar">
                <div className="dashboard-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="dashboard-title">EduNigeria Dashboard</span>
              </div>

              <div className="dashboard-content">
                <div className="dashboard-welcome">
                  <div>
                    <small>Welcome back</small>
                    <h3>School Administrator</h3>
                  </div>
                  <div className="dashboard-avatar">A</div>
                </div>

                <div className="dashboard-stats">
                  <div className="mini-stat">
                    <div className="mini-stat-icon">
                      <Users size={18} />
                    </div>
                    <div>
                      <strong>428</strong>
                      <span>Students</span>
                    </div>
                  </div>

                  <div className="mini-stat">
                    <div className="mini-stat-icon">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <strong>36</strong>
                      <span>Teachers</span>
                    </div>
                  </div>

                  <div className="mini-stat">
                    <div className="mini-stat-icon">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <strong>24</strong>
                      <span>Classes</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-panel">
                  <div className="panel-heading">
                    <span>Academic Performance</span>
                    <BarChart3 size={18} />
                  </div>

                  <div className="fake-chart">
                    <div className="chart-line chart-line-one" />
                    <div className="chart-line chart-line-two" />
                    <div className="chart-line chart-line-three" />

                    <div className="chart-bars">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>

                <div className="dashboard-check">
                  <CheckCircle2 size={17} />
                  <span>School operations running smoothly</span>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-one">
              <ShieldCheck size={18} />
              <div>
                <strong>Secure</strong>
                <span>Your school data is protected</span>
              </div>
            </div>

            <div className="floating-card floating-card-two">
              <BarChart3 size={18} />
              <div>
                <strong>Performance</strong>
                <span>Track your school easily</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="platform-section" id="platform">
        <div className="home-container">
          <div className="platform-heading">
            <span className="section-label">THE PLATFORM</span>
            <h2>
              Everything your school needs,
              <br />
              all in one place.
            </h2>
            <p>
              Simple tools designed to make school management easier for
              administrators, teachers, students, parents, and bursars.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-box">
              <div className="feature-box-icon">
                <Users size={22} />
              </div>
              <h3>Student Management</h3>
              <p>
                Manage student records, enrollment, classes, and academic
                information from one place.
              </p>
              <a href="#platform">
                Learn more <ArrowRight size={15} />
              </a>
            </div>

            <div className="feature-box">
              <div className="feature-box-icon">
                <GraduationCap size={22} />
              </div>
              <h3>Teacher Management</h3>
              <p>
                Help teachers manage students, attendance, assignments, results,
                and lesson activities.
              </p>
              <a href="#platform">
                Learn more <ArrowRight size={15} />
              </a>
            </div>

            <div className="feature-box">
              <div className="feature-box-icon">
                <BookOpen size={22} />
              </div>
              <h3>Academic Management</h3>
              <p>
                Organize subjects, classes, timetables, assignments, results,
                and academic sessions.
              </p>
              <a href="#platform">
                Learn more <ArrowRight size={15} />
              </a>
            </div>

            <div className="feature-box">
              <div className="feature-box-icon">
                <BarChart3 size={22} />
              </div>
              <h3>School Insights</h3>
              <p>
                Get useful information about attendance, enrollment, finances,
                and school performance.
              </p>
              <a href="#platform">
                Learn more <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section" id="why-edunigeria">
        <div className="home-container why-grid">
          <div className="why-visual">
            <div className="why-card">
              <div className="why-card-header">
                <div className="why-card-icon">
                  <BarChart3 size={21} />
                </div>
                <div>
                  <strong>School Overview</strong>
                  <span>Academic session</span>
                </div>
              </div>

              <div className="progress-item">
                <div>
                  <span>Student Attendance</span>
                  <strong>92%</strong>
                </div>
                <div className="progress-bar">
                  <span style={{ width: "92%" }} />
                </div>
              </div>

              <div className="progress-item">
                <div>
                  <span>Academic Performance</span>
                  <strong>84%</strong>
                </div>
                <div className="progress-bar">
                  <span style={{ width: "84%" }} />
                </div>
              </div>

              <div className="progress-item">
                <div>
                  <span>Fee Collection</span>
                  <strong>78%</strong>
                </div>
                <div className="progress-bar">
                  <span style={{ width: "78%" }} />
                </div>
              </div>
            </div>

            <div className="why-floating">
              <CheckCircle2 size={18} />
              <span>Everything connected</span>
            </div>
          </div>

          <div className="why-content">
            <span className="section-label">WHY EDUNIGERIA</span>
            <h2>
              Built for the reality of
              <br />
              Nigerian schools.
            </h2>

            <p>
              EduNigeria is designed around the needs of schools in Nigeria,
              helping school owners and staff spend less time managing paperwork
              and more time focusing on education.
            </p>

            <div className="benefit-list">
              <div className="benefit-item">
                <CheckCircle2 size={20} />
                <div>
                  <strong>Simple to use</strong>
                  <span>
                    Easy-to-understand tools for school administrators and
                    teachers.
                  </span>
                </div>
              </div>

              <div className="benefit-item">
                <CheckCircle2 size={20} />
                <div>
                  <strong>Made for Nigerian schools</strong>
                  <span>
                    Designed with Nigerian school operations and workflows in
                    mind.
                  </span>
                </div>
              </div>

              <div className="benefit-item">
                <CheckCircle2 size={20} />
                <div>
                  <strong>One connected platform</strong>
                  <span>
                    Keep students, teachers, parents, finances, and academics
                    connected.
                  </span>
                </div>
              </div>
            </div>

            <Link to="/register-school" className="why-button">
              Register Your School <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-cta" id="contact">
        <div className="cta-pattern" />
        <div className="home-container cta-content">
          <div className="cta-icon">
            <GraduationCap size={25} />
          </div>
          <span className="cta-label">GET STARTED WITH EDUNIGERIA</span>
          <h2>
            Ready to manage your school
            <br />
            the smarter way?
          </h2>
          <p>
            Join EduNigeria and bring your school's everyday operations together
            in one platform.
          </p>

          <div className="cta-actions">
            <Link to="/register-school" className="cta-primary">
              Register Your School <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="cta-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-container footer-content">
          <Link to="/" className="footer-brand">
            <div className="footer-brand-icon">
              <GraduationCap size={20} />
            </div>
            <span>EduNigeria</span>
          </Link>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#platform">Platform</a>
            <a href="#why-edunigeria">Why EduNigeria</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ======================================================
   INDIVIDUAL SCHOOL HOMEPAGE
====================================================== */

function SchoolHome({ school }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      }
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="school-page">
      <nav className="school-navbar">
        <div className="school-nav-container">
          <Link to="/" className="school-brand">
            <div className="school-logo">
              <GraduationCap size={25} />
            </div>
            <div className="school-brand-text">
              <strong>{school.name}</strong>
              <span>{school.type}</span>
            </div>
          </Link>

          <div className="school-nav-links">
            <a href="#school-home">Home</a>
            <a href="#about">About</a>
            <a href="#programs">Programs</a>
            <a href="#admissions">Admissions</a>
          </div>

          <div className="school-auth-buttons">
            {/* SCHOOL LOGIN */}
            <Link
  to={`/school-login?school=${encodeURIComponent(
    school._id
  )}&schoolName=${encodeURIComponent(school.name)}`}
  className="school-nav-button"
>
  School Portal <ArrowRight size={15} />
</Link>

            {/* SCHOOL REGISTRATION */}
            <Link
              to={`/school/register?school=${encodeURIComponent(school._id)}`}
              className="school-nav-button"
            >
              Register <ArrowRight size={15} />
            </Link>

            {/* LOGOUT */}
            <button
              type="button"
              className="school-nav-button school-logout-button"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="school-hero" id="school-home">
        <div className="school-hero-container">
          <div>
            <div className="school-hero-label">
              <span />
              Welcome to {school.name}
            </div>

            <h1>
              Building minds.
              <br />
              <span>Shaping futures.</span>
            </h1>

            <p className="school-hero-description">
              {school.name} is committed to providing quality education,
              developing strong character, and helping every learner discover
              their potential.
            </p>

            <div className="school-hero-actions">
              <Link
                to={`/school/register?school=${encodeURIComponent(school._id)}`}
                className="school-primary-button"
              >
                Register with Our School <ArrowRight size={17} />
              </Link>

              <a href="#about" className="school-secondary-button">
                Discover Our School
              </a>
            </div>
          </div>

          <div className="school-hero-visual">
            <div className="school-image-card">
              <div className="school-image-content">
                <div className="school-image-icon">
                  <GraduationCap size={34} />
                </div>
                <div>
                  <h3>{school.name}</h3>
                  <p>{school.motto}</p>
                </div>
              </div>
            </div>

            <div className="school-stat-card">
              <strong>Excellence</strong>
              <span>Every learner. Every opportunity.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="school-section" id="about">
        <div className="school-container">
          <div className="school-section-heading">
            <span className="school-section-label">About Our School</span>
            <h2>
              Education that goes
              <br />
              beyond the classroom.
            </h2>
            <p>
              At {school.name}, we believe education should develop the whole
              child. Our learning environment encourages curiosity,
              responsibility, confidence, creativity, and academic excellence.
            </p>
          </div>

          <div className="school-feature-grid">
            <div className="school-feature-card">
              <div className="school-feature-icon">
                <BookOpen size={23} />
              </div>
              <h3>Quality Education</h3>
              <p>
                We provide structured learning experiences designed to help
                students build strong academic foundations.
              </p>
            </div>

            <div className="school-feature-card">
              <div className="school-feature-icon">
                <GraduationCap size={23} />
              </div>
              <h3>Student Development</h3>
              <p>
                We focus on developing confident, responsible, creative, and
                independent learners.
              </p>
            </div>

            <div className="school-feature-card">
              <div className="school-feature-icon">
                <Users size={23} />
              </div>
              <h3>Strong Community</h3>
              <p>
                Teachers, parents, and students work together to create a
                supportive learning community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="school-section school-why" id="programs">
        <div className="school-container school-why-grid">
          <div>
            <div className="school-section-heading">
              <span className="school-section-label">Our Approach</span>
              <h2>
                Preparing students
                <br />
                for the future.
              </h2>
              <p>
                Our approach combines academic learning with character
                development and practical skills that students can carry
                throughout life.
              </p>
            </div>

            <div className="school-check-list">
              <div className="school-check">
                <CheckCircle2 className="school-check-icon" size={21} />
                <div>
                  <strong>Academic Excellence</strong>
                  <span>
                    Helping students build strong knowledge and learning habits.
                  </span>
                </div>
              </div>

              <div className="school-check">
                <CheckCircle2 className="school-check-icon" size={21} />
                <div>
                  <strong>Character Building</strong>
                  <span>
                    Encouraging discipline, integrity, respect, and
                    responsibility.
                  </span>
                </div>
              </div>

              <div className="school-check">
                <CheckCircle2 className="school-check-icon" size={21} />
                <div>
                  <strong>Future Ready Skills</strong>
                  <span>
                    Preparing learners for the opportunities and challenges
                    ahead.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="school-info-card">
            <h3>Why {school.name}?</h3>
            <p>
              We are committed to creating a school environment where every
              learner can feel supported, challenged, and inspired to achieve
              their best.
            </p>

            <div className="school-info-items">
              <div className="school-info-item">
                <GraduationCap size={19} />
                <span>Student-focused learning</span>
              </div>
              <div className="school-info-item">
                <ShieldCheck size={19} />
                <span>Safe and supportive environment</span>
              </div>
              <div className="school-info-item">
                <BarChart3 size={19} />
                <span>Focus on academic progress</span>
              </div>
              <div className="school-info-item">
                <Users size={19} />
                <span>Strong parent-school partnership</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="school-admission" id="admissions">
        <div className="school-admission-box">
          <span className="school-section-label">Admissions</span>
          <h2>
            Give your child
            <br />a strong start.
          </h2>
          <p>
            Interested in joining {school.name}? Register with the school to
            begin your journey.
          </p>

          <Link
            to={`/school/register?school=${encodeURIComponent(school._id)}`}
            className="school-admission-button"
          >
            Register Now <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="school-footer">
        <div className="school-footer-grid">
          <div>
            <h3>{school.name}</h3>
            <p>
              {school.motto}. Providing a supportive environment where learners
              can grow, achieve, and prepare for the future.
            </p>
          </div>

          <div className="school-footer-column">
            <h4>School</h4>
            <a href="#school-home">Home</a>
            <a href="#about">About</a>
            <a href="#programs">Programs</a>
            <a href="#admissions">Admissions</a>
          </div>

          <div className="school-footer-column">
            <h4>Portal</h4>
            <Link to="/login">Student / Parent Login</Link>
            <Link to="/login">Staff Login</Link>
            <Link to="/">Powered by EduNigeria</Link>
          </div>
        </div>

        <div className="school-footer-bottom">
          © {new Date().getFullYear()} {school.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* ======================================================
   SCHOOL DATA HELPERS
====================================================== */

function createSlug(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function unwrapSchoolsResponse(response) {
  const body = response?.data ?? response;

  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.schools)) return body.schools;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.schools)) return body.data.schools;

  return [];
}

/* ======================================================
   HOME ROUTER
====================================================== */

export default function Home() {
  const { schoolSlug } = useParams();

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!schoolSlug) {
      setSchool(null);
      setLoading(false);
      setError("");
      return undefined;
    }

    let cancelled = false;

    async function loadSchool() {
      setLoading(true);
      setError("");
      setSchool(null);

      try {
        const response = await http.get("/school/public");
        const schoolsList = unwrapSchoolsResponse(response);

        const matchedSchool = schoolsList.find((item) => {
          const itemSlug = item.slug || createSlug(item.name);
          return itemSlug === schoolSlug;
        });

        if (!matchedSchool) {
          if (!cancelled) setError("School homepage not found.");
          return;
        }

        if (!cancelled) {
          setSchool({
            ...matchedSchool,
            name: matchedSchool.name || "School",
            type: matchedSchool.type || matchedSchool.schoolType || "School",
            location:
              matchedSchool.location ||
              [matchedSchool.city, matchedSchool.state]
                .filter(Boolean)
                .join(", ") ||
              "Nigeria",
            motto: matchedSchool.motto || "Learning Today. Leading Tomorrow.",
          });
        }
      } catch (err) {
        console.error("FAILED TO LOAD SCHOOL HOMEPAGE:", err);

        if (!cancelled) {
          setError(
            "Unable to load this school's homepage. Please check that the backend is running and try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSchool();

    return () => {
      cancelled = true;
    };
  }, [schoolSlug]);

  if (!schoolSlug) {
    return <EduNigeriaHome />;
  }

  if (loading) {
    return (
      <div className="school-page">
        <p>Loading school homepage...</p>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="school-page">
        <h1>School Homepage Unavailable</h1>
        <p>{error || "School information could not be found."}</p>
        <Link to="/">Return Home</Link>
      </div>
    );
  }

  return <SchoolHome school={school} />;
}
