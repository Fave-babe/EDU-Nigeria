import http from "./http";

export const classApi = {
  getClasses: async (schoolId, academicSession) => {
    return http.get(`/class/school/${schoolId}`, {
      params: academicSession
        ? { academicSession }
        : {},
    });
  },

  getClass: async (id) => {
    return http.get(`/class/${id}`);
  },

  createClass: async (classData) => {
    return http.post("/class", classData);
  },

  assignTeacher: async (classId, teacherId) => {
    return http.patch(`/class/${classId}/teacher`, {
      teacherId,
    });
  },

  removeTeacher: async (classId) => {
    return http.patch(`/class/${classId}/remove-teacher`);
  },
};