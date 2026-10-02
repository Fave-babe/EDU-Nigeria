import axios from "axios";
import { getToken } from "./token";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api/v1";

const counsellingApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

counsellingApi.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Create counselling record
export async function createCounsellingRecord(data) {
  const response = await counsellingApi.post(
    "/counselling-records",
    data
  );

  return response.data;
}

// Get one counselling record
export async function getCounsellingRecord(id) {
  const response = await counsellingApi.get(
    `/counselling-records/${id}`
  );

  return response.data;
}

// Get counselling records for a school
export async function getCounsellingRecordsBySchool(schoolId) {
  const response = await counsellingApi.get(
    `/counselling-records/school/${schoolId}`
  );

  return response.data;
}

// Get counselling records for a counsellor
export async function getCounsellingRecordsByCounsellor(
  counsellorId
) {
  const response = await counsellingApi.get(
    `/counselling-records/counsellor/${counsellorId}`
  );

  return response.data;
}

// Update counselling record
export async function updateCounsellingRecord(id, data) {
  const response = await counsellingApi.put(
    `/counselling-records/${id}`,
    data
  );

  return response.data;
}

// Delete counselling record
export async function deleteCounsellingRecord(id) {
  const response = await counsellingApi.delete(
    `/counselling-records/${id}`
  );

  return response.data;
}

export async function getCounsellingFollowUpsByCounsellor(
  counsellorId
) {
  const response =
    await counsellingApi.get(
      `/counselling-records/counsellor/${counsellorId}/followups`
    );

  return response.data;
}

export default counsellingApi;