import api from "./api";

export const loginUser = (credentials) =>
  api.post("/auth/login", credentials);

export const registerUser = (userData) =>
  api.post("/auth/register", userData);

export const getProfile = () =>
  api.get("/auth/profile");

export const updateProfile = (payload) =>
  api.put("/auth/profile", payload);
