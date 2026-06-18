const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    getAdminCount
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Admin count (public)
router.get("/admin-count", getAdminCount);

// Login
router.post("/login", loginUser);

// Profile (Protected)
router.get("/profile", protect, getProfile);

module.exports = router;