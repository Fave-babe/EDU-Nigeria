import http from "./http";

export const getMyParentDashboard = async () => {
  return http.get("/parent/me/dashboard");
};

export const getStudentsBySchool = async (schoolId) => {
  return http.get(`/student/school/${schoolId}`);
};

export const linkChildToParent = async (parentId, studentId) => {
  return http.post(`/parent/${parentId}/children`, {
    studentId,
  });
};