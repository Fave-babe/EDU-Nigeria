import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  ArrowLeft,
  RefreshCw,
  Wallet,
  CreditCard,
  Receipt,
  Users,
  CalendarDays,
  Printer,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import {
  getPayments,
  getTotalRevenue,
  getTodayRevenue,
} from "../api/payment.api";

import "./Pages.css";

export default function Reports() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayPaymentCount, setTodayPaymentCount] = useState(0);
  const [payments, setPayments] = useState([]);

  // --------------------------------------------------
  // SCHOOL INFORMATION
  // --------------------------------------------------

  const schoolId =
    typeof user?.school === "object"
      ? user?.school?._id
      : user?.school;

  const schoolName =
    typeof user?.school === "object"
      ? user?.school?.name
      : "School";

  // --------------------------------------------------
  // LOAD FINANCIAL REPORT
  // --------------------------------------------------

  const loadReports = async () => {
    if (!schoolId) {
      setError("Your account is not connected to a school.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const [
        revenueResponse,
        todayRevenueResponse,
        paymentsResponse,
      ] = await Promise.all([
        getTotalRevenue(schoolId),

        getTodayRevenue(schoolId),

        getPayments({
          school: schoolId,
          page: 1,
          limit: 100,
        }),
      ]);

      console.log(
        "FINANCIAL REPORT REVENUE:",
        revenueResponse
      );

      console.log(
        "FINANCIAL REPORT TODAY:",
        todayRevenueResponse
      );

      console.log(
        "FINANCIAL REPORT PAYMENTS:",
        paymentsResponse
      );

      // --------------------------------------------------
      // TOTAL REVENUE
      // --------------------------------------------------

      const total =
        revenueResponse?.total ??
        revenueResponse?.data?.total ??
        0;

      setTotalRevenue(Number(total) || 0);

      // --------------------------------------------------
      // TODAY'S REVENUE
      // --------------------------------------------------

      const todayTotal =
        todayRevenueResponse?.total ??
        todayRevenueResponse?.data?.total ??
        0;

      const todayCount =
        todayRevenueResponse?.count ??
        todayRevenueResponse?.data?.count ??
        0;

      setTodayRevenue(Number(todayTotal) || 0);

      setTodayPaymentCount(
        Number(todayCount) || 0
      );

      // --------------------------------------------------
      // PAYMENTS
      // --------------------------------------------------

      const paymentList =
        paymentsResponse?.payments ??
        paymentsResponse?.data?.payments ??
        [];

      setPayments(
        Array.isArray(paymentList)
          ? paymentList
          : []
      );
    } catch (err) {
      console.error(
        "FINANCIAL REPORT ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load financial report."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    loadReports();
  }, [schoolId]);

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReports();
  };

  // --------------------------------------------------
  // CURRENCY
  // --------------------------------------------------

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  // --------------------------------------------------
  // DATE
  // --------------------------------------------------

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

  // --------------------------------------------------
  // PAYMENT STATISTICS
  // --------------------------------------------------

  const paidPayments = payments.filter(
    (payment) => payment.status === "Paid"
  ).length;

  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending"
  ).length;

  const failedPayments = payments.filter(
    (payment) => payment.status === "Failed"
  ).length;

  // --------------------------------------------------
  // TOTAL PAYMENT AMOUNT FROM LOADED PAYMENTS
  // --------------------------------------------------

  const loadedPaymentAmount = payments.reduce(
    (total, payment) => {
      if (payment.status !== "Paid") {
        return total;
      }

      return (
        total +
        (Number(payment.amount) || 0)
      );
    },
    0
  );

  // --------------------------------------------------
  // PAYMENT METHODS
  // --------------------------------------------------

  const paymentMethodCounts = payments.reduce(
    (result, payment) => {
      const method =
        payment.paymentMethod || "Unknown";

      result[method] =
        (result[method] || 0) + 1;

      return result;
    },
    {}
  );

  // --------------------------------------------------
  // FEE TYPES
  // --------------------------------------------------

  const feeTypeTotals = payments.reduce(
    (result, payment) => {
      const feeType =
        payment.feeType || "Other";

      if (!result[feeType]) {
        result[feeType] = 0;
      }

      if (payment.status === "Paid") {
        result[feeType] +=
          Number(payment.amount) || 0;
      }

      return result;
    },
    {}
  );

  const feeTypeEntries = Object.entries(
    feeTypeTotals
  );

  const paymentMethodEntries = Object.entries(
    paymentMethodCounts
  );

  // --------------------------------------------------
  // PRINT
  // --------------------------------------------------

  const handlePrint = () => {
    window.print();
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="page-container">
      {/* HEADER */}

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="page-header">
        <div>
          <h1>Financial Report</h1>

          <p>
            Financial activity and payment
            records for {schoolName}.
          </p>
        </div>

        <div className="page-header-icon">
          <BarChart3 size={28} />
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="content-card">
          <p>{error}</p>
        </div>
      )}

      {/* ACTIONS */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          className="back-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "bursar-refresh-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

        <button
          className="back-button"
          onClick={handlePrint}
        >
          <Printer size={17} />
          Print Report
        </button>
      </div>

      {/* FINANCIAL SUMMARY */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* TOTAL REVENUE */}

        <div
          className="content-card"
          style={{ margin: 0 }}
        >
          <Wallet size={28} />

          <p
            style={{
              marginTop: "12px",
              marginBottom: "6px",
            }}
          >
            Total Revenue
          </p>

          <h2>
            {loading
              ? "..."
              : formatCurrency(totalRevenue)}
          </h2>
        </div>

        {/* TODAY */}

        <div
          className="content-card"
          style={{ margin: 0 }}
        >
          <CalendarDays size={28} />

          <p
            style={{
              marginTop: "12px",
              marginBottom: "6px",
            }}
          >
            Today's Revenue
          </p>

          <h2>
            {loading
              ? "..."
              : formatCurrency(todayRevenue)}
          </h2>

          <small>
            {todayPaymentCount} payment
            {todayPaymentCount === 1
              ? ""
              : "s"} today
          </small>
        </div>

        {/* RECENT PAYMENTS */}

        <div
          className="content-card"
          style={{ margin: 0 }}
        >
          <Receipt size={28} />

          <p
            style={{
              marginTop: "12px",
              marginBottom: "6px",
            }}
          >
            Recorded Payments
          </p>

          <h2>
            {loading
              ? "..."
              : payments.length}
          </h2>

          <small>
            Payments loaded for this report
          </small>
        </div>

        {/* STUDENTS */}

        <div
          className="content-card"
          style={{ margin: 0 }}
        >
          <Users size={28} />

          <p
            style={{
              marginTop: "12px",
              marginBottom: "6px",
            }}
          >
            Students With Payments
          </p>

          <h2>
            {loading
              ? "..."
              : new Set(
                  payments
                    .map(
                      (payment) =>
                        payment.student?._id ||
                        payment.student
                    )
                    .filter(Boolean)
                ).size}
          </h2>
        </div>
      </div>

      {/* PAYMENT SUMMARY */}

      <div className="content-card">
        <div style={{ marginBottom: "24px" }}>
          <h2>Payment Summary</h2>

          <p>
            Summary of payment transactions
            recorded in the system.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <p>Paid</p>
            <h2>{paidPayments}</h2>
          </div>

          <div>
            <p>Pending</p>
            <h2>{pendingPayments}</h2>
          </div>

          <div>
            <p>Failed</p>
            <h2>{failedPayments}</h2>
          </div>

          <div>
            <p>Loaded Paid Amount</p>
            <h2>
              {formatCurrency(
                loadedPaymentAmount
              )}
            </h2>
          </div>
        </div>
      </div>

      {/* FEE TYPE REPORT */}

      <div
        className="content-card"
        style={{ marginTop: "24px" }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2>Revenue by Fee Type</h2>

          <p>
            Paid revenue grouped by fee type.
          </p>
        </div>

        {feeTypeEntries.length === 0 ? (
          <p>No fee type data available.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            {feeTypeEntries.map(
              ([feeType, amount]) => (
                <div
                  key={feeType}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    padding: "14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                >
                  <strong>
                    {feeType}
                  </strong>

                  <span>
                    {formatCurrency(amount)}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* PAYMENT METHODS */}

      <div
        className="content-card"
        style={{ marginTop: "24px" }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2>Payment Methods</h2>

          <p>
            Number of payments by payment
            method.
          </p>
        </div>

        {paymentMethodEntries.length === 0 ? (
          <p>
            No payment method data available.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "15px",
            }}
          >
            {paymentMethodEntries.map(
              ([method, count]) => (
                <div
                  key={method}
                  style={{
                    padding: "16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                >
                  <CreditCard size={20} />

                  <p
                    style={{
                      marginTop: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    {method}
                  </p>

                  <h3>{count}</h3>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* RECENT TRANSACTIONS */}

      <div
        className="content-card"
        style={{ marginTop: "24px" }}
      >
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Recent Transactions</h2>

            <p>
              Latest payment transactions
              recorded by the school.
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <p>
            No payment transactions recorded
            yet.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "10px",
            }}
          >
            {payments.map((payment) => {
              const student =
                payment.student || {};

              const studentName =
                `${student.firstName || ""} ${
                  student.lastName || ""
                }`.trim() ||
                "Unknown Student";

              return (
                <div
                  key={payment._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "2fr 1fr 1fr 1fr",
                    gap: "12px",
                    alignItems: "center",
                    padding: "14px",
                    borderBottom:
                      "1px solid #e5e7eb",
                  }}
                >
                  <div>
                    <strong>
                      {studentName}
                    </strong>

                    <div>
                      <small>
                        {payment.feeType ||
                          "Payment"}
                      </small>
                    </div>
                  </div>

                  <div>
                    {formatCurrency(
                      payment.amount
                    )}
                  </div>

                  <div>
                    {payment.paymentMethod ||
                      "—"}
                  </div>

                  <div>
                    {formatDate(
                      payment.paymentDate
                    )}
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