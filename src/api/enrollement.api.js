import http from "./http";

export const getStudentAcademicInfo = async (studentId) => {
  const response = await http.get(
    `/enrollment/student/${studentId}/academic-info`
  );

  return response.data;
};