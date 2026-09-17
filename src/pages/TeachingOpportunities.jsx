import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  Heart,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Briefcase,
  MapPin,
  Sparkles,
} from "lucide-react";
import "./teachingOpportunities.css";

const openRoles = [
  {
    title: "Primary School Teacher",
    subject: "General Studies",
    type: "Full-time",
  },
  {
    title: "Mathematics Teacher",
    subject: "Secondary",
    type: "Full-time",
  },
  {
    title: "English Language Teacher",
    subject: "Secondary",
    type: "Full-time",
  },
  {
    title: "Science Lab Instructor",
    subject: "Physics / Chemistry / Biology",
    type: "Full-time",
  },
];

const benefits = [
  {
    icon: GraduationCap,
    title: "Professional Development",
    text: "Ongoing training, workshops, and support to help you grow in your teaching career.",
  },
  {
    icon: Users,
    title: "Collaborative Environment",
    text: "Work alongside educators who value teamwork, knowledge sharing, and student success.",
  },
  {
    icon: Heart,
    title: "Meaningful Impact",
    text: "Play an important role in helping students develop academically and personally.",
  },
];

function TeachingOpportunities() {
  return (
    <div className="teaching-page">
      {/* HERO */}
      <section className="teaching-hero">
        <div className="teaching-hero-bg"></div>

        <div className="teaching-hero-container">
          <div className="teaching-hero-content">
            <span className="teaching-eyebrow">
              CAREERS AT EDU NIGERIA
            </span>

            <h1>
              Teach.
              <span> Inspire.</span>
              <br />
              Make an impact.
            </h1>

            <p>
              Join a community of educators dedicated to helping young
              Nigerians discover their potential and prepare for the future.
            </p>

            <div className="teaching-hero-actions">
              <Link
                to="/careers/apply"
                className="teaching-primary-btn"
              >
                Explore Opportunities
                <ArrowRight size={18} />
              </Link>

              <a
                href="#open-roles"
                className="teaching-outline-btn"
              >
                View Open Roles
              </a>
            </div>
          </div>

          <div className="teaching-hero-card">
            <div className="teaching-hero-card-icon">
              <GraduationCap size={28} />
            </div>

            <div>
              <strong>Shape the Future</strong>
              <span>
                Your classroom can be someone's starting point.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="teaching-intro">
        <div className="teaching-container">
          <div className="teaching-intro-grid">
            <div>
              <span className="section-number">01</span>

              <h2>
                Great schools are
                <span> built by great teachers.</span>
              </h2>
            </div>

            <div className="teaching-intro-text">
              <p>
                At EDU Nigeria, teachers are more than instructors. They are
                mentors, role models, problem-solvers, and an important part
                of every student's journey.
              </p>

              <p>
                We are looking for passionate educators who want to create
                meaningful learning experiences and contribute to a culture
                of excellence, respect, and curiosity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="teaching-benefits">
        <div className="teaching-container">
          <div className="teaching-section-heading">
            <span className="teaching-eyebrow light">
              WHY EDU NIGERIA
            </span>

            <h2>
              A place where
              <span> teachers can grow.</span>
            </h2>

            <p>
              We want our educators to have the support and environment they
              need to do their best work.
            </p>
          </div>

          <div className="teaching-benefits-grid">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div className="teaching-benefit-card" key={title}>
                <div className="teaching-benefit-icon">
                  <Icon size={24} />
                </div>

                <h3>{title}</h3>

                <p>{text}</p>

                <div className="benefit-arrow">
                  <ArrowRight size={17} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section className="teaching-roles" id="open-roles">
        <div className="teaching-container">
          <div className="roles-heading">
            <div>
              <span className="teaching-eyebrow dark">
                CURRENT OPPORTUNITIES
              </span>

              <h2>Open positions</h2>

              <p>
                Find an opportunity that matches your experience and
                passion for education.
              </p>
            </div>

            <div className="roles-count">
              <Briefcase size={18} />
              <span>{openRoles.length} Open Roles</span>
            </div>
          </div>

          <div className="roles-list">
            {openRoles.map((role, index) => (
              <div className="role-card" key={role.title}>
                <div className="role-number">
                  0{index + 1}
                </div>

                <div className="role-main">
                  <h3>{role.title}</h3>

                  <div className="role-details">
                    <span>
                      <BookOpen size={15} />
                      {role.subject}
                    </span>

                    <span>
                      <Briefcase size={15} />
                      {role.type}
                    </span>

                    <span>
                      <MapPin size={15} />
                      Nigeria
                    </span>
                  </div>
                </div>

                <Link
                  to="/careers/apply"
                  className="role-apply-btn"
                >
                  Apply
                  <ArrowRight size={17} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEACHING IMPACT */}
      <section className="teaching-impact">
        <div className="teaching-container">
          <div className="impact-grid">
            <div className="impact-content">
              <span className="teaching-eyebrow dark">
                YOUR IMPACT
              </span>

              <h2>
                Every lesson can
                <span> change a life.</span>
              </h2>

              <p>
                Education is not simply about completing a syllabus. It is
                about helping students develop the confidence, knowledge,
                discipline, and curiosity they need to navigate their future.
              </p>

              <div className="impact-points">
                <div>
                  <CheckCircle size={19} />
                  <span>Encourage students to think independently</span>
                </div>

                <div>
                  <CheckCircle size={19} />
                  <span>Build confidence through meaningful learning</span>
                </div>

                <div>
                  <CheckCircle size={19} />
                  <span>Help students discover their strengths</span>
                </div>

                <div>
                  <CheckCircle size={19} />
                  <span>Become a positive role model</span>
                </div>
              </div>
            </div>

            <div className="impact-visual">
              <div className="impact-circle">
                <Sparkles size={32} />
              </div>

              <div className="impact-quote">
                <span>EDU NIGERIA</span>

                <strong>
                  Teach with purpose.
                  <br />
                  Lead with example.
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="teaching-cta">
        <div className="teaching-cta-container">
          <div className="teaching-cta-icon">
            <CheckCircle size={28} />
          </div>

          <div className="teaching-cta-content">
            <span className="teaching-eyebrow">
              TAKE THE NEXT STEP
            </span>

            <h2>Ready to join our teaching community?</h2>

            <p>
              Send us your CV and cover letter and take the first step toward
              becoming part of EDU Nigeria.
            </p>
          </div>

          <Link
            to="/careers/apply"
            className="teaching-cta-btn"
          >
            Apply to Teach
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default TeachingOpportunities;