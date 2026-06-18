const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const asyncHandler = require("../middleware/asyncHandler");
const sendNotification = require("../utils/sendNotification");
// Get Pending Doctors
const getPendingDoctors = asyncHandler(async (req, res) => {

    const doctors = await Doctor.find({
        status: "pending"
    }).populate("userId", "name email");

    res.json(doctors);

});

// Approve Doctor
const approveDoctor = asyncHandler(async (req, res) => {

    const doctor = await Doctor.findById(
        req.params.id
    );

    if (!doctor) {
        return res.status(404).json({
            message: "Doctor not found"
        });
    }

    doctor.status = "approved";

    await doctor.save();

    await User.findByIdAndUpdate(
        doctor.userId,
        {
            role: "doctor"
        }
    );
    await sendNotification(
        doctor.userId,
        "Doctor Application Approved",
        "Congratulations! Your doctor application has been approved."
    );
    res.json({
        success: true,
        message: "Doctor approved"
    });

});

// Get All Users
const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find()
        .select("-password");

    res.json(users);

});

// Dashboard Stats
const getDashboardStats = asyncHandler(async (req, res) => {

    const totalUsers = await User.countDocuments();

    const totalDoctors = await Doctor.countDocuments({
        status: "approved"
    });

    const pendingDoctors = await Doctor.countDocuments({
        status: "pending"
    });

    const totalAppointments =
        await Appointment.countDocuments();

    res.json({
        totalUsers,
        totalDoctors,
        pendingDoctors,
        totalAppointments
    });

});

module.exports = {
    getPendingDoctors,
    approveDoctor,
    getUsers,
    getDashboardStats
};