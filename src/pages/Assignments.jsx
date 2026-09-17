import React from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { ClipboardList,ArrowLeft  } from "lucide-react";

export default function Assignments() {
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
          <h1>Assignments</h1>
          <p>View your assignments and classwork.</p>
        </div>

        <div className="page-header-icon">
          <ClipboardList size={28} />
        </div>
      </div>

      <div className="content-card">
        <div className="empty-state">
          <ClipboardList size={48} />

          <h2>No Assignments</h2>

          <p>
            Your assignments will appear here when they are
            published by your teachers.
          </p>
        </div>
      </div>
    </div>
  );
}