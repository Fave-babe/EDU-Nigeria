import React from "react";
import { FileText, GraduationCap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Pages.css";

export default function Results() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="page-header">
        <div>
          <h1>Results</h1>
          <p>View your academic results and performance.</p>
        </div>

        <div className="page-header-icon">
          <GraduationCap size={28} />
        </div>
      </div>

      <div className="content-card">
        <div className="empty-state">
          <FileText size={48} />

          <h2>Academic Results</h2>

          <p>
            Your academic results will appear here when they are
            available.
          </p>
        </div>
      </div>
    </div>
  );
}