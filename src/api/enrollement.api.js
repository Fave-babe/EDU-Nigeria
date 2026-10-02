import http from "./http";

export const createEnrollment = async (data) => {
  return http.post("/enrollment", data);
};

export const getClassEnrollments = async (
  classId,
  academicSession
) => {
  return http.get(`/enrollment/class/${classId}`, {
    params: academicSession
      ? { academicSession }
      : {},
  });
};

export const getStudentAcademicInfo = async (studentId) => {
  return http.get(
    `/enrollment/student/${studentId}/academic-info`
  );
};

export const enrollmentApi = {
  createEnrollment,
  getClassEnrollments,
  getStudentAcademicInfo,
};