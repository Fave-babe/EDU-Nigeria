import { useEffect, useState } from "react";
import { Building2, Search, RefreshCw } from "lucide-react";
import { getSchools } from "../api/school.api";
import "./SchoolsPage.css";

function SchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadSchools = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSchools();

      const schoolData = Array.isArray(response?.schools)
        ? response.schools
        : [];

      setSchools(schoolData);
    } catch (err) {
      console.error("Failed to load schools:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load schools."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const filteredSchools = schools.filter((school) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return true;

    return [
      school?.name,
      school?.email,
      school?.schoolType,
      school?.city,
      school?.state,
      school?.country,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(term)
      );
  });

  return (
    <div className="schools-page">
      <div className="schools-page-header">
        <div>
          <h1>Schools</h1>
          <p>Manage all schools registered on EduNigeria.</p>
        </div>

        <button
          className="schools-refresh-btn"
          onClick={loadSchools}
          disabled={loading}
        >
          <RefreshCw size={17} className={loading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="schools-toolbar">
        <div className="schools-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="schools-count">
          {filteredSchools.length}{" "}
          {filteredSchools.length === 1 ? "School" : "Schools"}
        </div>
      </div>

      {loading ? (
        <div className="schools-empty">
          <RefreshCw size={28} className="spin" />
          <p>Loading schools...</p>
        </div>
      ) : error ? (
        <div className="schools-empty">
          <strong>{error}</strong>

          <button onClick={loadSchools}>
            Try Again
          </button>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="schools-empty">
          <Building2 size={35} />
          <strong>No schools found</strong>
          <p>
            {searchTerm
              ? "Try another search."
              : "There are no schools registered yet."}
          </p>
        </div>
      ) : (
        <div className="schools-table-wrapper">
          <table className="schools-table">
            <thead>
              <tr>
                <th>School</th>
                <th>Location</th>
                <th>School Type</th>
                <th>Email</th>
                <th>Status</th>
                <th>Date Added</th>
              </tr>
            </thead>

            <tbody>
              {filteredSchools.map((school) => (
                <tr key={school._id}>
                  <td>
                    <div className="school-name">
                      <div className="school-icon">
                        <Building2 size={19} />
                      </div>

                      <div>
                        <strong>
                          {school.name || "Unnamed School"}
                        </strong>
                      </div>
                    </div>
                  </td>

                  <td>
                    {[school.city, school.state]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </td>

                  <td>
                    {school.schoolType || "—"}
                  </td>

                  <td>
                    {school.email || "—"}
                  </td>

                  <td>
                    <span
                      className={
                        school.isActive
                          ? "school-status active"
                          : "school-status inactive"
                      }
                    >
                      {school.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td>
                    {school.createdAt
                      ? new Date(
                          school.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SchoolsPage;