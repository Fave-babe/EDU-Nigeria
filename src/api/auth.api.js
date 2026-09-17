import http from "./http";

export const authApi = {
  login: (email, password) =>
    http.post("/auth/login", {
      email,
      password,
    }),

  me: () =>
    http.get("/auth/me"),

  register: (payload) =>
    http.post("/auth/register", payload),
};