import http from "./http";

// ======================================================
// PUBLIC SCHOOL REGISTRATION
// ======================================================

export const registerSchoolApplication = async (schoolData) => {
const response = await http.post("/school/register", schoolData);
return response;
};

// ======================================================
// GET ALL SCHOOLS
// SUPER ADMIN
// ======================================================

export const getSchools = async () => {
const response = await http.get("/school");
return response;
};

// ======================================================
// GET PLATFORM OVERVIEW
// SUPER ADMIN
// ALL SCHOOLS + PLATFORM STATISTICS
// ======================================================

export const getPlatformOverview = async () => {
const response = await http.get("/school/overview");
return response;
};

// ======================================================
// GET PENDING SCHOOL APPLICATIONS
// SUPER ADMIN
// ======================================================

export const getPendingSchoolApplications = async () => {
const response = await http.get("/school/applications/pending");
return response;
};

// ======================================================
// GET SCHOOL APPLICATIONS
// SUPER ADMIN
// ======================================================

export const getSchoolApplications = async () => {
const response = await http.get("/school/applications/pending");
return response;
};

// ======================================================
// GET PUBLIC ACTIVE SCHOOLS
// ======================================================

export const getPublicSchools = async () => {
const response = await http.get("/school/public");
return response;
};

// ======================================================
// APPROVE SCHOOL
// SUPER ADMIN
// ======================================================

export const approveSchool = async (schoolId) => {
const response = await http.patch(`/school/${schoolId}/approve`);
return response;
};

// ======================================================
// REJECT SCHOOL
// SUPER ADMIN
// ======================================================

export const rejectSchool = async (schoolId) => {
const response = await http.patch(`/school/${schoolId}/reject`);
return response;
};

// ======================================================
// GET SINGLE SCHOOL
// ======================================================

export const getSchool = async (schoolId) => {
const response = await http.get(`/school/${schoolId}`);
return response;
};

// ======================================================
// GET COMPLETE SCHOOL DETAILS
// ======================================================

export const getSchoolDetails = async (schoolId) => {
const response = await http.get(`/school/${schoolId}/details`);
return response;
};

// ======================================================
// SET SCHOOL ADMIN CREDENTIALS
// SUPER ADMIN ONLY
// ======================================================

export const setupSchoolAdminCredentials = async (schoolId, adminData) => {
const response = await http.post(
`/school/${schoolId}/admin-credentials`,
adminData
);

return response;
};
