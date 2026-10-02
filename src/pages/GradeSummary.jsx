import React, { useEffect, useMemo, useState } from "react";

import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import http from "../api/http";
import "./GradeSummary.css";

export default function GradeSummary() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStudentId = () => {
    try {
      const storedUser = localStorage.getItem("Edu-Nigeria_user");

      if (!storedUser) {
        return null;
      }

      const user = JSON.parse(storedUser);

      return user?._id || user?.id || null;
    } catch (err) {
      console.error("FAILED TO READ STUDENT USER:", err);
      return null;
    }
  };

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");

      const studentId = getStudentId();

      if (!studentId) {
        throw new Error(
          "Student account information could not be found."
        );
      }

      const response = await http.get(
        `/results/student/${studentId}`
      );

      console.log("STUDENT RESULTS RESPONSE:", response);

      setResults(response.results || []);
    } catch (err) {
      console.error("GRADE SUMMARY ERROR:", err);

      setError(
        err.message || "Failed to load your results."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const average = useMemo(() => {
    if (!results.length) return 0;

    const total = results.reduce(
      (sum, result) =>
        sum + Number(result.totalScore || 0),
      0
    );

    return Math.round(total / results.length);
  }, [results]);

  const overallGrade = useMemo(() => {
    if (average >= 75) return "A";
    if (average >= 65) return "B";
    if (average >= 55) return "C";
    if (average >= 45) return "D";
    if (average >= 40) return "E";
    return "F";
  }, [average]);

  const overallRemark = useMemo(() => {
    if (average >= 75) return "Excellent";
    if (average >= 65) return "Very Good";
    if (average >= 55) return "Good";
    if (average >= 45) return "Fair";
    if (average >= 40) return "Pass";
    return "Fail";
  }, [average]);

  if (loading) {
    return (
      <div className="grade-summary-loading">
        <div className="grade-summary-loading-content">
          <Loader2 size={24} className="animate-spin" />
          Loading your grades...
        </div>
      </div>
    );
  }

  return (
    <div className="grade-summary">
      <div className="grade-summary-container">

        {/* Header */}
        <div className="grade-summary-header">
          <div>
            <h1 className="grade-summary-title">
              Grade Summary
            </h1>

            <p className="grade-summary-subtitle">
              View your academic performance and published results.
            </p>
          </div>

          <button
            onClick={loadResults}
            className="grade-summary-refresh"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="grade-summary-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grade-summary-cards">

          {/* Subjects */}
          <div className="grade-summary-card">
            <div className="grade-summary-card-content">
              <div>
                <p className="grade-summary-card-label">
                  Subjects
                </p>

                <h2 className="grade-summary-card-value">
                  {results.length}
                </h2>
              </div>

              <div className="grade-summary-icon grade-summary-icon-blue">
                <BookOpen size={25} />
              </div>
            </div>
          </div>

          {/* Average */}
          <div className="grade-summary-card">
            <div className="grade-summary-card-content">
              <div>
                <p className="grade-summary-card-label">
                  Average Score
                </p>

                <h2 className="grade-summary-card-value">
                  {average}%
                </h2>
              </div>

              <div className="grade-summary-icon grade-summary-icon-green">
                <TrendingUp size={25} />
              </div>
            </div>
          </div>

          {/* Overall Grade */}
          <div className="grade-summary-card">
            <div className="grade-summary-card-content">
              <div>
                <p className="grade-summary-card-label">
                  Overall Grade
                </p>

                <h2 className="grade-summary-card-value">
                  {overallGrade}
                </h2>

                <p className="grade-summary-card-remark">
                  {overallRemark}
                </p>
              </div>

              <div className="grade-summary-icon grade-summary-icon-yellow">
                <Award size={25} />
              </div>
            </div>
          </div>

        </div>

        {/* Results */}
        <div className="grade-results-card">

          <div className="grade-results-header">
            <div className="grade-results-header-content">

              <GraduationCap
                size={24}
                className="grade-results-header-icon"
              />

              <div>
                <h2 className="grade-results-title">
                  Subject Results
                </h2>

                <p className="grade-results-description">
                  Your published academic results
                </p>
              </div>

            </div>
          </div>

          {results.length === 0 ? (
            <div className="grade-results-empty">

              <GraduationCap
                size={45}
                className="grade-results-empty-icon"
              />

              <h3 className="grade-results-empty-title">
                No published results
              </h3>

              <p className="grade-results-empty-text">
                Your results will appear here when they are
                published by the school.
              </p>

            </div>
          ) : (
            <div className="grade-results-table-wrapper">

              <table className="grade-results-table">

                <thead>
                  <tr>
                    <th>Subject</th>
                    <th className="center">CA</th>
                    <th className="center">Exam</th>
                    <th className="center">Total</th>
                    <th className="center">Grade</th>
                    <th>Remark</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((result, index) => (
                    <tr key={result._id || index}>

                      <td>
                        <div className="grade-subject-name">
                          {result.subject?.name ||
                            "Unknown Subject"}
                        </div>

                        {result.subject?.code && (
                          <div className="grade-subject-code">
                            {result.subject.code}
                          </div>
                        )}
                      </td>

                      <td className="center">
                        {result.caScore}
                      </td>

                      <td className="center">
                        {result.examScore}
                      </td>

                      <td className="center grade-total">
                        {result.totalScore}
                      </td>

                      <td className="center">
                        <span className="grade-badge">
                          {result.grade}
                        </span>
                      </td>

                      <td>
                        {result.remark || "-"}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}