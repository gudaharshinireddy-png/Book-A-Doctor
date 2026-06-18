const express = require("express");
const router = express.Router();

const {
    bookAppointment,
    getMyAppointments,
    getDoctorAppointments,
    acceptAppointment,
    rejectAppointment,
    cancelAppointment,
    rescheduleAppointment
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

const { authorizeRoles } = require("../middleware/roleMiddleware");

// Book Appointment
router.post(
    "/book",
    protect,
    bookAppointment
);

// Patient Appointments
router.get(
    "/my",
    protect,
    getMyAppointments
);

// Doctor Appointments
router.get(
    "/doctor",
    protect,
    authorizeRoles("doctor"),
    getDoctorAppointments
);

// Accept Appointment
router.put(
    "/:id/accept",
    protect,
    authorizeRoles("doctor"),
    acceptAppointment
);

// Reject Appointment
router.put(
    "/:id/reject",
    protect,
    authorizeRoles("doctor"),
    rejectAppointment
);

// Cancel Appointment
router.put(
    "/:id/cancel",
    protect,
    cancelAppointment
);

// Reschedule Appointment
router.put(
    "/:id/reschedule",
    protect,
    rescheduleAppointment
);

module.exports = router;