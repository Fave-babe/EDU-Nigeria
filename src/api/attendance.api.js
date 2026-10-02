
import http from "./http";

export const recordAttendance = async (data) => {
  return http.post("/attendance", data);
};

export const getClassAttendance = async (
  classId,
  date,
  academicSession
) => {
  return http.get(`/attendance/class/${classId}`, {
    params: {
      ...(date ? { date } : {}),
      ...(academicSession ? { academicSession } : {}),
    },
  });
};

export const getStudentAttendance = async (
  studentId,
  academicSession,
  status,
  startDate,
  endDate
) => {
  return http.get(`/attendance/student/${studentId}`, {
    params: {
      ...(academicSession ? { academicSession } : {}),
      ...(status ? { status } : {}),
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    },
  });
};

export const updateAttendance = async (attendanceId, data) => {
  return http.patch(`/attendance/${attendanceId}`, data);
};

export const getStudentAttendanceStats = async (
  studentId,
  academicSession
) => {
  return http.get(`/attendance/student/${studentId}/stats`, {
    params: academicSession ? { academicSession } : {},
  });
};

