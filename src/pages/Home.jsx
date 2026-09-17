import React from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Users,
  BarChart3,
  School,
  ShieldCheck,
} from "lucide-react";

import "./Home.css";

const features = [
  {
    icon: Users,
    title: "Student Management",
    text: "Keep student records organized and easily accessible from one place.",
  },
  {
    icon: BookOpen,
    title: "Academic Management",
    text: "Manage classes, subjects, assignments, results and academic activities.",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance Tracking",
    text: "Record and monitor student attendance without unnecessary paperwork.",
  },
  {
    icon: BarChart3,
    title: "Results & Reports",
    text: "Create clear academic reports and keep track of student performance.",
  },
];

const benefits = [
  "Manage your school's daily operations",
  "Keep student and staff information organized",
  "Track attendance and academic performance",
  "Improve communication between schools and parents",
];

function Home() {
  return (
    <div className="home-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="home-navbar">
        <div className="home-nav-container">

          <Link to="/" className="home-brand">
            <div className="home-brand-icon">
              <GraduationCap size={25} />
            </div>

            <div>
              <strong>EduNigeria</strong>
              <span>Education Management</span>
            </div>
          </Link>

          <nav className="home-nav-links">
            <Link to="/" className="active">
              Home
            </Link>

            <Link to="/about">
              About
            </Link>

            <Link to="/careers/teaching">
              Careers
            </Link>
          </nav>

          <div className="home-nav-actions">
            <Link
              to="/login"
              className="home-login"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="home-get-started"
            >
              Get Started
              <ArrowRight size={17} />
            </Link>
          </div>

        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <main>

        <section className="home-hero">

          <div className="hero-background-shape hero-shape-one" />
          <div className="hero-background-shape hero-shape-two" />

          <div className="home-container hero-grid">

            <div className="hero-text">

              <div className="hero-label">
                <span className="hero-label-dot" />
                Built for Nigerian Schools
              </div>

              <h1>
                Better education.
                <span>Better future.</span>
              </h1>

              <p>
                EduNigeria brings students, teachers, administrators
                and parents together with simple tools designed to
                make school management easier.
              </p>

              <div className="hero-actions">

                <Link
                  to="/register"
                  className="hero-primary-button"
                >
                  Get Started
                  <ArrowRight size={19} />
                </Link>

                <Link
                  to="/about"
                  className="hero-secondary-button"
                >
                  Explore EduNigeria
                </Link>

              </div>

              <div className="hero-trust">

                <div className="trust-icons">
                  <div>
                    <School size={16} />
                  </div>

                  <div>
                    <GraduationCap size={16} />
                  </div>

                  <div>
                    <Users size={16} />
                  </div>
                </div>

                <p>
                  Designed for schools, teachers,
                  students and families.
                </p>

              </div>

            </div>

            {/* HERO VISUAL */}

            <div className="hero-visual">

              <div className="dashboard-window">

                <div className="dashboard-topbar">
                  <div className="dashboard-dots">
                    <span />
                    <span />
                    <span />
                  </div>

                  <span className="dashboard-title">
                    EduNigeria Dashboard
                  </span>
                </div>

                <div className="dashboard-content">

                  <div className="dashboard-welcome">
                    <div>
                      <span>School Overview</span>
                      <h3>Good morning 👋</h3>
                    </div>

                    <div className="dashboard-avatar">
                      E
                    </div>
                  </div>

                  <div className="dashboard-stats">

                    <div className="mini-stat">
                      <div className="mini-stat-icon">
                        <Users size={17} />
                      </div>

                      <div>
                        <strong>1,248</strong>
                        <span>Students</span>
                      </div>
                    </div>

                    <div className="mini-stat">
                      <div className="mini-stat-icon">
                        <BookOpen size={17} />
                      </div>

                      <div>
                        <strong>48</strong>
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

                    <CheckCircle2 size={18} />

                    <span>
                      School activities are up to date
                    </span>

                  </div>

                </div>

              </div>

              <div className="floating-card floating-card-one">
                <ShieldCheck size={19} />

                <div>
                  <strong>Secure</strong>
                  <span>School records</span>
                </div>
              </div>

              <div className="floating-card floating-card-two">
                <BarChart3 size={19} />

                <div>
                  <strong>Academic</strong>
                  <span>Performance</span>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            PLATFORM INTRO
        ===================================================== */}

        <section className="platform-section">

          <div className="home-container">

            <div className="platform-heading">

              <span className="section-label">
                ONE PLATFORM
              </span>

              <h2>
                Everything your school needs,
                <span>in one place.</span>
              </h2>

              <p>
                From student records to academic results,
                EduNigeria helps schools spend less time
                dealing with paperwork and more time focused
                on education.
              </p>

            </div>

            <div className="feature-grid">

              {features.map((feature) => {

                const Icon = feature.icon;

                return (
                  <div
                    className="feature-box"
                    key={feature.title}
                  >

                    <div className="feature-box-icon">
                      <Icon size={22} />
                    </div>

                    <h3>
                      {feature.title}
                    </h3>

                    <p>
                      {feature.text}
                    </p>

                    <Link to="/about">
                      Learn more
                      <ArrowRight size={15} />
                    </Link>

                  </div>
                );
              })}

            </div>

          </div>

        </section>

        {/* =====================================================
            WHY EDUNIGERIA
        ===================================================== */}

        <section className="why-section">

          <div className="home-container why-grid">

            <div className="why-visual">

              <div className="why-card">

                <div className="why-card-header">
                  <div className="why-card-icon">
                    <LayoutDashboard size={20} />
                  </div>

                  <div>
                    <strong>School Management</strong>
                    <span>Everything connected</span>
                  </div>
                </div>

                <div className="progress-item">
                  <div>
                    <span>Student Records</span>
                    <strong>94%</strong>
                  </div>

                  <div className="progress-bar">
                    <span style={{ width: "94%" }} />
                  </div>
                </div>

                <div className="progress-item">
                  <div>
                    <span>Attendance</span>
                    <strong>88%</strong>
                  </div>

                  <div className="progress-bar">
                    <span style={{ width: "88%" }} />
                  </div>
                </div>

                <div className="progress-item">
                  <div>
                    <span>Academic Reports</span>
                    <strong>91%</strong>
                  </div>

                  <div className="progress-bar">
                    <span style={{ width: "91%" }} />
                  </div>
                </div>

              </div>

              <div className="why-floating">
                <CheckCircle2 size={18} />

                <div>
                  <strong>Simple & Organized</strong>
                  <span>Built for everyday school work</span>
                </div>
              </div>

            </div>

            <div className="why-content">

              <span className="section-label">
                WHY EDUNIGERIA
              </span>

              <h2>
                Technology that makes
                <span>education easier.</span>
              </h2>

              <p>
                Schools shouldn't have to rely on scattered
                spreadsheets, paperwork and disconnected
                systems. EduNigeria brings important school
                activities together in one platform.
              </p>

              <div className="benefit-list">

                {benefits.map((benefit) => (
                  <div
                    className="benefit-item"
                    key={benefit}
                  >
                    <CheckCircle2 size={19} />

                    <span>
                      {benefit}
                    </span>
                  </div>
                ))}

              </div>

              <Link
                to="/about"
                className="why-button"
              >
                Learn More
                <ArrowRight size={17} />
              </Link>

            </div>

          </div>

        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="home-cta">

          <div className="cta-pattern" />

          <div className="home-container cta-content">

            <div className="cta-icon">
              <GraduationCap size={27} />
            </div>

            <span className="cta-label">
              GET STARTED WITH EDUNIGERIA
            </span>

            <h2>
              Ready to build a better
              school experience?
            </h2>

            <p>
              Join EduNigeria and bring your school's
              everyday operations into one simple platform.
            </p>

            <div className="cta-actions">

              <Link
                to="/register"
                className="cta-primary"
              >
                Create an Account
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="cta-secondary"
              >
                Sign In
              </Link>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="home-footer">

        <div className="home-container footer-content">

          <Link to="/" className="footer-brand">

            <div className="footer-brand-icon">
              <GraduationCap size={21} />
            </div>

            <div>
              <strong>EduNigeria</strong>
              <span>Education Management</span>
            </div>

          </Link>

          <p>
            © {new Date().getFullYear()} EduNigeria.
            Making school management simpler.
          </p>

          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/careers/teaching">Careers</Link>
            <Link to="/login">Login</Link>
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;