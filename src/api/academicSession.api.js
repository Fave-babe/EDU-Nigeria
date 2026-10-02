import http from "./http";

export const academicSessionApi = {
  getSessionsBySchool: async (schoolId) => {
    return http.get(`/academic-sessions/school/${schoolId}`);
  },

  getCurrentSession: async (schoolId) => {
    return http.get(`/academic-sessions/school/${schoolId}/current`);
  },
};