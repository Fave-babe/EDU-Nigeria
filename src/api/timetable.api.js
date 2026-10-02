import http from "./http";

export const getClassTimetable = async (
  classId,
  academicSession
) => {
  return http.get(`/timetable/class/${classId}`, {
    params: academicSession
      ? { academicSession }
      : {},
  });
};

export const createTimetable = async (data) => {
  return http.post("/timetable", data);
};

export const timetableApi = {
  getClassTimetable,
  createTimetable,
};