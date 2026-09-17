import { useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, Users } from "lucide-react";

const CLASS_OPTIONS = [
  "Nursery 1", "Nursery 2",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
  "JSS 1", "JSS 2", "JSS 3",
  "SS 1", "SS 2", "SS 3",
];

function Counsellor() {
  const { user, isCounsellor, getStudents } = useAuth();
  const [search, setSearch] = useState("");
  const [studentClass, setStudentClass] = useState("");

  // Guard: not logged in -> login. Logged in but not a counsellor/admin -> home.
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!isCounsellor(user)) {
    return <Navigate to="/" replace />;
  }

  const students = useMemo(
    () => getStudents({ studentClass, search }),
    [getStudents, studentClass, search]
  );

  return (
    <div className="csl-page">
      <style>{`
        .csl-page {
          --ink: #1557b0;
          --paper: #f7f3e8;
          min-height: 100vh;
          background: var(--paper);
          padding: 48px 24px;
        }
        .csl-inner { max-width: 960px; margin: 0 auto; }
        .csl-header { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
        .csl-header h1 { font-size: 1.6rem; color: var(--ink); margin: 0; font-weight: 600; }
        .csl-subtitle { font-size: 14px; color: rgba(33, 48, 31, 0.55); margin: 4px 0 28px; }

        .csl-controls {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .csl-search-wrap {
          position: relative;
          flex: 1;
          min-width: 220px;
        }
        .csl-search-wrap svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(33, 48, 31, 0.4);
        }
        .csl-search {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border-radius: 6px;
          border: 1px solid rgba(33, 48, 31, 0.2);
          background: white;
          font-size: 14px;
          outline: none;
        }
        .csl-search:focus { border-color: var(--ink); }

        .csl-select {
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid rgba(33, 48, 31, 0.2);
          background: white;
          font-size: 14px;
          outline: none;
          min-width: 180px;
        }
        .csl-select:focus { border-color: var(--ink); }

        .csl-count { font-size: 13px; color: rgba(33, 48, 31, 0.5); margin-bottom: 12px; }

        .csl-table-wrap {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(33, 48, 31, 0.1);
        }
        table.csl-table { width: 100%; border-collapse: collapse; }
        .csl-table th {
          text-align: left;
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(33, 48, 31, 0.5);
          padding: 12px 16px;
          border-bottom: 1px solid rgba(33, 48, 31, 0.1);
          background: rgba(33, 48, 31, 0.03);
        }
        .csl-table td {
          padding: 12px 16px;
          font-size: 14px;
          color: var(--ink);
          border-bottom: 1px solid rgba(33, 48, 31, 0.06);
        }
        .csl-table tr:last-child td { border-bottom: none; }
        .csl-table tr:hover td { background: rgba(21, 87, 176, 0.04); }

        .csl-badge {
          display: inline-block;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(21, 87, 176, 0.1);
          color: var(--ink);
        }

        .csl-empty {
          padding: 48px 16px;
          text-align: center;
          color: rgba(33, 48, 31, 0.5);
          font-size: 14px;
        }
      `}</style>

      <div className="csl-inner">
        <div className="csl-header">
          <Users size={22} color="#1557b0" />
          <h1>Students</h1>
        </div>
        <p className="csl-subtitle">
          Full list of enrolled students. Search by name or email, or filter by class.
        </p>

        <div className="csl-controls">
          <div className="csl-search-wrap">
            <Search size={16} />
            <input
              type="text"
              className="csl-search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="csl-select"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
          >
            <option value="">All classes</option>
            {CLASS_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <p className="csl-count">
          {students.length} student{students.length !== 1 ? "s" : ""} found
        </p>

        <div className="csl-table-wrap">
          {students.length === 0 ? (
            <div className="csl-empty">No students match your search.</div>
          ) : (
            <table className="csl-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Gender</th>
                  <th>Previous school</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.firstName} {s.lastName}</td>
                    <td>{s.email}</td>
                    <td><span className="csl-badge">{s.studentClass}</span></td>
                    <td>{s.gender}</td>
                    <td>{s.previousSchool}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Counsellor;