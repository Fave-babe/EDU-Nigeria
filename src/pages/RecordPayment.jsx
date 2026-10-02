import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createPayment } from "../api/payment.api";
import { getStudentsBySchool } from "../api/student.api";
import "./RecordPayment.css";

export default function RecordPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const schoolId =
    typeof user?.school === "object"
      ? user?.school?._id
      : user?.school;

  const bursarId = user?._id;

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const [formData, setFormData] = useState({
    student: "",
    amount: "",
    feeType: "School Fees",
    paymentMethod: "Cash",
    reference: "",
    status: "Paid",
    description: "",
    paymentDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load students from the bursar's school
  useEffect(() => {
    const loadStudents = async () => {
      if (!schoolId) {
        setStudentsLoading(false);
        return;
      }

      try {
        setStudentsLoading(true);
        setError("");

        const response = await getStudentsBySchool(schoolId);

        console.log("STUDENTS RESPONSE:", response);

        const studentList =
          response?.students ||
          response?.data?.students ||
          response?.data ||
          [];

        setStudents(Array.isArray(studentList) ? studentList : []);
      } catch (err) {
        console.error("LOAD STUDENTS ERROR:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load students."
        );
      } finally {
        setStudentsLoading(false);
      }
    };

    loadStudents();
  }, [schoolId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStudentName = (student) => {
    if (!student) return "Unknown Student";

    const fullName = [
      student.firstName,
      student.middleName,
      student.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      fullName ||
      student.name ||
      student.fullName ||
      "Unknown Student"
    );
  };

  const getStudentId = (student) => {
    return student?._id || student?.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!schoolId) {
      setError("Your school information could not be found.");
      return;
    }

    if (!bursarId) {
      setError("Your bursar information could not be found.");
      return;
    }

    if (!formData.student) {
      setError("Please select a student.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    try {
      setLoading(true);

      const paymentData = {
        school: schoolId,

        // This is still the student's MongoDB ID.
        // The user selects the student by name in the UI.
        student: formData.student,

        bursar: bursarId,
        amount: Number(formData.amount),
        feeType: formData.feeType,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        description: formData.description.trim(),
      };

      if (formData.reference.trim()) {
        paymentData.reference = formData.reference.trim();
      }

      if (formData.paymentDate) {
        paymentData.paymentDate = new Date(
          formData.paymentDate
        ).toISOString();
      }

      console.log("PAYMENT DATA:", paymentData);

     const response = await createPayment(paymentData);

console.log("CREATED PAYMENT:", response);

const createdPayment =
  response?.payment ||
  response?.data?.payment ||
  response;

setSuccess("Payment recorded successfully.");

if (createdPayment?._id) {
  navigate(`/finance/invoice/${createdPayment._id}`);
}
      setFormData({
        student: "",
        amount: "",
        feeType: "School Fees",
        paymentMethod: "Cash",
        reference: "",
        status: "Paid",
        description: "",
        paymentDate: "",
      });
    } catch (err) {
      console.error("RECORD PAYMENT ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to record payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="record-payment-page">
      <div className="record-payment-header">
        <div>
          <button
            type="button"
            className="record-payment-back"
            onClick={() => navigate("/Bdashboard")}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="record-payment-title">
            <div className="record-payment-title-icon">
              <CreditCard size={24} />
            </div>

            <div>
              <h1>Record Payment</h1>

              <p>
                Record a student payment for{" "}
                {typeof user?.school === "object"
                  ? user?.school?.name
                  : "your school"}
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="record-payment-main">
        {error && (
          <div className="record-payment-alert record-payment-alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="record-payment-alert record-payment-alert-success">
            <CheckCircle2 size={20} />
            <span>{success}</span>
          </div>
        )}

        <form
          className="record-payment-card"
          onSubmit={handleSubmit}
        >
          <div className="record-payment-section">
            <div className="record-payment-section-header">
              <h2>Payment Information</h2>
              <p>
                Enter the details of the payment received.
              </p>
            </div>

            <div className="record-payment-grid">
              {/* STUDENT */}
              <div className="record-payment-field record-payment-full">
                <label htmlFor="student">
                  Student <span>*</span>
                </label>

                <select
                  id="student"
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  required
                  disabled={studentsLoading}
                >
                  <option value="">
                    {studentsLoading
                      ? "Loading students..."
                      : "Select student"}
                  </option>

                  {students.map((student) => {
                    const studentId = getStudentId(student);

                    return (
                      <option
                        key={studentId}
                        value={studentId}
                      >
                        {getStudentName(student)}
                        {student.registrationNumber
                          ? ` — ${student.registrationNumber}`
                          : ""}
                      </option>
                    );
                  })}
                </select>

                <small>
                  Select the student who made the payment.
                </small>
              </div>

              {/* AMOUNT */}
              <div className="record-payment-field">
                <label htmlFor="amount">
                  Amount <span>*</span>
                </label>

                <div className="record-payment-input-prefix">
                  <span>₦</span>

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* FEE TYPE */}
              <div className="record-payment-field">
                <label htmlFor="feeType">
                  Fee Type
                </label>

                <select
                  id="feeType"
                  name="feeType"
                  value={formData.feeType}
                  onChange={handleChange}
                >
                  <option value="School Fees">
                    School Fees
                  </option>

                  <option value="Transport Fee">
                    Transport Fee
                  </option>

                  <option value="Uniform Fee">
                    Uniform Fee
                  </option>

                  <option value="Examination Fee">
                    Examination Fee
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* PAYMENT METHOD */}
              <div className="record-payment-field">
                <label htmlFor="paymentMethod">
                  Payment Method
                </label>

                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="Cash">
                    Cash
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="POS">
                    POS
                  </option>

                  <option value="Online">
                    Online
                  </option>
                </select>
              </div>

              {/* STATUS */}
              <div className="record-payment-field">
                <label htmlFor="status">
                  Payment Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Failed">
                    Failed
                  </option>

                  <option value="Refunded">
                    Refunded
                  </option>
                </select>
              </div>

              {/* REFERENCE */}
              <div className="record-payment-field">
                <label htmlFor="reference">
                  Payment Reference
                </label>

                <input
                  id="reference"
                  name="reference"
                  type="text"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="e.g. TRX-123456"
                />
              </div>

              {/* PAYMENT DATE */}
              <div className="record-payment-field">
                <label htmlFor="paymentDate">
                  Payment Date
                </label>

                <input
                  id="paymentDate"
                  name="paymentDate"
                  type="datetime-local"
                  value={formData.paymentDate}
                  onChange={handleChange}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="record-payment-field record-payment-full">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add any additional payment information..."
                  rows="4"
                />
              </div>
            </div>
          </div>

          <div className="record-payment-footer">
            <button
              type="button"
              className="record-payment-cancel"
              onClick={() => navigate("/Bdashboard")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="record-payment-submit"
              disabled={loading || studentsLoading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="record-payment-spinner"
                  />
                  Recording...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Record Payment
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}