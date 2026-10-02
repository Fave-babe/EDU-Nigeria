import React, { useEffect, useState } from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import {
  Megaphone,
  ArrowLeft,
  RefreshCw,
  CalendarDays,
  User,
  Loader2,
} from "lucide-react";
import http from "../api/http";
import { useAuth } from "../context/authcontext";

export default function Announcements() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getSchoolId = () => {
    if (!user?.school) return null;

    if (typeof user.school === "string") {
      return user.school;
    }

    return user.school._id || user.school.id || null;
  };

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const schoolId = getSchoolId();

      if (!schoolId) {
        setError("School information is not available.");
        return;
      }

      const response = await http.get(
        `/announcements/school/${schoolId}/audience/students`,
      );

      console.log("STUDENT ANNOUNCEMENTS RESPONSE:", response);

      setAnnouncements(response.announcements || []);
    } catch (err) {
      console.error("ANNOUNCEMENTS ERROR:", err);

      setError(err.message || "Unable to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, [user]);

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate(-1)}>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2>School Announcements</h2>
            <p>Latest announcements published by your school.</p>
          </div>

          <button
            className="back-button"
            onClick={loadAnnouncements}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <Loader2 size={40} />
            <h2>Loading announcements...</h2>
            <p>Please wait.</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <Megaphone size={48} />
            <h2>Unable to load announcements</h2>
            <p>{error}</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="empty-state">
            <Megaphone size={48} />
            <h2>No Announcements</h2>
            <p>
              School announcements will appear here when they are published.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="content-card"
                style={{
                  margin: 0,
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h2>{announcement.title}</h2>

                    {announcement.type && (
                      <p>
                        <strong>Type:</strong> {announcement.type}
                      </p>
                    )}
                  </div>

                  {announcement.published && <span>Published</span>}
                </div>

                <p
                  style={{
                    marginTop: "12px",
                    lineHeight: "1.6",
                  }}
                >
                  {announcement.content ||
                    announcement.message ||
                    announcement.description ||
                    "No announcement content available."}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginTop: "16px",
                  }}
                >
                  {announcement.createdBy && (
                    <span>
                      <User size={15} />{" "}
                      {announcement.createdBy.firstName ||
                        announcement.createdBy.name ||
                        "School Admin"}
                    </span>
                  )}

                  {announcement.createdAt && (
                    <span>
                      <CalendarDays size={15} />{" "}
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
