import http from "./http";

export const teacherApi = {
  getTeacher: async (id) => {
    return http.get(`/teacher/${id}`);
  },

  getTeachers: async (params = {}) => {
    return http.get("/teacher", {
      params,
    });
  },

  getTeachersBySchool: async (schoolId) => {
    return http.get(`/teacher/school/${schoolId}`);
  },
};