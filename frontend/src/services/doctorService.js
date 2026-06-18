import api from "./api";

export const getDoctors = () =>
  api.get("/doctors");

export const applyDoctor = (applicationData) =>
  api.post("/doctors/apply", applicationData);

export const getMyDoctorProfile = () =>
  api.get("/doctors/me");

export const updateMyDoctorProfile = (payload) =>
  api.put("/doctors/me", payload);
