import React, { useEffect, useMemo, useState } from "react";
import {
Search,
Users,
UserPlus,
RefreshCw,
MoreVertical,
Pencil,
Trash2,
Building2,
CheckCircle2,
XCircle,
Loader2,
X,
ShieldCheck,
GraduationCap,
Mail,
Phone,
ChevronDown,
UserRound,
School,
} from "lucide-react";

import {
getAdmins,
createAdmin,
deleteAdmin,
} from "../api/admin.api";

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

// =====================================================
// LOAD DATA
// =====================================================

const loadData = async (isRefresh = false) => {
try {
if (isRefresh) {
setRefreshing(true);
} else {
setLoading(true);
}


  setError("");

  const results = await Promise.allSettled([
    getAdmins({ page: 1, limit: 100 }),
    getSchools(),
  ]);

  const [adminResult, schoolResult] = results;

  if (adminResult.status === "fulfilled") {
    const response = adminResult.value;

    const adminData = Array.isArray(response)
      ? response
      : Array.isArray(response?.admins)
        ? response.admins
        : Array.isArray(response?.data?.admins)
          ? response.data.admins
          : Array.isArray(response?.data?.data?.admins)
            ? response.data.data.admins
            : [];

    setAdmins(adminData);
  } else {
    throw adminResult.reason;
  }

  if (schoolResult.status === "fulfilled") {
    const response = schoolResult.value;

    const schoolData = Array.isArray(response)
      ? response
      : Array.isArray(response?.schools)
        ? response.schools
        : Array.isArray(response?.data?.schools)
          ? response.data.schools
          : Array.isArray(response?.data?.data?.schools)
            ? response.data.data.schools
            : Array.isArray(response?.data)
              ? response.data
              : [];

    setSchools(schoolData);
  } else {
    console.error(
      "FAILED TO LOAD SCHOOLS:",
      schoolResult.reason
    );
  }
} catch (err) {
  console.error("FAILED TO LOAD USERS:", err);

  setError(
    err?.response?.data?.message ||
      err?.message ||
      "Failed to load administrators."
  );
} finally {
  setLoading(false);
  setRefreshing(false);
}


};

useEffect(() => {
loadData();
}, []);

// =====================================================
// FILTER ADMINISTRATORS
// =====================================================

