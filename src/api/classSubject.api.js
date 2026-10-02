import http from "./http";

export const createClassSubject = async (data) => {
  return http.post("/class-subject", data);
};

export const getClassSubjects = async (classId, academicSession) => {
  return http.get(`/class-subject/class/${classId}`, {
    params: academicSession ? { academicSession } : {},
  });
};

export const classSubjectApi = {
  createClassSubject,
  getClassSubjects,
};