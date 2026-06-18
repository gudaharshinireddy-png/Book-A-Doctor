const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const asyncHandler = require("../middleware/asyncHandler");
const sendNotification = require("../utils/sendNotification");

// Book Appointment
const bookAppointment = asyncHandler(async (req, res) => {

    const {
        doctorId,
        appointmentDate,
        appointmentTime,
        reason
    } = req.body;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
        return res.status(404).json({
            message: "Doctor not found"
        });
    }

    const appointment = await Appointment.create({
        patientId: req.user._id,
        doctorId,
        appointmentDate,
        appointmentTime,
        reason
    });

    res.status(201).json({
        success: true,
        appointment
    });

});

// Patient Appointments
const getMyAppointments = asyncHandler(async (req, res) => {

    const appointments = await Appointment.find({
        patientId: req.user._id
    }).populate("doctorId");

    res.json(appointments);

});

// Doctor Appointments
const getDoctorAppointments = asyncHandler(async (req, res) => {

    const doctor = await Doctor.findOne({
        userId: req.user._id
    });

    if (!doctor) {
        return res.status(404).json({
            message: "Doctor profile not found"
        });
    }

    const appointments = await Appointment.find({
        doctorId: doctor._id
    }).populate("patientId", "name email phone");

    res.json(appointments);

});

// Accept Appointment
const acceptAppointment = asyncHandler(async (req, res) => {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return res.status(404).json({
            message: "Appointment not found"
        });
    }

    appointment.status = "approved";

    await appointment.save();

    await sendNotification(
        appointment.patientId,
        "Appointment Approved",
        "Your appointment has been approved by the doctor."
    );

    res.json({
        success: true,
        message: "Appointment approved"
    });

});

// Reject Appointment
const rejectAppointment = asyncHandler(async (req, res) => {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return res.status(404).json({
            message: "Appointment not found"
        });
    }

    appointment.status = "rejected";

    await appointment.save();

    await sendNotification(
        appointment.patientId,
        "Appointment Rejected",
        "Your appointment has been rejected by the doctor."
    );

    res.json({
        success: true,
        message: "Appointment rejected"
    });

});

// Cancel Appointment
const cancelAppointment = asyncHandler(async (req, res) => {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return res.status(404).json({
            message: "Appointment not found"
        });
    }

    appointment.status = "cancelled";

    await appointment.save();

    await sendNotification(
        appointment.patientId,
        "Appointment Cancelled",
        "Your appointment has been cancelled."
    );

    res.json({
        success: true,
        message: "Appointment cancelled"
    });

});

// Reschedule Appointment
const rescheduleAppointment = asyncHandler(async (req, res) => {

    const {
        appointmentDate,
        appointmentTime
    } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return res.status(404).json({
            message: "Appointment not found"
        });
    }

    appointment.appointmentDate = appointmentDate;
    appointment.appointmentTime = appointmentTime;

    await appointment.save();

    await sendNotification(
        appointment.patientId,
        "Appointment Rescheduled",
        "Your appointment date/time has been updated."
    );

    res.json({
        success: true,
        message: "Appointment rescheduled",
        appointment
    });

});

module.exports = {
    bookAppointment,
    getMyAppointments,
    getDoctorAppointments,
    acceptAppointment,
    rejectAppointment,
    cancelAppointment,
    rescheduleAppointment
};