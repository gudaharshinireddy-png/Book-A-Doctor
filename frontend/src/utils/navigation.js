import { ROLES } from "../utils/constants";

export const getDashboardPath = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "/admin";
    case ROLES.DOCTOR:
      return "/doctor/dashboard";
    case ROLES.PATIENT:
    default:
      return "/patient/dashboard";
  }
};
