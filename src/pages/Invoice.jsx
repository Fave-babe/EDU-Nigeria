import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { getPayment } from "../api/payment.api";
import "./Invoice.css";

export default function Invoice() {
  const navigate = useNavigate();
  const { paymentId } = useParams();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPayment(paymentId);

        console.log("INVOICE PAYMENT:", response);

        const paymentData =
          response?.payment ||
          response?.data?.payment ||
          response;

        setPayment(paymentData);
      } catch (err) {
        console.error("LOAD INVOICE ERROR:", err);

        setError(
          err?.message ||
            err?.response?.data?.message ||
            "Failed to load payment information."
        );
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      loadPayment();
    }
  }, [paymentId]);

  const getStudentName = () => {
    if (!payment?.student) return "-";

    return [
      payment.student.firstName,
      payment.student.middleName,
      payment.student.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="invoice-state">
        <Loader2 className="invoice-spinner" size={32} />
        <p>Loading invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-state invoice-error">
        <AlertCircle size={32} />
        <p>{error}</p>

        <button
          type="button"
          onClick={() => navigate("/Bdashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="invoice-state">
        <AlertCircle size={32} />
        <p>Payment information could not be found.</p>
      </div>
    );
  }

  const school = payment.school || {};
  const student = payment.student || {};
  const bursar = payment.bursar || {};

  return (
    <div className="invoice-page">
      <div className="invoice-toolbar no-print">
        <button
          type="button"
          className="invoice-back"
          onClick={() => navigate("/Bdashboard")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          type="button"
          className="invoice-print"
          onClick={handlePrint}
        >
          <Printer size={18} />
          Print Invoice
        </button>
      </div>

      <main className="invoice-container">
        <div className="invoice-card">
          <header className="invoice-header">
            <div>
              <h1>{school.name || "School"}</h1>

              {school.schoolType && (
                <p>{school.schoolType}</p>
              )}

              {school.address && (
                <p>{school.address}</p>
              )}

              <p>
                {school.city && `${school.city}, `}
                {school.state && school.state}
              </p>
            </div>

            <div className="invoice-title">
              <h2>INVOICE</h2>
              <p>
                Invoice No:{" "}
                <strong>
                  INV-{payment._id?.slice(-8).toUpperCase()}
                </strong>
              </p>
              <p>
                Date:{" "}
                <strong>
                  {formatDate(payment.paymentDate)}
                </strong>
              </p>
            </div>
          </header>

          <div className="invoice-divider" />

          <section className="invoice-info-grid">
            <div>
              <span className="invoice-label">
                STUDENT
              </span>

              <strong>{getStudentName()}</strong>

              {student.registrationNumber && (
                <p>
                  Reg. No:{" "}
                  {student.registrationNumber}
                </p>
              )}
            </div>

            <div>
              <span className="invoice-label">
                PAYMENT STATUS
              </span>

              <span
                className={`invoice-status invoice-status-${String(
                  payment.status || ""
                ).toLowerCase()}`}
              >
                <CheckCircle2 size={15} />
                {payment.status}
              </span>
            </div>
          </section>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Fee Type</th>
                <th className="amount-column">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  {payment.description ||
                    "School payment"}
                </td>

                <td>{payment.feeType}</td>

                <td className="amount-column">
                  ₦{formatAmount(payment.amount)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="invoice-total">
            <span>Total Paid</span>

            <strong>
              ₦{formatAmount(payment.amount)}
            </strong>
          </div>

          <section className="invoice-payment-details">
            <h3>Payment Details</h3>

            <div className="invoice-detail-grid">
              <div>
                <span>Payment Method</span>
                <strong>
                  {payment.paymentMethod || "-"}
                </strong>
              </div>

              <div>
                <span>Reference</span>
                <strong>
                  {payment.reference || "-"}
                </strong>
              </div>

              <div>
                <span>Payment Date</span>
                <strong>
                  {formatDate(payment.paymentDate)}
                </strong>
              </div>

              <div>
                <span>Received By</span>
                <strong>
                  {bursar.fullName ||
                    bursar.name ||
                    bursar.email ||
                    "-"}
                </strong>
              </div>
            </div>
          </section>

          <footer className="invoice-footer">
            <p>
              Thank you for your payment.
            </p>

            <p>
              This invoice serves as proof of payment.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}