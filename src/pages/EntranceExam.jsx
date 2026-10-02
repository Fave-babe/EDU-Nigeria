
import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";

import { submitEntranceExam } from "../api/admissionApplication.api";

const QUESTION_BANKS = {
  nursery: [
    {
      id: "nursery-q1",
      prompt: "Which shape has three sides?",
      options: ["Circle", "Triangle", "Square", "Rectangle"],
      answer: "Triangle",
    },
    {
      id: "nursery-q2",
      prompt: "What comes after 4?",
      options: ["3", "5", "6", "2"],
      answer: "5",
    },
    {
      id: "nursery-q3",
      prompt: "What color is the sky on a clear day?",
      options: ["Red", "Blue", "Green", "Black"],
      answer: "Blue",
    },
    {
      id: "nursery-q4",
      prompt: "Which animal says 'moo'?",
      options: ["Dog", "Cat", "Cow", "Duck"],
      answer: "Cow",
    },
    {
      id: "nursery-q5",
      prompt: "How many fingers do you have on one hand?",
      options: ["4", "5", "6", "10"],
      answer: "5",
    },
  ],

  primary: [
    {
      id: "primary-q1",
      prompt: "What is 12 + 27?",
      options: ["29", "39", "49", "41"],
      answer: "39",
    },
    {
      id: "primary-q2",
      prompt: "Choose the correctly spelled word.",
      options: ["Recieve", "Receive", "Receeve", "Receve"],
      answer: "Receive",
    },
    {
      id: "primary-q3",
      prompt: "Which of these is a prime number?",
      options: ["21", "27", "31", "33"],
      answer: "31",
    },
    {
      id: "primary-q4",
      prompt: "What is the capital of Nigeria?",
      options: ["Lagos", "Kano", "Abuja", "Ibadan"],
      answer: "Abuja",
    },
    {
      id: "primary-q5",
      prompt: "Fill in the blank: She ___ to school every day.",
      options: ["go", "goes", "going", "gone"],
      answer: "goes",
    },
  ],

  jss: [
    {
      id: "jss-q1",
      prompt: "What is the value of 7 × 8?",
      options: ["48", "54", "56", "58"],
      answer: "56",
    },
    {
      id: "jss-q2",
      prompt: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Mercury", "Jupiter"],
      answer: "Mars",
    },
    {
      id: "jss-q3",
      prompt: "What is the square root of 81?",
      options: ["7", "8", "9", "10"],
      answer: "9",
    },
    {
      id: "jss-q4",
      prompt: "In which continent is Nigeria located?",
      options: ["Asia", "Europe", "Africa", "Australia"],
      answer: "Africa",
    },
    {
      id: "jss-q5",
      prompt: "Which part of the plant absorbs water from the soil?",
      options: ["Leaves", "Stem", "Roots", "Flowers"],
      answer: "Roots",
    },
  ],

  ss: [
    {
      id: "ss-q1",
      prompt: "Solve: 2x + 5 = 17",
      options: ["4", "5", "6", "7"],
      answer: "6",
    },
    {
      id: "ss-q2",
      prompt: "What is the chemical symbol for sodium?",
      options: ["S", "So", "Na", "N"],
      answer: "Na",
    },
    {
      id: "ss-q3",
      prompt:
        "Which law states that energy cannot be created or destroyed?",
      options: [
        "Newton's Law",
        "Law of Conservation of Energy",
        "Ohm's Law",
        "Boyle's Law",
      ],
      answer: "Law of Conservation of Energy",
    },
    {
      id: "ss-q4",
      prompt: "What is the capital of Ghana?",
      options: ["Accra", "Kumasi", "Tamale", "Cape Coast"],
      answer: "Accra",
    },
    {
      id: "ss-q5",
      prompt:
        "Which literary device is used in 'The wind whispered through the trees'?",
      options: [
        "Simile",
        "Personification",
        "Hyperbole",
        "Metaphor",
      ],
      answer: "Personification",
    },
  ],
};

function getQuestionsForClass(studentClass) {
  if (!studentClass) return QUESTION_BANKS.primary;

  const normalized = studentClass.toLowerCase();

  if (normalized.includes("nursery")) {
    return QUESTION_BANKS.nursery;
  }

  if (normalized.includes("primary")) {
    return QUESTION_BANKS.primary;
  }

  if (normalized.includes("jss")) {
    return QUESTION_BANKS.jss;
  }

  if (normalized.includes("ss")) {
    return QUESTION_BANKS.ss;
  }

  return QUESTION_BANKS.primary;
}

