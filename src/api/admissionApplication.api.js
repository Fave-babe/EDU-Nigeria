import http from "./http";

// Applicant submits admission application
export const createAdmissionApplication = async (data) => {
  return http.post("/admission-applications", data);
};

// Applicant submits entrance exam result
export const submitEntranceExam = async (applicationId, data) => {
  return http.post(
    `/admission-applications/${applicationId}/exam`,
    data
  );
};

// Admin gets all admission applications
export const getAdmissionApplications = async (params = {}) => {
  return http.get("/admission-applications", {
    params,
  });
};

// Admin gets one admission application
export const getAdmissionApplication = async (applicationId) => {
  return http.get(`/admission-applications/${applicationId}`);
};

// Admin gets applications for a school
export const getSchoolAdmissionApplications = async (schoolId) => {
  return http.get(
    `/admission-applications/school/${schoolId}`
  );
};

// Admin approves application
export const approveAdmissionApplication = async (applicationId) => {
  return http.patch(
    `/admission-applications/${applicationId}/approve`
  );
};

// Admin rejects application
export const rejectAdmissionApplication = async (
  applicationId,
  rejectionReason
) => {
  return http.patch(
    `/admission-applications/${applicationId}/reject`,
    {
      rejectionReason,
    }
  );
};

