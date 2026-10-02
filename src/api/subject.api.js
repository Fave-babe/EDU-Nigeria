import http from "./http";

export const getSchoolSubjects = async (schoolId) => {
  return http.get(`/subject/school/${schoolId}`);
};

export const getSubject = async (subjectId) => {
  return http.get(`/subject/${subjectId}`);
};

export const subjectApi = {
  getSchoolSubjects,
  getSubject,
};