const filteredAdmins = useMemo(() => {
const query = search.trim().toLowerCase();

return admins.filter((admin) => {
  const fullName =
    admin.fullName || "Unnamed Administrator";

  const schoolName =
    typeof admin.school === "object"
      ? admin.school?.name || ""
      : getSchoolName(admin.school);

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


}, [admins, schools, search, status]);

// =====================================================
// STATISTICS
// =====================================================

const totalAdmins = admins.length;

const activeAdmins = admins.filter(
(admin) => admin.isActive === true
).length;

const inactiveAdmins = admins.filter(
(admin) => admin.isActive !== true
).length;

const assignedAdmins = admins.filter(
(admin) => Boolean(admin.school)
).length;

// =====================================================
// SCHOOL HELPERS
// =====================================================

function getSchoolName(schoolReference) {
if (!schoolReference) return "Not assigned";

if (typeof schoolReference === "object") {
  return schoolReference.name || "Not assigned";
}

const school = schools.find(
  (item) => item._id === schoolReference
);

return school?.name || "Not assigned";


}

function getSchoolType(admin) {
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


}

// =====================================================
// FORM HANDLERS
// =====================================================

const handleChange = (event) => {
const { name, value } = event.target;


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

// =====================================================
// CREATE ADMINISTRATOR
// =====================================================

const handleCreateAdmin = async (event) => {
event.preventDefault();
setFormError("");


if (!form.fullName.trim()) {
  setFormError("Full name is required.");
  return;
}

if (!form.email.trim()) {
  setFormError("Email address is required.");
  return;
}

if (form.password.length < 8) {
  setFormError(
    "Password must contain at least 8 characters."
  );
  return;
}

if (!form.school) {
  setFormError("Please select a school.");
  return;
}

try {
  setCreating(true);

  await createAdmin({
    fullName: form.fullName.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
    password: form.password,
    school: form.school,
  });

  setShowCreateModal(false);
  resetForm();

  await loadData(true);
} catch (err) {
  console.error(
    "FAILED TO CREATE ADMINISTRATOR:",
    err
  );

  setFormError(
    err?.response?.data?.message ||
      err?.message ||
      "Failed to create administrator."
  );
} finally {
  setCreating(false);
}


};

// =====================================================
// DELETE ADMINISTRATOR
// =====================================================

const handleDelete = async (admin) => {
const fullName =
admin.fullName || "Unnamed Administrator";


const confirmed = window.confirm(
  `Are you sure you want to delete ${fullName}?`
);

if (!confirmed) return;

try {
  setOpenMenu(null);

  await deleteAdmin(admin._id);

  setAdmins((previous) =>
    previous.filter(
      (item) => item._id !== admin._id
    )
  );
} catch (err) {
  console.error(
    "FAILED TO DELETE ADMINISTRATOR:",
    err
  );

  window.alert(
    err?.response?.data?.message ||
      err?.message ||
      "Failed to delete administrator."
  );
}


};

// =====================================================
// DATE FORMATTING
// =====================================================

const formatDate = (date) => {
if (!date) return "—";


const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
  return "—";
}

return parsedDate.toLocaleDateString("en-NG", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});


};

// =====================================================
// LOADING SCREEN
// =====================================================

if (loading) {
return ( <div className="super-users-page"> <div className="users-loading"> <div className="users-loading-icon"> <Loader2 className="spin" size={32} /> </div>


      <h2>Loading administrators</h2>

      <p>
        Please wait while we retrieve your data.
      </p>
    </div>
  </div>
);


}

// =====================================================
// PAGE
// =====================================================

return (
<div
className="super-users-page"
onClick={() => setOpenMenu(null)}
> <div className="users-page-container">


    {/* HEADER */}

    <header className="users-header">
      <div className="users-title-row">
        <div className="users-title-icon">
          <ShieldCheck size={26} />
        </div>

        <div className="users-title-content">
          <div className="users-eyebrow">
            PLATFORM MANAGEMENT
          </div>

          <h1>School Administrators</h1>

          <p>
            Manage administrator accounts across
            all EduNigeria schools.
          </p>
        </div>
      </div>

      <div className="users-header-actions">
        <button
          type="button"
          className="users-refresh-btn"
          onClick={(event) => {
            event.stopPropagation();
            loadData(true);
          }}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>

        <button
          type="button"
          className="users-add-btn"
          onClick={(event) => {
            event.stopPropagation();
            openCreateModal();
          }}
        >
          <UserPlus size={18} />
          Add Administrator
        </button>
      </div>
    </header>

    {/* ERROR */}

    {error && (
      <div className="users-error">
        <XCircle size={20} />

        <div>
          <strong>Unable to load administrators</strong>
          <p>{error}</p>
        </div>

        <button
          type="button"
          onClick={() => loadData()}
        >
          Try Again
        </button>
      </div>
    )}

    {/* STATISTICS */}

    <section className="users-stats">
      <div className="user-stat-card">
        <div className="user-stat-icon purple">
          <Users size={22} />
        </div>

        <div className="user-stat-content">
          <span>Total Administrators</span>
          <strong>{totalAdmins}</strong>
          <small>All registered administrators</small>
        </div>
      </div>

      <div className="user-stat-card">
        <div className="user-stat-icon active">
          <CheckCircle2 size={22} />
        </div>

        <div className="user-stat-content">
          <span>Active Accounts</span>
          <strong>{activeAdmins}</strong>
          <small>Currently active accounts</small>
        </div>
      </div>

      <div className="user-stat-card">
        <div className="user-stat-icon inactive">
          <XCircle size={22} />
        </div>

        <div className="user-stat-content">
          <span>Inactive Accounts</span>
          <strong>{inactiveAdmins}</strong>
          <small>Accounts not currently active</small>
        </div>
      </div>

      <div className="user-stat-card">
        <div className="user-stat-icon green">
          <Building2 size={22} />
        </div>

        <div className="user-stat-content">
          <span>Assigned Administrators</span>
          <strong>{assignedAdmins}</strong>
          <small>Linked to a school</small>
        </div>
      </div>
    </section>

    {/* TABLE PANEL */}

    <section className="users-table-card">
      <div className="users-table-top">
        <div>
          <div className="users-section-eyebrow">
            ACCOUNT DIRECTORY
          </div>

          <h2>Administrator Directory</h2>

          <p>
            Search and manage school administrator
            accounts.
          </p>
        </div>

        <div className="users-record-count">
          <Users size={16} />
          {filteredAdmins.length} records
        </div>
      </div>

      {/* TOOLBAR */}

      <div className="users-toolbar">
        <div className="users-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search name, email or school..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <label className="users-filter">
          <span>Status:</span>

          <div className="users-filter-select">
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <ChevronDown size={16} />
          </div>
        </label>
      </div>

      {/* TABLE */}

      {filteredAdmins.length === 0 ? (
        <div className="users-empty">
          <div className="users-empty-icon">
            <Users size={34} />
          </div>

          <h3>No administrators found</h3>

          <p>
            {search || status !== "all"
              ? "Try changing your search or status filter."
              : "Create an administrator account to get started."}
          </p>

          {!search && status === "all" && (
            <button
              type="button"
              className="users-add-btn"
              onClick={openCreateModal}
            >
              <UserPlus size={17} />
              Add Administrator
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Administrator</th>
                  <th>Contact</th>
                  <th>Assigned School</th>
                  <th>School Type</th>
                  <th>Status</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAdmins.map((admin) => {
                  const fullName =
                    admin.fullName ||
                    "Unnamed Administrator";

                  return (
                    <tr key={admin._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {fullName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="user-details">
                            <strong>{fullName}</strong>
                            <span>
                              <ShieldCheck size={13} />
                              School Administrator
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="user-contact">
                          <div>
                            <Mail size={14} />
                            <span>
                              {admin.email || "No email"}
                            </span>
                          </div>

                          {admin.phone && (
                            <div>
                              <Phone size={14} />
                              <span>{admin.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="assigned-school">
                          <div className="assigned-school-icon">
                            <School size={17} />
                          </div>

                          <span>
                            {getSchoolName(admin.school)}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="school-type-badge">
                          {getSchoolType(admin)}
                        </span>
                      </td>

                      <td>
                        {admin.isActive === true ? (
                          <span className="status-badge active">
                            <span className="status-dot" />
                            Active
                          </span>
                        ) : (
                          <span className="status-badge inactive">
                            <span className="status-dot" />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td>
                        <span className="user-date">
                          {formatDate(admin.createdAt)}
                        </span>
                      </td>

                      <td>
                        <div
                          className="action-cell"
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        >
                          <button
                            type="button"
                            className="table-action"
                            aria-label="Administrator actions"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === admin._id
                                  ? null
                                  : admin._id
                              )
                            }
                          >
                            <MoreVertical size={19} />
                          </button>

                          {openMenu === admin._id && (
                            <div className="action-menu">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenu(null);

                                  window.alert(
                                    "Administrator editing has not been connected yet."
                                  );
                                }}
                              >
                                <Pencil size={15} />
                                Edit Administrator
                              </button>

                              <button
                                type="button"
                                className="danger"
                                onClick={() =>
                                  handleDelete(admin)
                                }
                              >
                                <Trash2 size={15} />
                                Delete Administrator
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

          <div className="users-table-footer">
            <span>
              Showing{" "}
              <strong>{filteredAdmins.length}</strong>{" "}
              of <strong>{totalAdmins}</strong>{" "}
              administrators
            </span>

            <span className="users-footer-note">
              EduNigeria Platform Administration
            </span>
          </div>
        </>
      )}
    </section>

    {/* CREATE ADMIN MODAL */}

    {showCreateModal && (
      <div
        className="users-modal-overlay"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            closeCreateModal();
          }
        }}
      >
        <div
          className="users-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-admin-title"
        >
          <div className="users-modal-header">
            <div className="users-modal-title-icon">
              <UserPlus size={23} />
            </div>

            <div className="users-modal-heading">
              <span>NEW ACCOUNT</span>
              <h2 id="create-admin-title">
                Add Administrator
              </h2>

              <p>
                Create an administrator account and
                assign it to an approved school.
              </p>
            </div>

            <button
              type="button"
              className="modal-close"
              onClick={closeCreateModal}
              disabled={creating}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCreateAdmin}>
            <div className="users-modal-body">
              {formError && (
                <div className="form-error">
                  <XCircle size={18} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="fullName">
                  Full Name
                </label>

                <div className="form-input-wrapper">
                  <UserRound size={18} />

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    autoComplete="name"
                    required
                    disabled={creating}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <div className="form-input-wrapper">
                  <Mail size={18} />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                    disabled={creating}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number
                  <span className="optional-label">
                    Optional
                  </span>
                </label>

                <div className="form-input-wrapper">
                  <Phone size={18} />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    disabled={creating}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Temporary Password
                </label>

                <div className="form-input-wrapper">
                  <ShieldCheck size={18} />

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={creating}
                  />
                </div>

                <small className="form-help">
                  Use a unique password for this administrator.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="school">
                  Assign School
                </label>

                <div className="form-input-wrapper select-wrapper">
                  <Building2 size={18} />

                  <select
                    id="school"
                    name="school"
                    value={form.school}
                    onChange={handleChange}
                    required
                    disabled={creating}
                  >
                    <option value="">
                      Select an approved school
                    </option>

                    {schools
                      .filter(
                        (school) =>
                          String(
                            school.status || ""
                          ).toLowerCase() === "approved" &&
                          school.isActive === true
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

                  <ChevronDown
                    size={17}
                    className="select-chevron"
                  />
                </div>

                <small className="form-help">
                  Only approved and active schools are listed.
                </small>
              </div>
            </div>

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
                      size={18}
                      className="spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
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
</div>


);
}
