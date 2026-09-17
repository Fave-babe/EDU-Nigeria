
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api/v1";

const dashboardApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach logged-in user's JWT
dashboardApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Edu-Nigeria_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =========================================================
// ADMIN DASHBOARD OVERVIEW
// =========================================================

export const getAdminDashboardOverview = async () => {
  const response = await dashboardApi.get(
    "/admin/dashboard/overview"
  );

  return response.data;
};

export default dashboardApi;

