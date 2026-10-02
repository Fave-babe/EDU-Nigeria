import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Receipt,
  Users,
  WalletCards,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  getPayments,
  getTotalRevenue,
  getMyChildrenPayments,
} from "../api/payment.api";

import "./Finance.css";

export default function Finance() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feeTypeFilter, setFeeTypeFilter] = useState("all");

  const isParent = user?.role === "parent";

  const schoolId =
    typeof user?.school === "object"
      ? user?.school?._id
      : user?.school;

  const loadPayments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      // =====================================================
      // PARENT
      // Only load payments belonging to linked children
      // =====================================================

      if (isParent) {
        const response = await getMyChildrenPayments();

        console.log("PARENT PAYMENTS RESPONSE:", response);

        const paymentList =
          response?.payments ??
          response?.data?.payments ??
          [];

        const safePayments = Array.isArray(paymentList)
          ? paymentList
          : [];

        setPayments(safePayments);

        // Calculate total paid by the parent's children
        const parentRevenue = safePayments
          .filter(
            (payment) =>
              String(payment.status || "").toLowerCase() ===
              "paid"
          )
          .reduce(
            (total, payment) =>
              total + Number(payment.amount || 0),
            0
          );

        setTotalRevenue(parentRevenue);

        return;
      }

      // =====================================================
      // ADMIN / BURSAR / SUPER ADMIN
      // School-wide finance
      // =====================================================

      if (!schoolId) {
        setPayments([]);
        setTotalRevenue(0);
        setError(
          "No school is associated with this account."
        );
        return;
      }

      const [paymentsResponse, revenueResponse] =
        await Promise.all([
          getPayments({
            school: schoolId,
            page: 1,
            limit: 100,
          }),

          getTotalRevenue(schoolId),
        ]);

      console.log(
        "FINANCE PAYMENTS RESPONSE:",
        paymentsResponse
      );

      console.log(
        "FINANCE REVENUE RESPONSE:",
        revenueResponse
      );

      const paymentList =
        paymentsResponse?.payments ??
        paymentsResponse?.data?.payments ??
        [];

      setPayments(
        Array.isArray(paymentList) ? paymentList : []
      );

      const revenue =
        revenueResponse?.total ??
        revenueResponse?.data?.total ??
        0;

      setTotalRevenue(Number(revenue) || 0);
    } catch (err) {
      console.error("FINANCE LOAD ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load payment records."
      );

      setPayments([]);
      setTotalRevenue(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [schoolId, isParent]);

  const filteredPayments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const student = payment.student || {};

      const studentName =
        `${student.firstName || ""} ${
          student.lastName || ""
        }`.trim();

      const registrationNumber =
        student.registrationNumber || "";

      const reference = payment.reference || "";

      const matchesSearch =
        !searchValue ||
        studentName
          .toLowerCase()
          .includes(searchValue) ||
        registrationNumber
          .toLowerCase()
          .includes(searchValue) ||
        reference.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        String(payment.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesFeeType =
        feeTypeFilter === "all" ||
        String(payment.feeType || "").toLowerCase() ===
          feeTypeFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesFeeType
      );
    });
  }, [
    payments,
    search,
    statusFilter,
    feeTypeFilter,
  ]);

  const paidCount = payments.filter(
    (payment) =>
      String(payment.status || "").toLowerCase() === "paid"
  ).length;

  const pendingCount = payments.filter(
    (payment) =>
      String(payment.status || "").toLowerCase() ===
      "pending"
  ).length;

  const failedCount = payments.filter(
    (payment) =>
      String(payment.status || "").toLowerCase() === "failed"
  ).length;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStudentName = (payment) => {
    const student = payment.student || {};

    const name =
      `${student.firstName || ""} ${
        student.lastName || ""
      }`.trim();

    return name || "Unknown Student";
  };

  const getStatusClass = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "paid") return "status-paid";
    if (normalized === "pending") return "status-pending";
    if (normalized === "failed") return "status-failed";

    return "status-default";
  };

  return (
    <div className="finance-page">
      <div className="finance-header">
        <div>
          <h1>Fees & Finance</h1>

          <p>
            {isParent
              ? "View payment records for your children."
              : "Manage student payments, fees and financial records."}
          </p>
        </div>

        <button
          type="button"
          className="finance-refresh-button"
          onClick={() => loadPayments(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "finance-spin" : ""
            }
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="finance-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="finance-stats">
        <div className="finance-stat-card">
          <div className="finance-stat-icon">
            <WalletCards size={21} />
          </div>

          <div>
            <span>
              {isParent
                ? "Children's Payments"
                : "Total Revenue"}
            </span>

            <strong>
              {formatMoney(totalRevenue)}
            </strong>
          </div>
        </div>

        <div className="finance-stat-card">
          <div className="finance-stat-icon">
            <Receipt size={21} />
          </div>

          <div>
            <span>Total Payments</span>
            <strong>{payments.length}</strong>
          </div>
        </div>

        <div className="finance-stat-card">
          <div className="finance-stat-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Paid</span>
            <strong>{paidCount}</strong>
          </div>
        </div>

        <div className="finance-stat-card">
          <div className="finance-stat-icon">
            <Clock size={21} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="finance-stat-card">
          <div className="finance-stat-icon">
            <XCircle size={21} />
          </div>

          <div>
            <span>Failed</span>
            <strong>{failedCount}</strong>
          </div>
        </div>
      </div>

      <div className="finance-content">
        <div className="finance-toolbar">
          <div className="finance-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search student, registration number or reference..."
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
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={feeTypeFilter}
            onChange={(e) =>
              setFeeTypeFilter(e.target.value)
            }
          >
            <option value="all">All Fee Types</option>
            <option value="school_fees">
              School Fees
            </option>
            <option value="transport">Transport</option>
            <option value="uniform">Uniform</option>
            <option value="exam">Exam</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="finance-table-card">
          <div className="finance-table-header">
            <div>
              <h2>Payment Records</h2>

              <p>
                {filteredPayments.length} payment
                {filteredPayments.length === 1
                  ? ""
                  : "s"} found
              </p>
            </div>

            {!isParent && (
              <button
                type="button"
                className="finance-record-button"
                onClick={() =>
                  navigate("/record-payment")
                }
              >
                <WalletCards size={17} />
                Record Payment
              </button>
            )}
          </div>

          {loading ? (
            <div className="finance-empty">
              <RefreshCw
                size={25}
                className="finance-spin"
              />

              <p>
                Loading payment records...
              </p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="finance-empty">
              <Receipt size={34} />

              <h3>
                No payment records found
              </h3>

              <p>
                {isParent
                  ? "Payments for your linked children will appear here."
                  : "Payments recorded for this school will appear here."}
              </p>
            </div>
          ) : (
            <div className="finance-table-wrapper">
              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Registration No.</th>
                    <th>Fee Type</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map(
                    (payment) => (
                      <tr key={payment._id}>
                        <td>
                          <div className="finance-student">
                            <div className="finance-student-avatar">
                              <Users size={17} />
                            </div>

                            <div>
                              <strong>
                                {getStudentName(
                                  payment
                                )}
                              </strong>
                            </div>
                          </div>
                        </td>

                        <td>
                          {payment.student
                            ?.registrationNumber ||
                            "—"}
                        </td>

                        <td>
                          <span className="fee-type">
                            {String(
                              payment.feeType ||
                                "Other"
                            ).replaceAll("_", " ")}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {formatMoney(
                              payment.amount
                            )}
                          </strong>
                        </td>

                        <td>
                          {payment.paymentMethod ||
                            "—"}
                        </td>

                        <td>
                          <span
                            className={`finance-status ${getStatusClass(
                              payment.status
                            )}`}
                          >
                            {payment.status ||
                              "Unknown"}
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            payment.paymentDate ||
                              payment.createdAt
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="finance-view-button"
                            title="View payment"
                            onClick={() =>
                              navigate(
                                `/finance/invoice/${payment._id}`
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}