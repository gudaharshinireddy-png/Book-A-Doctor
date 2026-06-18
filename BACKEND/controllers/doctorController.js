const Doctor = require("../models/Doctor");
const asyncHandler = require("../middleware/asyncHandler");

// Apply Doctor
const applyDoctor = asyncHandler(async (req, res) => {

    const doctorExists = await Doctor.findOne({
        userId: req.user._id
    });

    if (doctorExists) {
        return res.status(400).json({
            message: "Doctor application already exists"
        });
    }

    const doctor = await Doctor.create({
        userId: req.user._id,
        specialization: req.body.specialization,
        experience: req.body.experience,
        fees: req.body.fees,
        hospital: req.body.hospital,
        qualification: req.body.qualification,
        availableDays: req.body.availableDays,
        availableTime: req.body.availableTime
    });

    res.status(201).json({
        success: true,
        doctor
    });

});

// Get All Doctors
const getDoctors = asyncHandler(async (req, res) => {

    const doctors = await Doctor.find({
        status: "approved"
    }).populate("userId","name email phone");

    res.json(doctors);

});

module.exports = {
    applyDoctor,
    getDoctors
};