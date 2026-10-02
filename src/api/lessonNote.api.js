import http from "./http";

export const getStudentLessonNotes = async () => {
  return http.get("/lesson-note/student");
};