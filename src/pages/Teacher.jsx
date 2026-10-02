import React, { useEffect, useState } from "react";
import { Search, Users, Mail, Phone, RefreshCw, Loader2 } from "lucide-react";

import { useAuth } from "../context/authcontext";
import { teacherApi } from "../api/teacher.api";
import "../pages/Teacher.css";

function Teacher() {
  const { user } = useAuth();

  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const schoolId = user?.school?._id || user?.school?.id || user?.school;

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");

      if (!schoolId) {
        setError("School information not found.");
        return;
      }

      const response = await teacherApi.getTeachersBySchool(schoolId);

      console.log("TEACHERS PAGE RESPONSE:", response);

      setTeachers(response?.teachers || []);
    } catch (err) {
      console.error("Failed to load teachers:", err);

      setError(err.response?.data?.message || "Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolId) {
      loadTeachers();
    }
  }, [schoolId]);

  const filteredTeachers = teachers.filter((teacher) => {
    const name =
      `${teacher.firstName || ""} ${teacher.lastName || ""}`.toLowerCase();

    const email = (teacher.email || "").toLowerCase();

    return (
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  const activeTeachers = teachers.filter(
    (teacher) => teacher.isActive !== false,
  ).length;

  const inactiveTeachers = teachers.filter(
    (teacher) => teacher.isActive === false,
  ).length;

  return (
    <div className="teacher-page">
      {/* HEADER */}
      <div className="teacher-header">
        <div>
          <h1 className="teacher-title">Teachers</h1>

          <p className="teacher-subtitle">Manage teachers in your school.</p>
        </div>

        <button className="teacher-refresh-btn" onClick={loadTeachers}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="teacher-summary">
        <div className="teacher-summary-card">
          <div className="teacher-summary-content">
            <p>Total Teachers</p>
            <h2>{teachers.length}</h2>
          </div>

          <div className="teacher-summary-icon">
            <Users size={22} />
          </div>
        </div>

        <div className="teacher-summary-card">
          <div className="teacher-summary-content">
            <p>Active Teachers</p>
            <h2>{activeTeachers}</h2>
          </div>

          <div className="teacher-summary-icon">
            <Users size={22} />
          </div>
        </div>

        <div className="teacher-summary-card">
          <div className="teacher-summary-content">
            <p>Inactive Teachers</p>
            <h2>{inactiveTeachers}</h2>
          </div>

          <div className="teacher-summary-icon">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="teacher-search-box">
        <div className="teacher-search-wrapper">
          <Search size={18} className="teacher-search-icon" />

          <input
            type="text"
            className="teacher-search-input"
            placeholder="Search teachers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="teacher-table-container">
        {loading ? (
          <div className="teacher-loading">
            <Loader2 size={32} className="teacher-loader" />
          </div>
        ) : error ? (
          <div className="teacher-error">{error}</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="teacher-empty">
            <Users size={42} className="teacher-empty-icon" />

            <h3>No teachers found</h3>

            <p>There are no teachers matching your search.</p>
          </div>
        ) : (
          <div className="teacher-table-wrapper">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td>
                      <div className="teacher-info">
                        <div className="teacher-avatar">
                          {teacher.firstName?.[0]}
                          {teacher.lastName?.[0]}
                        </div>

                        <div>
                          <p className="teacher-name">
                            {teacher.firstName} {teacher.lastName}
                          </p>

                          <p className="teacher-role">Teacher</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="teacher-contact">
                        <Mail size={16} />
                        {teacher.email || "N/A"}
                      </div>
                    </td>

                    <td>
                      <div className="teacher-contact">
                        <Phone size={16} />
                        {teacher.phone || "N/A"}
                      </div>
                    </td>

                    <td>
                      {teacher.isActive !== false ? (
                        <span className="teacher-status active">Active</span>
                      ) : (
                        <span className="teacher-status inactive">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teacher;
