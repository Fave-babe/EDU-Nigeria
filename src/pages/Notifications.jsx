import React from "react";
import { useNavigate } from "react-router-dom";
import "./Pages.css";
import { Bell, ArrowLeft  } from "lucide-react";

export default function Notifications() {
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
          <h1>Notifications</h1>
          <p>Stay updated with your school activities.</p>
        </div>

        <div className="page-header-icon">
          <Bell size={28} />
        </div>
      </div>

      <div className="content-card">
        <div className="empty-state">
          <Bell size={48} />

          <h2>No Notifications</h2>

          <p>
            Your notifications will appear here when you receive
            new updates.
          </p>
        </div>
      </div>
    </div>
  );
}