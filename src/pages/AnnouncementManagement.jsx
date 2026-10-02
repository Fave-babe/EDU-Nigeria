import React, { useEffect, useState } from "react";
import "./Pages.css";

import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  Send,
  EyeOff,
  X,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/authcontext";
import http from "../api/http";

export default function AnnouncementManagement() {
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "general",
    audience: "all",
    priority: "normal",
    expiresAt: "",
  });

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

      const response = await http.get(`/announcements/school/${schoolId}`, {
        params: {
          includeExpired: true,
        },
      });

      setAnnouncements(response.announcements || []);
    } catch (err) {
      console.error("ANNOUNCEMENTS ERROR:", err);

      setError(err.message || "Unable to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAnnouncements();
    }
  }, [user]);

  const resetForm = () => {
    setForm({
      title: "",
      message: "",
      type: "general",
      audience: "all",
      priority: "normal",
      expiresAt: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const schoolId = getSchoolId();

      if (!schoolId) {
        setError("School information is not available.");
        return;
      }

      const payload = {
        school: schoolId,
        title: form.title,
        message: form.message,
        type: form.type,
        audience: form.audience,
        priority: form.priority,
        expiresAt: form.expiresAt || null,
      };

      if (editingId) {
        await http.patch(`/announcements/${editingId}`, payload);

        setSuccess("Announcement updated successfully.");
      } else {
        await http.post("/announcements", payload);

        setSuccess("Announcement created successfully.");
      }

      resetForm();
      await loadAnnouncements();
    } catch (err) {
      console.error("SAVE ANNOUNCEMENT ERROR:", err);

      setError(err.message || "Unable to save announcement.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);

    setForm({
      title: announcement.title || "",
      message: announcement.message || "",
      type: announcement.type || "general",
      audience: announcement.audience || "all",
      priority: announcement.priority || "normal",
      expiresAt: announcement.expiresAt
        ? announcement.expiresAt.slice(0, 10)
        : "",
    });

    setShowForm(true);
  };

  const handlePublish = async (id) => {
    try {
      setError("");
      setSuccess("");

      await http.patch(`/announcements/${id}/publish`);

      setSuccess("Announcement published successfully.");

      await loadAnnouncements();
    } catch (err) {
      console.error("PUBLISH ERROR:", err);

      setError(err.message || "Unable to publish announcement.");
    }
  };

  const handleUnpublish = async (id) => {
    try {
      setError("");
      setSuccess("");

      await http.patch(`/announcements/${id}/unpublish`);

      setSuccess("Announcement unpublished successfully.");

      await loadAnnouncements();
    } catch (err) {
      console.error("UNPUBLISH ERROR:", err);

      setError(err.message || "Unable to unpublish announcement.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await http.delete(`/announcements/${id}`);

      setSuccess("Announcement deleted successfully.");

      await loadAnnouncements();
    } catch (err) {
      console.error("DELETE ANNOUNCEMENT ERROR:", err);

      setError(err.message || "Unable to delete announcement.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Announcement Management</h1>
          <p>Create and manage school announcements.</p>
        </div>

        <div className="page-header-icon">
          <Megaphone size={28} />
        </div>
      </div>

      {error && (
        <div className="content-card">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="content-card">
          <p>{success}</p>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "12px",
        }}
      >
        <button
          className="back-button"
          onClick={loadAnnouncements}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

        <button
          className="back-button"
          onClick={() => {
            setEditingId(null);

            setForm({
              title: "",
              message: "",
              type: "general",
              audience: "all",
              priority: "normal",
              expiresAt: "",
            });

            setShowForm(true);
          }}
        >
          <Plus size={18} />
          New Announcement
        </button>
      </div>

      {showForm && (
        <div className="content-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2>{editingId ? "Edit Announcement" : "Create Announcement"}</h2>

            <button className="back-button" onClick={resetForm}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label>Title</label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Message</label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your announcement..."
                rows={5}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  resize: "vertical",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label>Type</label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                >
                  <option value="general">General</option>

                  <option value="academic">Academic</option>

                  <option value="event">Event</option>

                  <option value="meeting">Meeting</option>

                  <option value="finance">Finance</option>

                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label>Audience</label>

                <select
                  name="audience"
                  value={form.audience}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                >
                  <option value="all">Everyone</option>

                  <option value="students">Students</option>

                  <option value="parents">Parents</option>

                  <option value="teachers">Teachers</option>

                  <option value="staff">Staff</option>

                  <option value="bursars">Bursars</option>

                  <option value="counsellors">Counsellors</option>
                </select>
              </div>

              <div>
                <label>Priority</label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                >
                  <option value="low">Low</option>

                  <option value="normal">Normal</option>

                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Expiry Date</label>

              <input
                type="date"
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleChange}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                }}
              />
            </div>

            <button type="submit" className="back-button" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Announcement"
                  : "Save Announcement"}
            </button>
          </form>
        </div>
      )}

      <div className="content-card">
        <h2>Announcements</h2>

        {loading ? (
          <div className="empty-state">
            <RefreshCw size={40} />
            <h3>Loading...</h3>
          </div>
        ) : announcements.length === 0 ? (
          <div className="empty-state">
            <Megaphone size={48} />
            <h3>No announcements yet</h3>
            <p>Create your first school announcement.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            {announcements.map((announcement) => {
              const published = announcement.published === true;

              return (
                <div
                  key={announcement._id}
                  className="content-card"
                  style={{
                    margin: 0,
                    border: "1px solid #ddd",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <h3>{announcement.title}</h3>

                      <p>{announcement.message}</p>

                      <small>Audience: {announcement.audience}</small>

                      <br />

                      <small>Priority: {announcement.priority}</small>
                    </div>

                    <strong>{published ? "Published" : "Draft"}</strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "16px",
                    }}
                  >
                    <button
                      className="back-button"
                      onClick={() => handleEdit(announcement)}
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    {!published ? (
                      <button
                        className="back-button"
                        onClick={() => handlePublish(announcement._id)}
                      >
                        <Send size={16} />
                        Publish
                      </button>
                    ) : (
                      <button
                        className="back-button"
                        onClick={() => handleUnpublish(announcement._id)}
                      >
                        <EyeOff size={16} />
                        Unpublish
                      </button>
                    )}

                    <button
                      className="back-button"
                      onClick={() => handleDelete(announcement._id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
