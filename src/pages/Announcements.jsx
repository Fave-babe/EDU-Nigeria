import React from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { Megaphone, ArrowLeft  } from "lucide-react";

export default function Announcements() {
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
          <h1>Announcements</h1>
          <p>View important announcements from your school.</p>
        </div>

        <div className="page-header-icon">
          <Megaphone size={28} />
        </div>
      </div>

      <div className="content-card">
        <div className="empty-state">
          <Megaphone size={48} />

          <h2>No Announcements</h2>

          <p>
            School announcements will appear here when they are
            published.
          </p>
        </div>
      </div>
    </div>
  );
}