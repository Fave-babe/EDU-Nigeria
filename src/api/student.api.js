import axios from "axios";
import { getToken } from "./token";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api/v1";

const studentApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

studentApi.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export async function getMyStudentProfile() {
  const response = await studentApi.get("/student/me");
  return response.data;
}

export async function getStudents(params = {}) {
  const response = await studentApi.get("/student", {
    params,
  });

  return response.data;
}

export async function getStudent(id) {
  const response = await studentApi.get(`/student/${id}`);
  return response.data;
}

export async function createStudent(data) {
  const response = await studentApi.post("/student", data);
  return response.data;
}

export async function updateStudent(id, data) {
  const response = await studentApi.put(`/student/${id}`, data);
  return response.data;
}

export async function deleteStudent(id) {
  const response = await studentApi.delete(`/student/${id}`);
  return response.data;
}

export default studentApi;