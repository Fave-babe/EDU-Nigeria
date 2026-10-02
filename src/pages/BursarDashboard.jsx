import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Wallet,
  CreditCard,
  Receipt,
  AlertCircle,
  FileText,
  Printer,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  Users,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  RefreshCw,
  Building2,
} from "lucide-react";

import { useAuth } from "../context/authcontext";

import {
  getPayments,
  getTotalRevenue,
  getTodayRevenue,
} from "../api/payment.api";

import "./BursarDashboard.css";

export default function BursarDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayPaymentCount, setTodayPaymentCount] = useState(0);
  const [payments, setPayments] = useState([]);

  // ==================================================
  // SCHOOL INFORMATION
  // ==================================================

  const schoolId =
    typeof user?.school === "object" ? user?.school?._id : user?.school;

  const schoolName =
    typeof user?.school === "object" ? user?.school?.name : "School";

  // ==================================================
  // LOAD DASHBOARD DATA
  // ==================================================

  const loadDashboard = async () => {
    if (!schoolId) {
      setError("Your account is not connected to a school.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError("");

      const [revenueResponse, todayRevenueResponse, paymentsResponse] =
        await Promise.all([
          getTotalRevenue(schoolId),

          getTodayRevenue(schoolId),

          getPayments({
            school: schoolId,
            page: 1,
            limit: 5,
          }),
        ]);

      console.log("BURSAR REVENUE RESPONSE:", revenueResponse);

      console.log("BURSAR TODAY REVENUE RESPONSE:", todayRevenueResponse);

      console.log("BURSAR PAYMENTS RESPONSE:", paymentsResponse);

      // ==================================================
      // TOTAL REVENUE
      // ==================================================

      const total = revenueResponse?.total ?? revenueResponse?.data?.total ?? 0;

      setTotalRevenue(Number(total) || 0);

      // ==================================================
      // TODAY'S REVENUE
      // ==================================================

      const todayTotal =
        todayRevenueResponse?.total ?? todayRevenueResponse?.data?.total ?? 0;

      const todayCount =
        todayRevenueResponse?.count ?? todayRevenueResponse?.data?.count ?? 0;

      setTodayRevenue(Number(todayTotal) || 0);

      setTodayPaymentCount(Number(todayCount) || 0);

      // ==================================================
      // RECENT PAYMENTS
      // ==================================================

      const paymentList =
        paymentsResponse?.payments ?? paymentsResponse?.data?.payments ?? [];

      setPayments(Array.isArray(paymentList) ? paymentList : []);
    } catch (err) {
      console.error("BURSAR DASHBOARD ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load financial information.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadDashboard();
  }, [schoolId]);

  // ==================================================
  // REFRESH
  // ==================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
  };

  // ==================================================
  // FORMAT CURRENCY
  // ==================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==================================================
  // RECENT PAYMENT COUNTS
  // ==================================================

  const paidPayments = payments.filter(
    (payment) => String(payment.status || "").toLowerCase() === "paid",
  ).length;

  const pendingPayments = payments.filter(
    (payment) => String(payment.status || "").toLowerCase() === "pending",
  ).length;

  const failedPayments = payments.filter(
    (payment) => String(payment.status || "").toLowerCase() === "failed",
  ).length;

  // ==================================================
  // LOADING STATE
  // ==================================================

  if (loading) {
    return (
      <div className="bursar-loading">
        <RefreshCw size={30} className="bursar-refresh-spin" />

        <p>Loading financial dashboard...</p>
      </div>
    );
  }

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <div className="bursar-dashboard">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="bursar-header">
        <div className="bursar-header-left">
          <h1 className="bursar-title">Bursar Dashboard</h1>

          <div className="bursar-school">
            <Building2 size={17} />
            <span>{schoolName}</span>
          </div>
        </div>

        <div className="bursar-header-actions">
          <button
            type="button"
            className="bursar-refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={refreshing ? "bursar-refresh-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            className="bursar-report-button"
            onClick={() => navigate("/reports")}
          >
            <BarChart3 size={17} />
            Financial Report
          </button>
        </div>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="bursar-error">
          <AlertCircle size={20} />

          <div>
            <strong>Unable to load some information</strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div className="bursar-stats-grid">
        {/* TOTAL REVENUE */}

        <div className="bursar-stat-card">
          <div className="bursar-stat-icon">
            <Wallet size={22} />
          </div>

          <div className="bursar-stat-content">
            <span className="bursar-stat-label">Total Revenue</span>

            <h2 className="bursar-stat-value">
              {formatCurrency(totalRevenue)}
            </h2>

            <span className="bursar-stat-description">
              All recorded paid transactions
            </span>
          </div>
        </div>

        {/* TODAY'S PAYMENTS */}

        <div className="bursar-stat-card">
          <div className="bursar-stat-icon">
            <CreditCard size={22} />
          </div>

          <div className="bursar-stat-content">
            <span className="bursar-stat-label">Payments Today</span>

            <h2 className="bursar-stat-value">
              {formatCurrency(todayRevenue)}
            </h2>

            <span className="bursar-stat-description">
              {todayPaymentCount} payment
              {todayPaymentCount === 1 ? "" : "s"} today
            </span>
          </div>
        </div>

        {/* RECENT PAYMENTS */}

        <div className="bursar-stat-card">
          <div className="bursar-stat-icon">
            <Receipt size={22} />
          </div>

          <div className="bursar-stat-content">
            <span className="bursar-stat-label">Recent Payments</span>

            <h2 className="bursar-stat-value">{payments.length}</h2>

            <span className="bursar-stat-description">Latest transactions</span>
          </div>
        </div>

        {/* OUTSTANDING FEES */}

        <div className="bursar-stat-card">
          <div className="bursar-stat-icon">
            <AlertCircle size={22} />
          </div>

          <div className="bursar-stat-content">
            <span className="bursar-stat-label">Outstanding Fees</span>

            <h2 className="bursar-stat-value">—</h2>

            <span className="bursar-stat-description">
              Fee tracking will appear here
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          FINANCE OVERVIEW
      ================================================== */}

      <div className="bursar-section">
        <div className="bursar-section-header">
          <div>
            <h2>Finance Overview</h2>

            <p>Overview of the school's recorded financial activity.</p>
          </div>
        </div>

        <div className="bursar-overview-grid">
          {/* FEE COLLECTION */}

          <div className="bursar-card">
            <div className="bursar-card-header">
              <div>
                <h3>Fee Collection</h3>

                <p>Recorded payment activity</p>
              </div>

              <Wallet size={21} />
            </div>

            <div className="bursar-collection-value">
              {formatCurrency(totalRevenue)}
            </div>

            <div className="bursar-collection-row">
              <span>Total collected</span>

              <strong>{formatCurrency(totalRevenue)}</strong>
            </div>

            <div className="bursar-collection-row">
              <span>Collected today</span>

              <strong>{formatCurrency(todayRevenue)}</strong>
            </div>
          </div>

          {/* PAYMENT SUMMARY */}

          <div className="bursar-card">
            <div className="bursar-card-header">
              <div>
                <h3>Recent Payment Status</h3>

                <p>Status of the latest transactions</p>
              </div>

              <BarChart3 size={21} />
            </div>

            <div className="bursar-summary-list">
              <div className="bursar-summary-item">
                <span>
                  <CheckCircle2 size={17} />
                  Paid
                </span>

                <strong>{paidPayments}</strong>
              </div>

              <div className="bursar-summary-item">
                <span>
                  <Clock size={17} />
                  Pending
                </span>

                <strong>{pendingPayments}</strong>
              </div>

              <div className="bursar-summary-item">
                <span>
                  <AlertCircle size={17} />
                  Failed
                </span>

                <strong>{failedPayments}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          RECENT TRANSACTIONS
      ================================================== */}

      <div className="bursar-section">
        <div className="bursar-section-header">
          <div>
            <h2>Recent Transactions</h2>

            <p>Latest payment transactions recorded in the school.</p>
          </div>

          <button
            type="button"
            className="bursar-view-all"
            onClick={() => navigate("/finance")}
          >
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="bursar-card">
          {payments.length === 0 ? (
            <div className="bursar-empty-state">
              <Receipt size={35} />

              <h3>No payments recorded yet</h3>

              <p>Recorded payments will appear here.</p>
            </div>
          ) : (
            <div className="bursar-transactions">
              {payments.map((payment) => {
                const student = payment.student || {};

                const studentName =
                  `${student.firstName || ""} ${
                    student.lastName || ""
                  }`.trim() || "Unknown Student";

                const paymentStatus = payment.status || "Pending";

                return (
                  <div className="bursar-transaction" key={payment._id}>
                    <div className="bursar-transaction-icon">
                      <DollarSign size={18} />
                    </div>

                    <div className="bursar-transaction-info">
                      <strong>{studentName}</strong>

                      <span>{payment.feeType || "Payment"}</span>

                      <small>{formatDate(payment.paymentDate)}</small>
                    </div>

                    <div className="bursar-transaction-amount">
                      <strong>{formatCurrency(payment.amount)}</strong>

                      <span
                        className={`bursar-payment-status bursar-status-${String(
                          paymentStatus,
                        ).toLowerCase()}`}
                      >
                        {paymentStatus}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="bursar-more-button"
                      onClick={() =>
                        navigate(`/finance/invoice/${payment._id}`)
                      }
                      title="View payment"
                    >
                      <MoreHorizontal size={19} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ==================================================
          OUTSTANDING FEES
      ================================================== */}

      <div className="bursar-section">
        <div className="bursar-section-header">
          <div>
            <h2>Outstanding Fees</h2>

            <p>Track students with unpaid school fees.</p>
          </div>

          <button
            type="button"
            className="bursar-view-all"
            onClick={() => navigate("/finance")}
          >
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="bursar-card bursar-outstanding-card">
          <Users size={32} />

          <div>
            <h3>Outstanding fee tracking</h3>

            <p>
              Student fee balances will appear here once fee records are
              connected.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <div className="bursar-section bursar-quick-actions">
        <div className="bursar-section-header">
          <div>
            <h2>Quick Actions</h2>

            <p>Quickly access common bursar operations.</p>
          </div>
        </div>

        <div className="bursar-actions-grid">
          {/* RECORD PAYMENT */}

          <button
            type="button"
            className="bursar-action"
            onClick={() => navigate("/record-payment")}
          >
            <div className="bursar-action-icon">
              <DollarSign size={21} />
            </div>

            <h3 className="bursar-action-title">Record Payment</h3>

            <p className="bursar-action-description">
              Record a student payment
            </p>
          </button>

          {/* FINANCE */}

          <button
            type="button"
            className="bursar-action"
            onClick={() => navigate("/finance")}
          >
            <div className="bursar-action-icon">
              <FileText size={21} />
            </div>

            <h3 className="bursar-action-title">Fees & Finance</h3>

            <p className="bursar-action-description">
              View payment and fee records
            </p>
          </button>

          {/* RECEIPTS */}

          <button
            type="button"
            className="bursar-action"
            onClick={() => navigate("/finance")}
          >
            <div className="bursar-action-icon">
              <Printer size={21} />
            </div>

            <h3 className="bursar-action-title">Payment Records</h3>

            <p className="bursar-action-description">View recorded payments</p>
          </button>

          {/* REPORTS */}

          <button
            type="button"
            className="bursar-action"
            onClick={() => navigate("/reports")}
          >
            <div className="bursar-action-icon">
              <BarChart3 size={21} />
            </div>

            <h3 className="bursar-action-title">Financial Report</h3>

            <p className="bursar-action-description">View financial reports</p>
          </button>
        </div>
      </div>
    </div>
  );
}
