
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserPlus,
  RefreshCw,
  MoreVertical,
  Pencil,
  Trash2,
  Mail,
  Building2,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
} from "lucide-react";

import { getAdmins, createAdmin, deleteAdmin } from "../api/admin.api";
import { getSchools } from "../api/school.api";
import "./SuperAdminUsers.css";

export default function SuperAdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [schools, setSchools] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
  fullName: "",
  email: "",
  phone: "",
  password: "",
  school: "",
});
  const [formError, setFormError] = useState("");

  /* =========================================================
     LOAD DATA
  ========================================================= */
const loadData = async (isRefresh = false) => {
  try {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    // Load administrators
    try {
      const adminResponse = await getAdmins({
        page: 1,
        limit: 100,
      });

      console.log("ADMIN RESPONSE:", adminResponse);

      setAdmins(adminResponse?.admins || []);
    } catch (adminError) {
      console.error(
        "FAILED TO LOAD ADMINS:",
        adminError
      );

      setError(
        adminError?.message ||
          "Failed to load administrators."
      );
    }

    // Load schools separately
    try {
      const schoolResponse = await getSchools();

      console.log("SCHOOL RESPONSE:", schoolResponse);

      setSchools(
        Array.isArray(schoolResponse)
          ? schoolResponse
          : schoolResponse?.schools || []
      );
    } catch (schoolError) {
      console.error(
        "FAILED TO LOAD SCHOOLS:",
        schoolError
      );
    }
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================================
     FILTERS
  ========================================================= */

  const filteredAdmins = useMemo(() => {
  const query = search.trim().toLowerCase();

  return admins.filter((admin) => {
    const fullName =
      admin.fullName || "Unnamed Administrator";

    const schoolName =
      typeof admin.school === "object"
        ? admin.school?.name || ""
        : "";

    const matchesSearch =
      !query ||
      fullName.toLowerCase().includes(query) ||
      (admin.email || "").toLowerCase().includes(query) ||
      schoolName.toLowerCase().includes(query);

    const matchesStatus =
      status === "all" ||
      (status === "active" && admin.isActive === true) ||
      (status === "inactive" && admin.isActive !== true);

    return matchesSearch && matchesStatus;
  });
}, [admins, search, status]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalAdmins = admins.length;

  const activeAdmins = admins.filter(
    (admin) => admin.isActive === true
  ).length;

  const inactiveAdmins = admins.filter(
    (admin) => admin.isActive !== true
  ).length;

  /* =========================================================
     FORM
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

 const resetForm = () => {
  setForm({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    school: "",
  });

  setFormError("");
};

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    if (creating) return;

    setShowCreateModal(false);
    resetForm();
  };

  /* =========================================================
     CREATE ADMIN
  ========================================================= */

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    setFormError("");

    if (!form.fullName.trim()) {
      setFormError("Full name is required.");
      return;
    }

    

    if (!form.email.trim()) {
      setFormError("Email is required.");
      return;
    }

    if (!form.password.trim()) {
      setFormError("Password is required.");
      return;
    }

    if (!form.school) {
      setFormError("Please select a school.");
      return;
    }

    try {
      setCreating(true);

      const response = await createAdmin({
  fullName: form.fullName.trim(),
  email: form.email.trim().toLowerCase(),
  phone: form.phone.trim(),
  password: form.password,
  school: form.school,
});

      const newAdmin = response?.admin || response;

      if (newAdmin) {
        setAdmins((previous) => [
          newAdmin,
          ...previous,
        ]);
      }

      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error("Failed to create administrator:", err);

      setFormError(
        err?.message || "Failed to create administrator."
      );
    } finally {
      setCreating(false);
    }
  };

  /* =========================================================
     DELETE ADMIN
  ========================================================= */

  const handleDelete = async (admin) => {
    const fullName = admin.fullName || "Unnamed Administrator";

    const confirmed = window.confirm(
      `Are you sure you want to delete ${fullName || admin.email}?`
    );

    if (!confirmed) return;

    try {
      setOpenMenu(null);

      await deleteAdmin(admin._id);

      setAdmins((previous) =>
        previous.filter((item) => item._id !== admin._id)
      );
    } catch (err) {
      console.error("Failed to delete administrator:", err);

      alert(
        err?.message || "Failed to delete administrator."
      );
    }
  };

  /* =========================================================
     SCHOOL NAME
  ========================================================= */

  const getSchoolName = (admin) => {
    if (!admin.school) return "Not assigned";

    if (typeof admin.school === "object") {
      return admin.school.name || "Not assigned";
    }

    const school = schools.find(
      (item) => item._id === admin.school
    );

    return school?.name || "Not assigned";
  };

  const getSchoolType = (admin) => {
    if (
      admin.school &&
      typeof admin.school === "object"
    ) {
      return admin.school.schoolType || "—";
    }

    const school = schools.find(
      (item) => item._id === admin.school
    );

    return school?.schoolType || "—";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="super-users-page">
        <div className="users-loading">
          <Loader2 className="spin" size={30} />
          <p>Loading administrators...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div
      className="super-users-page"
      onClick={() => setOpenMenu(null)}
    >
      {/* HEADER */}
      <div className="users-header">
        <div>
          <div className="users-title-row">
            <div className="users-title-icon">
              <Users size={24} />
            </div>

            <div>
              <h1>School Administrators</h1>
              <p>
                Manage administrators assigned to schools
                across EduNigeria.
              </p>
            </div>
          </div>
        </div>

        <div className="users-header-actions">
          <button
            className="users-refresh-btn"
            onClick={(e) => {
              e.stopPropagation();
              loadData(true);
            }}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={refreshing ? "spin" : ""}
            />
            Refresh
          </button>

          <button
            className="users-add-btn"
            onClick={(e) => {
              e.stopPropagation();
              openCreateModal();
            }}
          >
            <UserPlus size={17} />
            Add Administrator
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="users-error">
          <XCircle size={18} />
          <span>{error}</span>

          <button onClick={() => loadData()}>
            Try Again
          </button>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="users-stats">
        <div className="user-stat-card">
          <div className="user-stat-icon">
            <Users size={21} />
          </div>

          <div>
            <span>Total Administrators</span>
            <strong>{totalAdmins}</strong>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon active">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Active</span>
            <strong>{activeAdmins}</strong>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon inactive">
            <XCircle size={21} />
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveAdmins}</strong>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="users-toolbar">
        <div className="users-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, email or school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="clear-search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <select
          className="users-status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="users-table-card">
        <div className="users-table-top">
          <div>
            <h2>Administrators</h2>

            <span>
              Showing {filteredAdmins.length} of{" "}
              {totalAdmins} administrators
            </span>
          </div>
        </div>

        {filteredAdmins.length === 0 ? (
          <div className="users-empty">
            <Users size={42} />

            <h3>No administrators found</h3>

            <p>
              {search || status !== "all"
                ? "Try changing your search or filter."
                : "No school administrators have been created yet."}
            </p>

            {!search && status === "all" && (
              <button
                className="users-add-btn"
                onClick={openCreateModal}
              >
                <UserPlus size={17} />
                Add Administrator
              </button>
            )}
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Administrator</th>
                  <th>Email</th>
                  <th>School</th>
                  <th>School Type</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
<tbody>
  {filteredAdmins.map((admin) => {
    const fullName =
      admin.fullName || "Unnamed Administrator";

    return (
      <tr key={admin._id}>
        <td>
          <div className="user-cell">
            <div className="user-avatar">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{fullName}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </td>

        <td>
          {admin.email || "—"}
        </td>

        <td>
          {getSchoolName(admin)}
        </td>

        <td>
          {getSchoolType(admin)}
        </td>

        <td>
          {admin.isActive ? (
            <span className="status-badge active">
              <CheckCircle2 size={14} />
              Active
            </span>
          ) : (
            <span className="status-badge inactive">
              <XCircle size={14} />
              Inactive
            </span>
          )}
        </td>

        <td>
          {formatDate(admin.createdAt)}
        </td>

        <td>
          <div className="action-cell">
            <button
              type="button"
              className="table-action"
              onClick={(e) => {
                e.stopPropagation();

                setOpenMenu(
                  openMenu === admin._id
                    ? null
                    : admin._id
                );
              }}
            >
              <MoreVertical size={18} />
            </button>

            {openMenu === admin._id && (
              <div className="action-menu">
                <button
                  type="button"
                  onClick={() => {
                    setOpenMenu(null);
                    alert(
                      "Edit administrator coming next."
                    );
                  }}
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() =>
                    handleDelete(admin)
                  }
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE ADMIN MODAL */}
      {showCreateModal && (
        <div
          className="users-modal-overlay"
          onClick={closeCreateModal}
        >
          <div
            className="users-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="users-modal-header">
              <div>
                <h2>Add Administrator</h2>

                <p>
                  Create an administrator account and
                  assign it to a school.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeCreateModal}
                disabled={creating}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin}>
              {formError && (
                <div className="form-error">
                  <XCircle size={17} />
                  <span>{formError}</span>
                </div>
              )}

              {/* FULL NAME */}
              <div className="form-group">
                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter administrator's full name"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              {/* PHONE */}
              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="08012345678"
                />
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>

              {/* SCHOOL */}
              <div className="form-group">
                <label htmlFor="school">
                  School
                </label>

                <select
                  id="school"
                  name="school"
                  value={form.school}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select school
                  </option>

                  {schools
                    .filter(
                      (school) =>
                        school.isActive !== false
                    )
                    .map((school) => (
                      <option
                        key={school._id}
                        value={school._id}
                      >
                        {school.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* FOOTER */}
              <div className="users-modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeCreateModal}
                  disabled={creating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-admin-btn"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <Loader2
                        size={17}
                        className="spin"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus size={17} />
                      Create Administrator
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

