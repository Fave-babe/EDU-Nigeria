import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  ArrowLeft,
  RefreshCw,
  Megaphone,
  CalendarDays,
  BookOpen,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import http from "../api/http";
import "./Pages.css";

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await http.get("/notifications/me");

      console.log("STUDENT NOTIFICATIONS RESPONSE:", response);

      setNotifications(response.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "academic":
        return <BookOpen size={22} />;

      case "attendance":
        return <CalendarDays size={22} />;

      case "finance":
        return <ClipboardList size={22} />;

      case "announcement":
        return <Megaphone size={22} />;

      case "result":
        return <CheckCircle2 size={22} />;

      case "system":
        return <Bell size={22} />;

      default:
        return <AlertCircle size={22} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Your Notifications</h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#64748b",
              }}
            >
              Important updates and notifications from your school.
            </p>
          </div>

          <button
            className="back-button"
            onClick={loadNotifications}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "spin" : ""}
            />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <RefreshCw
              size={40}
              className="spin"
            />

            <h2>Loading Notifications...</h2>

            <p>
              Please wait while we get your latest updates.
            </p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <AlertCircle size={48} />

            <h2>Unable to Load Notifications</h2>

            <p>{error}</p>

            <button
              className="back-button"
              onClick={loadNotifications}
              style={{ marginTop: "15px" }}
            >
              Try Again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />

            <h2>No Notifications</h2>

            <p>
              You don't have any notifications yet.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "14px",
            }}
          >
            {notifications.map((notification) => (
              <div
                key={notification._id}
                style={{
                  display: "flex",
                  gap: "15px",
                  padding: "18px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  background: notification.isRead
                    ? "#fff"
                    : "#f8fafc",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    minWidth: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    background: "#ecfdf5",
                    color: "#079b68",
                  }}
                >
                  {getIcon(notification.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: "#071a41",
                        fontSize: "16px",
                      }}
                    >
                      {notification.title}
                    </h3>

                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#475569",
                      lineHeight: 1.6,
                    }}
                  >
                    {notification.message}
                  </p>

                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "10px",
                      padding: "4px 9px",
                      borderRadius: "999px",
                      background: notification.isRead
                        ? "#f1f5f9"
                        : "#ecfdf5",
                      color: notification.isRead
                        ? "#475569"
                        : "#079b68",
                      fontSize: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    {notification.isRead
                      ? "Read"
                      : "New"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}