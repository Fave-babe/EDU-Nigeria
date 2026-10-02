import http from "./http";

// =====================================================
// RECORD A PAYMENT
// =====================================================

export const createPayment = async (data) => {
  return http.post("/payment", data);
};

// =====================================================
// GET ALL PAYMENTS
// Admin / Bursar / Super Admin
// =====================================================

export const getPayments = async (params = {}) => {
  return http.get("/payment", {
    params,
  });
};

// =====================================================
// GET PAYMENT BY ID
// Admin / Bursar / Super Admin
// =====================================================

export const getPayment = async (paymentId) => {
  return http.get(`/payment/${paymentId}`);
};

// =====================================================
// GET PAYMENTS FOR A SCHOOL
// Admin / Bursar / Super Admin
// =====================================================

export const getSchoolPayments = async (schoolId) => {
  return http.get(`/payment/school/${schoolId}`);
};

// =====================================================
// GET PAYMENTS FOR A STUDENT
// Admin / Bursar / Super Admin
// =====================================================

export const getStudentPayments = async (studentId) => {
  return http.get(`/payment/student/${studentId}`);
};

// =====================================================
// GET TODAY'S PAYMENTS
// Admin / Bursar / Super Admin
// =====================================================

export const getTodayPayments = async (schoolId) => {
  return http.get(`/payment/school/${schoolId}/today`);
};

// =====================================================
// GET TOTAL SCHOOL REVENUE
// Admin / Bursar / Super Admin
// =====================================================

export const getTotalRevenue = async (schoolId) => {
  return http.get(`/payment/school/${schoolId}/revenue`);
};

// =====================================================
// GET TODAY'S SCHOOL REVENUE
// Admin / Bursar / Super Admin
// =====================================================

export const getTodayRevenue = async (schoolId) => {
  return http.get(`/payment/school/${schoolId}/today-revenue`);
};

// =====================================================
// PARENT PAYMENTS
// Only payments belonging to the parent's children
// =====================================================

export const getMyChildrenPayments = async () => {
  return http.get("/payment/parent/me");
};