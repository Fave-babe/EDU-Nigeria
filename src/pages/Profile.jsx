import React from "react";
import "./Pages.css";
import { UserRound, ArrowLeft  } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const navigate = useNavigate();
  const { user } = useAuth();

  const fullName =
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "User";

  return (
    <div className="page-container">
        <button
  className="back-button"
  onClick={() => navigate(-1)}
>
  <ArrowLeft size={18} />
  Back
</button>
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>View your account information.</p>
        </div>

        <div className="page-header-icon">
          <UserRound size={28} />
        </div>
      </div>

      <div className="content-card">
        <div className="profile-details">
          <div className="profile-avatar-large">
            {fullName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{fullName}</h2>

            <p>
              <strong>Email:</strong>{" "}
              {user?.email || "Not available"}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {user?.role || "Student"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}