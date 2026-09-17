import React from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { BarChart3, ArrowLeft  } from "lucide-react";

export default function Reports() {
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
          <h1>Reports</h1>
          <p>View school and academic reports.</p>
        </div>

        <div className="page-header-icon">
          <BarChart3 size={28} />
        </div>
      </div>

      <div className="content-card">
        <div className="empty-state">
          <BarChart3 size={48} />

          <h2>Reports</h2>

          <p>
            Reports will appear here when they are available.
          </p>
        </div>
      </div>
    </div>
  );
}