const PASS_THRESHOLD = 0.6;

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function Seal() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="26"
        cy="26"
        r="24"
        stroke="var(--gold)"
        strokeWidth="1.5"
      />

      <circle
        cx="26"
        cy="26"
        r="19"
        stroke="var(--gold)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />

      <path
        d="M26 15L28.5 21.5H35.5L29.8 25.6L32 32.5L26 28.2L20 32.5L22.2 25.6L16.5 21.5H23.5L26 15Z"
        fill="var(--gold)"
      />
    </svg>
  );
}

export default function EntranceExam({ onContinue }) {
  const navigate = useNavigate();
  const location = useLocation();

  const applicationId = location.state?.applicationId || "";
  const studentClass = location.state?.studentClass || "";

  const [phase, setPhase] = useState("exam");
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [examSaved, setExamSaved] = useState(false);

  const QUESTIONS = useMemo(
    () => getQuestionsForClass(studentClass),
    [studentClass]
  );

  const answeredCount = Object.keys(answers).length;
  const total = QUESTIONS.length;

  const percentage = useMemo(() => {
    if (!total) return 0;

    return Math.round((score / total) * 100);
  }, [score, total]);

  const passed = useMemo(() => {
    if (!total) return false;

    return score / total >= PASS_THRESHOLD;
  }, [score, total]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!applicationId) {
      setError(
        "Your admission application could not be found. Please return to registration and start again."
      );
      return;
    }

    if (answeredCount < total) {
      setError("Answer every question before submitting.");
      return;
    }

    const correctCount = QUESTIONS.filter(
      (question) => answers[question.id] === question.answer
    ).length;

    const examPercentage = (correctCount / total) * 100;

    const passedExam =
      correctCount / total >= PASS_THRESHOLD;

    const examAnswers = QUESTIONS.map((question) => ({
      questionId: question.id,
      answer: answers[question.id],
    }));

    setScore(correctCount);
    setError("");

    try {
      setSubmitting(true);

      const examData = {
        examScore: correctCount,
        examTotal: total,
        examPercentage,
        examPassed: passedExam,
        examAnswers,
      };

      console.log(
        "ENTRANCE EXAM RESULT BEING SENT:",
        examData
      );

      const result = await submitEntranceExam(
        applicationId,
        examData
      );

      console.log(
        "ENTRANCE EXAM RESULT:",
        result
      );

      setExamSaved(true);
      setPhase("results");
    } catch (error) {
      console.error(
        "ENTRANCE EXAM SUBMISSION ERROR:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error?.response
      );

      console.error(
        "ERROR RESPONSE DATA:",
        error?.response?.data
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to submit your examination result. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setScore(0);
    setError("");
    setExamSaved(false);
    setPhase("exam");
  };

  const handleContinue = () => {
    if (typeof onContinue === "function") {
      onContinue();
      return;
    }

    navigate("/");
  };

  return (
    <div className="exam-root">
      <style>{`
        .exam-root {
          --ink: #1557b0;
          --ink-deep: #1557b0;
          --paper: #F7F4EC;
          --paper-line: #E2DCC9;
          --gold: #1557b0;
          --gold-soft: #1557b0;
          --graphite: #1557b0;
          --maroon: #1557b0;
          --forest: #1557b0;

          min-height: 100vh;
          width: 100%;
          background: var(--ink-deep);

          background-image:
            radial-gradient(
              circle at 20% 15%,
              rgba(184,134,43,0.10),
              transparent 40%
            ),
            radial-gradient(
              circle at 85% 80%,
              rgba(184,134,43,0.08),
              transparent 45%
            );

          display: flex;
          justify-content: center;
          padding: 48px 16px;

          font-family: 'IBM Plex Sans', sans-serif;
          color: var(--graphite);
          box-sizing: border-box;
        }

        .exam-root *,
        .exam-root *::before,
        .exam-root *::after {
          box-sizing: border-box;
        }

        .mono {
          font-family: 'IBM Plex Mono', monospace;
          letter-spacing: 0.06em;
        }

        .exam-sheet {
          width: 100%;
          max-width: 640px;

          background: var(--paper);
          border: 1px solid var(--paper-line);
          border-radius: 3px;

          box-shadow:
            0 30px 60px -20px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.02);

          padding: 40px 40px 44px;
        }

        @media (max-width: 560px) {
          .exam-sheet {
            padding: 28px 20px 32px;
          }
        }

        .sheet-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .header-text {
          flex: 1;
          min-width: 0;
        }

        .eyebrow-mono {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 500;
        }

        .exam-title {
          font-family: 'Source Serif 4', serif;
          font-weight: 700;
          font-size: 30px;
          line-height: 1.15;
          margin: 6px 0 10px;
          color: var(--ink);
        }

        .exam-instructions {
          font-size: 14px;
          line-height: 1.55;
          color: #1557b0;
          margin: 0;
          max-width: 46ch;
        }

        .answered-count {
          font-size: 11px;
          color: #8a8570;
          white-space: nowrap;
          text-align: right;
          padding-top: 4px;
        }

        @media (max-width: 560px) {
          .sheet-header {
            flex-wrap: wrap;
          }

          .answered-count {
            order: 3;
            text-align: left;
            padding-top: 8px;
          }
        }

        .gold-rule {
          border: none;
          border-top: 1px solid var(--gold-soft);
          margin: 22px 0 18px;
        }

        .progress-trail {
          display: flex;
          gap: 8px;
          margin-bottom: 30px;
        }

        .progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1.5px solid var(--gold-soft);
          background: transparent;

          transition:
            background-color 150ms ease,
            border-color 150ms ease;
        }

        .progress-dot.filled {
          background: var(--gold);
          border-color: var(--gold);
        }

        .question-block + .question-block {
          margin-top: 26px;
          padding-top: 26px;
          border-top: 1px dashed var(--paper-line);
        }

        .q-label-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 12px;
        }

        .q-number {
          font-size: 12px;
          color: var(--gold);
          font-weight: 600;
          flex-shrink: 0;
        }

        .q-prompt {
          font-size: 16px;
          line-height: 1.4;
          color: var(--ink);
          margin: 0;
          font-weight: 500;
        }

        .options-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .bubble-option {
          display: flex;
          align-items: center;
          gap: 9px;

          background: transparent;
          border: 1px solid var(--paper-line);
          border-radius: 999px;

          padding: 7px 14px 7px 7px;

          cursor: pointer;

          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          color: var(--graphite);

          transition:
            border-color 150ms ease,
            background-color 150ms ease;
        }

        .bubble-option:hover {
          border-color: var(--gold-soft);
        }

        .bubble-option:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 2px;
        }

        .bubble-letter {
          width: 22px;
          height: 22px;
          border-radius: 50%;

          border: 1.5px solid var(--ink);

          display: flex;
          align-items: center;
          justify-content: center;

          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 500;

          color: var(--ink);
          flex-shrink: 0;

          transition:
            background-color 150ms ease,
            color 150ms ease,
            transform 150ms ease;
        }

        .bubble-option.selected {
          border-color: var(--ink);
          background: rgba(27,42,74,0.04);
        }

        .bubble-option.selected .bubble-letter {
          background: var(--ink);
          color: var(--paper);
        }

        @media (prefers-reduced-motion: no-preference) {
          .bubble-option.selected .bubble-letter {
            transform: scale(1.06);
          }
        }

        .form-error {
          margin: 24px 0 0;
          font-size: 13px;
          color: var(--maroon);
          font-weight: 500;

          border-left: 2px solid var(--maroon);
          padding-left: 10px;
        }

        .btn-submit {
          margin-top: 30px;

          display: inline-flex;
          align-items: center;
          gap: 8px;

          background: var(--ink);
          color: var(--paper);

          border: none;
          border-radius: 2px;

          padding: 13px 22px;

          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;

          cursor: pointer;

          transition:
            background-color 150ms ease,
            transform 150ms ease;
        }

        .btn-submit:hover {
          background: var(--ink-deep);
        }

        .btn-submit:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 2px;
        }

        .btn-submit:active {
          transform: translateY(1px);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .results-sheet {
          text-align: center;
        }

        .stamp-wrap {
          display: flex;
          justify-content: center;
          margin: 8px 0 22px;
        }

        .stamp {
          width: 108px;
          height: 108px;
          border-radius: 50%;

          border: 3px solid var(--forest);
          color: var(--forest);

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          transform: rotate(-8deg);

          font-family: 'IBM Plex Mono', monospace;
        }

        .stamp .stamp-word {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .stamp .stamp-sub {
          font-size: 9px;
          margin-top: 3px;
          letter-spacing: 0.08em;
        }

        @media (prefers-reduced-motion: no-preference) {
          .stamp {
            animation:
              stamp-in
              320ms
              cubic-bezier(0.2, 0.9, 0.3, 1.2);
          }
        }

        @keyframes stamp-in {
          from {
            opacity: 0;
            transform: rotate(-8deg) scale(1.4);
          }

          to {
            opacity: 1;
            transform: rotate(-8deg) scale(1);
          }
        }

        .register-mark {
          width: 108px;
          height: 108px;
          border-radius: 50%;

          border: 3px solid var(--maroon);
          color: var(--maroon);
        }

        .results-title {
          font-family: 'Source Serif 4', serif;
          font-weight: 700;
          font-size: 26px;
          color: var(--ink);
          margin: 0 0 10px;
        }

        .results-score {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: #5b5849;
          margin: 0 0 6px;
        }

        .results-body {
          font-size: 14px;
          line-height: 1.6;
          color: #5b5849;
          max-width: 40ch;
          margin: 0 auto 26px;
        }

        .btn-row {
          display: flex;
          justify-content: center;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          background: transparent;
          border: 1px solid var(--ink);
          color: var(--ink);

          border-radius: 2px;
          padding: 12px 20px;

          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;

          cursor: pointer;

          transition:
            background-color 150ms ease;
        }

        .btn-secondary:hover {
          background: rgba(27,42,74,0.06);
        }

        .btn-secondary:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 2px;
        }
      `}</style>

      {/* =====================================================
          EXAM
      ===================================================== */}

      {phase === "exam" && (
        <div className="exam-sheet">
          <div className="sheet-header">
            <Seal />

            <div className="header-text">
              <span className="eyebrow-mono mono">
                Exam Code · ENT-2026
              </span>

              <h1 className="exam-title">
                Entrance Examination
              </h1>

              <p className="exam-instructions">
                This exam is tailored for{" "}
                {studentClass || "your selected class"}. Answer
                all {total} questions below. Your examination
                result will be sent to the school administrator
                for review.
              </p>
            </div>

            <span className="answered-count mono">
              {answeredCount}/{total} answered
            </span>
          </div>

          <hr className="gold-rule" />

          <div
            className="progress-trail"
            aria-hidden="true"
          >
            {QUESTIONS.map((q) => (
              <span
                key={q.id}
                className={`progress-dot${
                  answers[q.id] ? " filled" : ""
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset
              style={{
                border: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <legend
                className="sr-only"
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                Questions
              </legend>

              {QUESTIONS.map((q, index) => (
                <div
                  className="question-block"
                  key={q.id}
                >
                  <div className="q-label-row">
                    <span className="q-number mono">
                      Q{index + 1}
                    </span>

                    <p className="q-prompt">
                      {q.prompt}
                    </p>
                  </div>

                  <div
                    className="options-row"
                    role="radiogroup"
                    aria-label={q.prompt}
                  >
                    {q.options.map((option, i) => (
                      <button
                        type="button"
                        key={option}
                        role="radio"
                        aria-checked={
                          answers[q.id] === option
                        }
                        className={`bubble-option${
                          answers[q.id] === option
                            ? " selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleSelect(
                            q.id,
                            option
                          )
                        }
                      >
                        <span className="bubble-letter">
                          {LETTERS[i]}
                        </span>

                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </fieldset>

            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting
                ? "Submitting Exam..."
                : "Submit Exam"}

              {!submitting && (
                <ArrowRight size={16} />
              )}
            </button>
          </form>
        </div>
      )}

      {/* =====================================================
          RESULTS
      ===================================================== */}

      {phase === "results" && (
        <div className="exam-sheet results-sheet">
          <div className="stamp-wrap">
            <div className="stamp">
              <span className="stamp-word">
                SUBMITTED
              </span>

              <span className="stamp-sub">
                ENT-2026
              </span>
            </div>
          </div>

          <h2 className="results-title">
            Examination Submitted
          </h2>

          <p className="results-score mono">
            {score} / {total} correct ({percentage}%)
          </p>

          <p className="results-body">
            {examSaved
              ? "Your entrance examination result has been successfully sent to the school administrator. The administrator will review your application and examination score before deciding whether to approve or reject your admission."
              : "Your examination was completed."}
          </p>

          <div
            className="btn-row"
            style={{
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn-submit"
              onClick={handleContinue}
            >
              Finish
              <ArrowRight size={16} />
            </button>

            <button
              className="btn-secondary"
              onClick={handleRetake}
            >
              <RotateCcw size={16} />
              Retake Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
