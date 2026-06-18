import api from "./api";

export const getDashboardStats = () =>
  api.get("/admin/stats");

export const getPendingDoctors = () =>
  api.get("/admin/doctors/pending");

export const approveDoctor = (id) =>
  api.put(`/admin/doctors/${id}/approve`);

export const getUsers = () =>
  api.get("/admin/users");
