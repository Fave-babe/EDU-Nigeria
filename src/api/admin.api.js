import http from "./http";

export const getAdmins = async (params = {}) => {
  return await http.get("/admin", { params });
};

export const getAdmin = async (id) => {
  return await http.get(`/admin/${id}`);
};

export const createAdmin = async (data) => {
  return await http.post("/admin", data);
};

export const updateAdmin = async (id, data) => {
  return await http.patch(`/admin/${id}`, data);
};

export const deleteAdmin = async (id) => {
  return await http.delete(`/admin/${id}`);
};