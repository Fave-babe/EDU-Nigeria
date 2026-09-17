
import http from "./http";

export const getSchools = async () => {
  const response = await http.get("/school");

  return response;
};

export const getPublicSchools = async () => {
  const response = await http.get("/school/public");

  return response;
};

export const createSchool = async (schoolData) => {
  const response = await http.post("/school", schoolData);

  return response;
};

export const getSchool = async (schoolId) => {
  const response = await http.get(`/school/${schoolId}`);

  return response;
};

export const getSchoolDetails = async (schoolId) => {
  const response = await http.get(`/school/${schoolId}/details`);

  return response;
};

