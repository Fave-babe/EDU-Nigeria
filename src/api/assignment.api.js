
import axios from "axios";
import { getToken } from "./token";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api/v1";

const assignmentApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

assignmentApi.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// CREATE ASSIGNMENT
export async function createAssignment(data) {
  const response = await assignmentApi.post(
    "/assignments",
    data
  );

  return response.data;
}


// GET SINGLE ASSIGNMENT
export async function getAssignment(id) {
  const response = await assignmentApi.get(
    `/assignments/${id}`
  );

  return response.data;
}


// GET ALL ASSIGNMENTS FOR A SCHOOL
export async function getSchoolAssignments(schoolId) {
  const response = await assignmentApi.get(
    `/assignments/school/${schoolId}`
  );

  return response.data;
}


// UPDATE ASSIGNMENT
export async function updateAssignment(id, data) {
  const response = await assignmentApi.put(
    `/assignments/${id}`,
    data
  );

  return response.data;
}


// DELETE ASSIGNMENT
export async function deleteAssignment(id) {
  const response = await assignmentApi.delete(
    `/assignments/${id}`
  );

  return response.data;
}


export default assignmentApi;

