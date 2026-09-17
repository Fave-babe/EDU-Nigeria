import React from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, ArrowLeft  } from "lucide-react";

export default function Settings() {
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
          <h1>Settings</h1>
          <p>Manage your account settings.</p>
        </div>

        <div className="page-header-icon">
          <SettingsIcon size={28} />
        </div>
      </div>

      <div className="content-card">
        <div className="empty-state">
          <SettingsIcon size={48} />

          <h2>Account Settings</h2>

          <p>
            Your account settings will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}