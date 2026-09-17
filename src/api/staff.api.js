import axios from "axios";
import { getToken } from "./token";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api/v1";

const staffApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

staffApi.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Get all staff
export async function getStaff(params = {}) {
  const response = await staffApi.get("/staff", {
    params,
  });

  return response.data;
}

// Get one staff member
export async function getStaffById(id) {
  const response = await staffApi.get(`/staff/${id}`);

  return response.data;
}

// Get staff belonging to a school
export async function getStaffBySchool(schoolId) {
  const response = await staffApi.get(
    `/staff/school/${schoolId}`
  );

  return response.data;
}

// Create staff
export async function createStaff(data) {
  const response = await staffApi.post("/staff", data);

  return response.data;
}

// Update staff
export async function updateStaff(id, data) {
  const response = await staffApi.put(
    `/staff/${id}`,
    data
  );

  return response.data;
}

// Delete staff
export async function deleteStaff(id) {
  const response = await staffApi.delete(
    `/staff/${id}`
  );

  return response.data;
}