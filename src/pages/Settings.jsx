import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  ArrowLeft,
  User,
  Mail,
  Shield,
  Bell,
  LogOut,
} from "lucide-react";

import "./Pages.css";

export default function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("Edu-Nigeria_notifications") !== "false"
  );

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("Edu-Nigeria_user") || "{}"
    );

    setUser(storedUser);
  }, []);

  const handleNotificationChange = (event) => {
    const enabled = event.target.checked;

    setNotificationsEnabled(enabled);

    localStorage.setItem(
      "Edu-Nigeria_notifications",
      String(enabled)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("Edu-Nigeria_token");
    localStorage.removeItem("Edu-Nigeria_user");

    navigate("/login");
  };

  const fullName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user?.name || "Student";

  const email = user?.email || "Not available";

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

      <div
        style={{
          display: "grid",
          gap: "20px",
          maxWidth: "900px",
        }}
      >
        {/* Profile */}
        <div className="content-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <User size={22} color="#079b68" />

            <div>
              <h2 style={{ margin: 0 }}>Profile</h2>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748b",
                }}
              >
                Your account information.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "14px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Full Name
              </label>

              <div
                style={{
                  padding: "12px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  color: "#334155",
                  background: "#f8fafc",
                }}
              >
                {fullName}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Email
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  color: "#334155",
                  background: "#f8fafc",
                }}
              >
                <Mail size={16} />
                {email}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Role
              </label>

              <div
                style={{
                  padding: "12px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  color: "#334155",
                  background: "#f8fafc",
                  textTransform: "capitalize",
                }}
              >
                {user?.role || "Student"}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="content-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Bell size={22} color="#079b68" />

              <div>
                <h2 style={{ margin: 0 }}>
                  Notifications
                </h2>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#64748b",
                  }}
                >
                  Allow school notifications to appear in your
                  account.
                </p>
              </div>
            </div>

            <label
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={handleNotificationChange}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="content-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <Shield size={22} color="#079b68" />

            <div>
              <h2 style={{ margin: 0 }}>Security</h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748b",
                }}
              >
                Keep your account secure.
              </p>
            </div>
          </div>

          <button
            className="back-button"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>
        </div>

        {/* Logout */}
        <div className="content-card">
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              background: "#fef2f2",
              color: "#dc2626",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}