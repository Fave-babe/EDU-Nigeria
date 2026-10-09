import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
ArrowLeft,
Building2,
User,
Mail,
Phone,
MapPin,
CheckCircle,
XCircle,
Calendar,
ShieldCheck,
Loader2,
} from "lucide-react";

import {
getSchoolDetails,
approveSchool,
rejectSchool,
} from "../api/school.api";

const ReviewApplication = () => {
const navigate = useNavigate();
const { id } = useParams();

const [school, setSchool] = useState(null);
const [loading, setLoading] = useState(true);
const [actionLoading, setActionLoading] = useState(false);

const [showRejectModal, setShowRejectModal] = useState(false);
const [rejectionReason, setRejectionReason] = useState("");

const loadApplication = async () => {
try {
setLoading(true);

  const response = await getSchoolDetails(id);

  const schoolData =
    response?.school ||
    response?.data?.school ||
    response;

  setSchool(schoolData);
} catch (error) {
  console.error("FAILED TO LOAD APPLICATION:", error);

  alert(
    error?.message ||
      "Failed to load school application."
  );
} finally {
  setLoading(false);
}


};

useEffect(() => {
if (id) {
loadApplication();
}
}, [id]);

const handleApprove = async () => {
const confirmed = window.confirm(
"Are you sure you want to approve this school application?"
);


if (!confirmed) return;

try {
  setActionLoading(true);

  await approveSchool(id);

  alert("School application approved successfully.");

  navigate("/superadmin");
} catch (error) {
  console.error(
    "FAILED TO APPROVE APPLICATION:",
    error
  );

  alert(
    error?.message ||
      "Failed to approve school application."
  );
} finally {
  setActionLoading(false);
}

};

const handleReject = async () => {
if (!rejectionReason.trim()) {
alert(
"Please enter a reason for rejecting this application."
);
return;
}


try {
  setActionLoading(true);

  await rejectSchool(id);

  alert("School application rejected successfully.");

  setShowRejectModal(false);
  setRejectionReason("");

  navigate("/superadmin");
} catch (error) {
  console.error(
    "FAILED TO REJECT APPLICATION:",
    error
  );

  alert(
    error?.message ||
      "Failed to reject school application."
  );
} finally {
  setActionLoading(false);
}


};

if (loading) {
return ( <div className="min-h-screen bg-gray-50 flex items-center justify-center"> <div className="flex items-center gap-3 text-gray-600"> <Loader2 className="w-6 h-6 animate-spin" /> <span>Loading application...</span> </div> </div>
);
}

if (!school) {
return ( <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4"> <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md w-full"> <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

      <h2 className="text-xl font-bold text-gray-900">
        Application Not Found
      </h2>

      <p className="text-gray-500 mt-2">
        The school application could not be found.
      </p>

      <button
        onClick={() => navigate("/superadmin")}
        className="mt-6 px-5 py-3 rounded-xl bg-[#071a41] text-white font-medium hover:opacity-90"
      >
        Back to Applications
      </button>
    </div>
  </div>
);


}

const applicationDate = school.createdAt
? new Date(school.createdAt).toLocaleDateString(
"en-NG",
{
day: "2-digit",
month: "long",
year: "numeric",
}
)
: "Not available";

const status = school.status || "pending";

return ( <div className="min-h-screen bg-gray-50">
{/* Header */} <div className="bg-white border-b border-gray-200"> <div className="max-w-7xl mx-auto px-6 py-5">
<button
onClick={() => navigate("/superadmin")}
className="flex items-center gap-2 text-gray-600 hover:text-[#071a41] mb-4"
> <ArrowLeft className="w-5 h-5" />
Back to Applications </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#071a41]">
              Review Application
            </h1>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status}
            </span>
          </div>

          <p className="text-gray-500 mt-1">
            Review the school information before making
            a decision.
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-6 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Information */}
      <div className="lg:col-span-2 space-y-6">
        {/* School Information */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  School Information
                </h2>

                <p className="text-sm text-gray-500">
                  Basic information about the school
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              label="School Name"
              value={school.name}
              icon={<Building2 className="w-4 h-4" />}
            />

            <InfoItem
              label="School Type"
              value={school.schoolType}
              icon={<Building2 className="w-4 h-4" />}
            />

            <InfoItem
              label="School Email"
              value={school.email}
              icon={<Mail className="w-4 h-4" />}
            />

            <InfoItem
              label="Phone Number"
              value={school.phone}
              icon={<Phone className="w-4 h-4" />}
            />

            <InfoItem
              label="Address"
              value={school.address}
              icon={<MapPin className="w-4 h-4" />}
            />

            <InfoItem
              label="City"
              value={school.city}
              icon={<MapPin className="w-4 h-4" />}
            />

            <InfoItem
              label="State"
              value={school.state}
              icon={<MapPin className="w-4 h-4" />}
            />

            <InfoItem
              label="Country"
              value={school.country || "Nigeria"}
              icon={<MapPin className="w-4 h-4" />}
            />
          </div>
        </section>

        {/* Administrator Information */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Proprietor / Administrator
                </h2>

                <p className="text-sm text-gray-500">
                  Account information submitted with the
                  application
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              label="Full Name"
              value={
                school.admin?.fullName ||
                school.proprietor?.fullName ||
                school.adminFullName ||
                "Not available"
              }
              icon={<User className="w-4 h-4" />}
            />

            <InfoItem
              label="Email Address"
              value={
                school.admin?.email ||
                school.proprietor?.email ||
                school.adminEmail ||
                "Not available"
              }
              icon={<Mail className="w-4 h-4" />}
            />

            <InfoItem
              label="Account Role"
              value="Administrator"
              icon={<ShieldCheck className="w-4 h-4" />}
            />

            <InfoItem
              label="Account Status"
              value={
                school.isActive
                  ? "Active"
                  : "Inactive"
              }
              icon={<ShieldCheck className="w-4 h-4" />}
            />
          </div>
        </section>
      </div>

      {/* Right Side */}
      <div className="space-y-6">
        {/* Application Summary */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">
            Application Summary
          </h2>

          <div className="space-y-5">
            <InfoItem
              label="Application Status"
              value={status}
              icon={
                <ShieldCheck className="w-4 h-4" />
              }
            />

            <InfoItem
              label="Date Submitted"
              value={applicationDate}
              icon={
                <Calendar className="w-4 h-4" />
              }
            />

            <InfoItem
              label="Application ID"
              value={school._id || id}
              icon={
                <Building2 className="w-4 h-4" />
              }
            />
          </div>
        </section>

        {/* Actions */}
        {status === "pending" && (
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Application Decision
            </h2>

            <p className="text-sm text-gray-500 mt-2 mb-6">
              Review all submitted information before
              approving or rejecting this school.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#079b68] text-white font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}

                Approve Application
              </button>

              <button
                onClick={() =>
                  setShowRejectModal(true)
                }
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50"
              >
                <XCircle className="w-5 h-5" />
                Reject Application
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  </main>

  {/* Reject Modal */}
  {showRejectModal && (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Reject Application
            </h2>

            <p className="text-sm text-gray-500">
              Please provide a reason.
            </p>
          </div>
        </div>

        <textarea
          value={rejectionReason}
          onChange={(e) =>
            setRejectionReason(e.target.value)
          }
          placeholder="Enter reason for rejecting this application..."
          rows={5}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#071a41]/20 focus:border-[#071a41] resize-none"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => {
              setShowRejectModal(false);
              setRejectionReason("");
            }}
            disabled={actionLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleReject}
            disabled={actionLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {actionLoading
              ? "Rejecting..."
              : "Reject Application"}
          </button>
        </div>
      </div>
    </div>
  )}
</div>


);
};

const InfoItem = ({ label, value, icon }) => {
return ( <div> <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
{icon} <span>{label}</span> </div>


  <p className="text-sm font-semibold text-gray-900 break-words">
    {value || "Not provided"}
  </p>
</div>


);
};

export default ReviewApplication;
