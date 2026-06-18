const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../middleware/asyncHandler");

// Register User
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const selectedRole = role || "patient";

    if (selectedRole === "admin") {
        const adminCount = await User.countDocuments({ role: "admin" });

        if (adminCount >= 5) {
            return res.status(400).json({
                message: "Maximum admin accounts reached."
            });
        }
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        role: selectedRole
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
    });

});

// Login User
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });

    } else {

        res.status(401).json({
            message: "Invalid email or password"
        });

    }

});

// Get Profile
const getProfile = asyncHandler(async (req, res) => {

    res.json(req.user);

});

// Get Admin Count (public — for registration UI)
const getAdminCount = asyncHandler(async (req, res) => {

    const count = await User.countDocuments({ role: "admin" });

    res.json({
        count,
        available: count < 5
    });

});

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    getAdminCount
};