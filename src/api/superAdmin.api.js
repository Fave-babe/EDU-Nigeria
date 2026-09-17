import http from "./http";

export const superAdminApi = {
  // Get all Super Admins
  getAll: () =>
    http.get("/superadmin"),

  // Get one Super Admin
  getOne: (id) =>
    http.get(`/superadmin/${id}`),

  // Create Super Admin
  create: (payload) =>
    http.post("/superadmin", payload),

  // Update Super Admin
  update: (id, payload) =>
    http.patch(`/superadmin/${id}`, payload),

  // Activate Super Admin
  activate: (id) =>
    http.patch(`/superadmin/${id}/activate`),

  // Deactivate Super Admin
  deactivate: (id) =>
    http.patch(`/superadmin/${id}/deactivate`),

  // Delete Super Admin
  remove: (id) =>
    http.delete(`/superadmin/${id}`),
};