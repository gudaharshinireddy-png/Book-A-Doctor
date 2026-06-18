import api from "./api";

export const bookAppointment = (data) =>
  api.post("/appointments/book", data);

export const getMyAppointments = () =>
  api.get("/appointments/my");

export const getDoctorAppointments = () =>
  api.get("/appointments/doctor");

export const acceptAppointment = (id) =>
  api.put(`/appointments/${id}/accept`);

export const rejectAppointment = (id) =>
  api.put(`/appointments/${id}/reject`);

export const cancelAppointment = (id) =>
  api.put(`/appointments/${id}/cancel`);

export const rescheduleAppointment = (id, data) =>
  api.put(`/appointments/${id}/reschedule`, data);
