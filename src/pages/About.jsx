import React from "react";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Heart,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";
import "./about.css";

function About() {
  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>

        <div className="about-hero-content">
          <span className="about-eyebrow">ABOUT EDU NIGERIA</span>

          <h1>
            Building a stronger
            <span> future through education.</span>
          </h1>

          <p>
            EDU Nigeria is committed to providing an environment where
            academic excellence, character, curiosity, and leadership grow
            together.
          </p>

          <div className="about-hero-actions">
            <a href="#our-story" className="about-primary-btn">
              Discover Our Story
              <ArrowRight size={18} />
            </a>

            <a href="/register" className="about-secondary-btn">
              Join EDU Nigeria
            </a>
          </div>
        </div>

        <div className="about-hero-card">
          <GraduationCap size={30} />
          <div>
            <strong>Education Beyond the Classroom</strong>
            <span>Knowledge • Character • Leadership</span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="about-intro" id="our-story">
        <div className="about-section-container">
          <div className="about-intro-label">
            <span>01</span>
            <div></div>
            <p>WHO WE ARE</p>
          </div>

          <div className="about-intro-grid">
            <div>
              <h2>
                More than a school.
                <span> A community.</span>
              </h2>
            </div>

            <div className="about-intro-text">
              <p>
                Founded in 2009, EDU Nigeria has grown into a leading center
                for academic excellence and character development, shaping
                generations of Nigerian leaders.
              </p>

              <p>
                We believe that education should prepare students not only
                for examinations, but also for life. Every learner deserves
                to be known, challenged, supported, and given the opportunity
                to discover what they are capable of achieving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <div className="about-section-container">
          <div className="about-section-heading">
            <span className="about-eyebrow dark">OUR APPROACH</span>

            <h2>
              What makes the
              <span> EDU Nigeria experience different?</span>
            </h2>

            <p>
              We bring academics, personal development, technology, and
              community together to create a complete learning experience.
            </p>
          </div>

          <div className="about-value-grid">
            <div className="about-value-card">
              <div className="about-value-icon">
                <BookOpen size={24} />
              </div>

              <h3>Academic Excellence</h3>

              <p>
                We encourage students to develop strong academic foundations,
                independent thinking, and a genuine love for learning.
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon">
                <Heart size={24} />
              </div>

              <h3>Strong Character</h3>

              <p>
                Respect, responsibility, integrity, and discipline are woven
                into everyday school life.
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon">
                <Users size={24} />
              </div>

              <h3>A Supportive Community</h3>

              <p>
                Students are encouraged to support one another while teachers
                provide guidance throughout their learning journey.
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon">
                <Lightbulb size={24} />
              </div>

              <h3>Curiosity & Innovation</h3>

              <p>
                Learning goes beyond the syllabus. We encourage students to
                ask questions, explore ideas, and understand the world around
                them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE'VE GROWN */}
      <section className="about-story">
        <div className="about-section-container">
          <div className="about-story-grid">
            <div className="about-story-visual">
              <div className="about-year-card">
                <span>2009</span>
                <small>Our Journey Begins</small>
              </div>

              <div className="about-visual-box">
                <GraduationCap size={70} />
                <strong>Growing With Purpose</strong>
                <span>
                  Expanding our learning environment while staying focused on
                  every student.
                </span>
              </div>
            </div>

            <div className="about-story-content">
              <span className="about-eyebrow dark">02 — OUR JOURNEY</span>

              <h2>How We've Grown</h2>

              <p>
                Over the years, our campus has expanded alongside our
                ambitions — new classrooms, science and technology
                laboratories, a library stocked for independent thinkers,
                and sporting facilities that reflect our belief in the whole
                student, not just the exam-taking one.
              </p>

              <p>
                But our size has never been the point. What matters is that
                every student who walks through our gates is known by name,
                challenged to do their best work, and supported when the work
                gets hard.
              </p>

              <p>
                Today, EDU Nigeria's alumni can be found across the country
                and around the world — in medicine, law, engineering,
                business, government, and the arts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE STAND FOR */}
      <section className="about-beliefs">
        <div className="about-section-container">
          <div className="about-beliefs-grid">
            <div className="about-beliefs-content">
              <span className="about-eyebrow">03 — OUR BELIEFS</span>

              <h2>
                Knowledge and
                <span> character go together.</span>
              </h2>

              <p>
                We believe rigorous academics and strong character are not
                separate goals but the same goal, pursued together.
              </p>

              <p>
                Our teachers hold students to high standards because we
                believe every child is capable of more than they think. Our
                approach to discipline is rooted in respect, not fear.
              </p>

              <div className="about-belief-list">
                <div>
                  <Target size={20} />
                  <span>High academic standards</span>
                </div>

                <div>
                  <Heart size={20} />
                  <span>Respect and responsibility</span>
                </div>

                <div>
                  <Lightbulb size={20} />
                  <span>Curiosity beyond the syllabus</span>
                </div>
              </div>
            </div>

            <div className="about-beliefs-card">
              <div className="belief-card-number">01</div>

              <h3>Our Promise</h3>

              <p>
                To help students become confident, capable, curious, and
                principled young people who are ready to make a meaningful
                difference.
              </p>

              <div className="belief-card-line"></div>

              <span>EDU NIGERIA</span>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKING AHEAD */}
      <section className="about-future">
        <div className="about-section-container">
          <div className="about-future-content">
            <span className="about-eyebrow">04 — LOOKING AHEAD</span>

            <h2>
              Preparing students for
              <span> the world ahead.</span>
            </h2>

            <p>
              As Nigeria continues to change, so do we. We invest in new
              teaching methods, technology, and partnerships that keep our
              students ready for a world that looks different from the one
              our founders knew.
            </p>

            <p>
              But our mission hasn't moved: to nurture capable, principled
              young people who will go on to lead — in their communities,
              their professions, and their country.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-content">
          <div>
            <span className="about-eyebrow">START YOUR JOURNEY</span>

            <h2>Ready to become part of EDU Nigeria?</h2>

            <p>
              Discover a learning environment built around knowledge,
              character, and opportunity.
            </p>
          </div>

          <a href="/register" className="about-cta-btn">
            Get Started
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}

export default About;