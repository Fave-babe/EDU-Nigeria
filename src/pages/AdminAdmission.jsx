
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  User,
  Mail,
  Phone,
  GraduationCap,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

import {
  getAdmissionApplications,
  approveAdmissionApplication,
  rejectAdmissionApplication,
} from "../api/admissionApplication.api";

import "./AdminAdmission.css";

export default function AdminAdmissions() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [showRejectModal, setShowRejectModal] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdmissionApplications();

      console.log(
        "ADMISSION APPLICATIONS RESPONSE:",
        response
      );

      setApplications(response?.applications || []);
    } catch (err) {
      console.error(
        "ADMISSION APPLICATIONS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load admission applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return applications.filter((application) => {
      const fullName =
        `${application.firstName || ""} ${
          application.lastName || ""
        }`.toLowerCase();

      const email =
        application.email?.toLowerCase() || "";

      const applyingForClass =
        application.applyingForClass?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        applyingForClass.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        application.applicationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: applications.length,

      pending: applications.filter(
        (application) =>
          application.applicationStatus === "pending" ||
          application.applicationStatus === "exam_pending"
      ).length,

      underReview: applications.filter(
        (application) =>
          application.applicationStatus === "under_review"
      ).length,

      approved: applications.filter(
        (application) =>
          application.applicationStatus === "enrolled"
      ).length,

      rejected: applications.filter(
        (application) =>
          application.applicationStatus === "rejected"
      ).length,
    };
  }, [applications]);

  const handleApprove = async (application) => {
    const confirmed = window.confirm(
      `Approve ${application.firstName} ${application.lastName} for admission?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(application._id);
      setError("");
      setSuccess("");

      const response =
        await approveAdmissionApplication(
          application._id
        );

      console.log(
        "APPROVAL RESPONSE:",
        response
      );

      setSuccess(
        `${application.firstName} ${application.lastName} has been approved and enrolled successfully.`
      );

      setSelectedApplication(null);

      await loadApplications();
    } catch (err) {
      console.error(
        "APPROVE APPLICATION ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to approve this application."
      );
    } finally {
      setActionLoading("");
    }
  };

  const openRejectModal = (application) => {
    setSelectedApplication(application);
    setRejectionReason("");
    setShowRejectModal(true);
    setError("");
    setSuccess("");
  };

  const handleReject = async () => {
    if (!selectedApplication) {
      return;
    }

    try {
      setActionLoading(selectedApplication._id);
      setError("");
      setSuccess("");

      const response =
        await rejectAdmissionApplication(
          selectedApplication._id,
          rejectionReason.trim()
        );

      console.log(
        "REJECTION RESPONSE:",
        response
      );

      setSuccess(
        `${selectedApplication.firstName} ${selectedApplication.lastName}'s application has been rejected.`
      );

      setShowRejectModal(false);
      setSelectedApplication(null);
      setRejectionReason("");

      await loadApplications();
    } catch (err) {
      console.error(
        "REJECT APPLICATION ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reject this application."
      );
    } finally {
      setActionLoading("");
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";

      case "exam_pending":
        return "Exam Pending";

      case "exam_completed":
        return "Exam Completed";

      case "under_review":
        return "Under Review";

      case "approved":
        return "Approved";

      case "enrolled":
        return "Enrolled";

      case "rejected":
        return "Rejected";

      default:
        return status || "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "under_review":
      case "exam_completed":
        return "status-review";

      case "enrolled":
      case "approved":
        return "status-approved";

      case "rejected":
        return "status-rejected";

      case "pending":
      case "exam_pending":
      default:
        return "status-pending";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="admin-admissions-page">
      <div className="admin-admissions-header">
        <div>
          <div className="admin-admissions-eyebrow">
            ADMISSIONS
          </div>

          <h1>Admission Applications</h1>

          <p>
            Review student applications and entrance
            examination results before making an admission
            decision.
          </p>
        </div>

        <button
          className="admissions-refresh-btn"
          onClick={loadApplications}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "spin" : ""}
          />

          Refresh
        </button>
      </div>

      {error && (
        <div className="admissions-alert admissions-alert-error">
          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            onClick={() => setError("")}
            aria-label="Close error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {success && (
        <div className="admissions-alert admissions-alert-success">
          <CheckCircle2 size={18} />

          <span>{success}</span>

          <button
            onClick={() => setSuccess("")}
            aria-label="Close success message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="admissions-stat-grid">
        <div className="admissions-stat-card">
          <div className="admissions-stat-icon">
            <FileText size={20} />
          </div>

          <div>
            <span>Total Applications</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="admissions-stat-card">
          <div className="admissions-stat-icon">
            <Clock size={20} />
          </div>

          <div>
            <span>Awaiting Review</span>
            <strong>{stats.underReview}</strong>
          </div>
        </div>

        <div className="admissions-stat-card">
          <div className="admissions-stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Enrolled</span>
            <strong>{stats.approved}</strong>
          </div>
        </div>

        <div className="admissions-stat-card">
          <div className="admissions-stat-icon">
            <XCircle size={20} />
          </div>

          <div>
            <span>Rejected</span>
            <strong>{stats.rejected}</strong>
          </div>
        </div>
      </div>

      <div className="admissions-toolbar">
        <div className="admissions-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search applicant, email or class..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="all">
            All Applications
          </option>

          <option value="exam_pending">
            Exam Pending
          </option>

          <option value="under_review">
            Under Review
          </option>

          <option value="enrolled">
            Enrolled
          </option>

          <option value="rejected">
            Rejected
          </option>
        </select>
      </div>

      <div className="admissions-table-card">
        <div className="admissions-table-header">
          <div>
            <h2>Applications</h2>

            <span>
              {filteredApplications.length} application
              {filteredApplications.length === 1
                ? ""
                : "s"}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="admissions-loading">
            <Loader2
              size={30}
              className="spin"
            />

            <p>
              Loading admission applications...
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="admissions-empty">
            <FileText size={42} />

            <h3>No applications found</h3>

            <p>
              There are no admission applications matching
              your current filters.
            </p>
          </div>
        ) : (
          <div className="admissions-table-wrapper">
            <table className="admissions-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Class</th>
                  <th>Exam Score</th>
                  <th>Exam Status</th>
                  <th>Application</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map(
                  (application) => {
                    const isLoading =
                      actionLoading ===
                      application._id;

                    return (
                      <tr key={application._id}>
                        <td>
                          <div className="applicant-cell">
                            <div className="applicant-avatar">
                              <User size={18} />
                            </div>

                            <div>
                              <strong>
                                {application.firstName}{" "}
                                {application.lastName}
                              </strong>

                              <span>
                                {application.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="class-cell">
                            <GraduationCap size={16} />

                            {application.applyingForClass ||
                              "—"}
                          </div>
                        </td>

                        <td>
                          {application.examStatus ===
                          "completed" ? (
                            <div className="score-cell">
                              <strong>
                                {
                                  application.examScore
                                }
                                /
                                {
                                  application.examTotal
                                }
                              </strong>

                              <span>
                                {Math.round(
                                  application.examPercentage ||
                                    0
                                )}
                                %
                              </span>
                            </div>
                          ) : (
                            <span className="not-available">
                              Not taken
                            </span>
                          )}
                        </td>

                        <td>
                          <span
                            className={`exam-status ${
                              application.examStatus ===
                              "completed"
                                ? "exam-completed"
                                : "exam-not-completed"
                            }`}
                          >
                            {application.examStatus ===
                            "completed"
                              ? "Completed"
                              : "Not Completed"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`application-status ${getStatusClass(
                              application.applicationStatus
                            )}`}
                          >
                            {getStatusLabel(
                              application.applicationStatus
                            )}
                          </span>
                        </td>

                        <td>
                          <span className="date-cell">
                            {formatDate(
                              application.createdAt
                            )}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="view-btn"
                              onClick={() =>
                                setSelectedApplication(
                                  application
                                )
                              }
                            >
                              View
                            </button>

                            {application.applicationStatus !==
                              "enrolled" &&
                              application.applicationStatus !==
                                "rejected" &&
                              application.examStatus ===
                                "completed" && (
                                <>
                                  <button
                                    className="approve-btn"
                                    disabled={isLoading}
                                    onClick={() =>
                                      handleApprove(
                                        application
                                      )
                                    }
                                  >
                                    {isLoading ? (
                                      <Loader2
                                        size={15}
                                        className="spin"
                                      />
                                    ) : (
                                      <CheckCircle2
                                        size={15}
                                      />
                                    )}

                                    Approve
                                  </button>

                                  <button
                                    className="reject-btn"
                                    disabled={isLoading}
                                    onClick={() =>
                                      openRejectModal(
                                        application
                                      )
                                    }
                                  >
                                    <XCircle size={15} />

                                    Reject
                                  </button>
                                </>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedApplication &&
        !showRejectModal && (
          <div
            className="admission-modal-overlay"
            onClick={() =>
              setSelectedApplication(null)
            }
          >
            <div
              className="admission-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="admission-modal-header">
                <div>
                  <span>
                    ADMISSION APPLICATION
                  </span>

                  <h2>
                    {selectedApplication.firstName}{" "}
                    {selectedApplication.lastName}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    setSelectedApplication(null)
                  }
                >
                  <X size={20} />
                </button>
              </div>

              <div className="admission-details-grid">
                <div className="detail-item">
                  <span>
                    <User size={15} />
                    Applicant
                  </span>

                  <strong>
                    {selectedApplication.firstName}{" "}
                    {selectedApplication.lastName}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    <Mail size={15} />
                    Email
                  </span>

                  <strong>
                    {selectedApplication.email ||
                      "—"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    <Phone size={15} />
                    Phone
                  </span>

                  <strong>
                    {selectedApplication.phone ||
                      "—"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    <GraduationCap size={15} />
                    Applying For
                  </span>

                  <strong>
                    {selectedApplication.applyingForClass ||
                      "—"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    Exam Score
                  </span>

                  <strong>
                    {selectedApplication.examStatus ===
                    "completed"
                      ? `${selectedApplication.examScore}/${selectedApplication.examTotal}`
                      : "Not completed"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    Exam Percentage
                  </span>

                  <strong>
                    {selectedApplication.examStatus ===
                    "completed"
                      ? `${Math.round(
                          selectedApplication.examPercentage ||
                            0
                        )}%`
                      : "—"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    Exam Result
                  </span>

                  <strong>
                    {selectedApplication.examStatus ===
                    "completed"
                      ? selectedApplication.examPassed
                        ? "Passed"
                        : "Below Pass Mark"
                      : "Not available"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    Application Status
                  </span>

                  <strong>
                    {getStatusLabel(
                      selectedApplication.applicationStatus
                    )}
                  </strong>
                </div>
              </div>

              {selectedApplication.previousSchool && (
                <div className="detail-full">
                  <span>Previous School</span>

                  <p>
                    {selectedApplication.previousSchool}
                  </p>
                </div>
              )}

              {selectedApplication.address && (
                <div className="detail-full">
                  <span>Address</span>

                  <p>
                    {selectedApplication.address}
                  </p>
                </div>
              )}

              {selectedApplication.adminNote && (
                <div className="detail-full">
                  <span>Admin Note</span>

                  <p>
                    {selectedApplication.adminNote}
                  </p>
                </div>
              )}

              {selectedApplication.rejectionReason && (
                <div className="detail-full rejection-note">
                  <span>Rejection Reason</span>

                  <p>
                    {
                      selectedApplication.rejectionReason
                    }
                  </p>
                </div>
              )}

              {selectedApplication.applicationStatus !==
                "enrolled" &&
                selectedApplication.applicationStatus !==
                  "rejected" &&
                selectedApplication.examStatus ===
                  "completed" && (
                  <div className="admission-modal-actions">
                    <button
                      className="reject-modal-btn"
                      onClick={() =>
                        openRejectModal(
                          selectedApplication
                        )
                      }
                    >
                      <XCircle size={17} />

                      Reject Application
                    </button>

                    <button
                      className="approve-modal-btn"
                      disabled={
                        actionLoading ===
                        selectedApplication._id
                      }
                      onClick={() =>
                        handleApprove(
                          selectedApplication
                        )
                      }
                    >
                      {actionLoading ===
                      selectedApplication._id ? (
                        <Loader2
                          size={17}
                          className="spin"
                        />
                      ) : (
                        <CheckCircle2 size={17} />
                      )}

                      Approve & Enroll
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}

      {showRejectModal &&
        selectedApplication && (
          <div className="admission-modal-overlay">
            <div className="admission-reject-modal">
              <div className="admission-modal-header">
                <div>
                  <span>
                    REJECT APPLICATION
                  </span>

                  <h2>
                    {selectedApplication.firstName}{" "}
                    {selectedApplication.lastName}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <p className="reject-description">
                You are about to reject this admission
                application. You can provide a reason for
                the applicant.
              </p>

              <label>
                Rejection Reason
              </label>

              <textarea
                value={rejectionReason}
                onChange={(e) =>
                  setRejectionReason(
                    e.target.value
                  )
                }
                placeholder="Enter the reason for rejection..."
                rows={5}
              />

              <div className="reject-modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                >
                  Cancel
                </button>

                <button
                  className="confirm-reject-btn"
                  disabled={
                    actionLoading ===
                    selectedApplication._id
                  }
                  onClick={handleReject}
                >
                  {actionLoading ===
                  selectedApplication._id ? (
                    <Loader2
                      size={17}
                      className="spin"
                    />
                  ) : (
                    <XCircle size={17} />
                  )}

                  Reject Application
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}







