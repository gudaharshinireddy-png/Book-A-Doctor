const express = require("express");
const router = express.Router();

const {
    getPendingDoctors,
    approveDoctor,
    getUsers,
    getDashboardStats
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");

// Dashboard Stats
router.get(
    "/stats",
    protect,
    authorizeRoles("admin"),
    getDashboardStats
);

// Pending Doctors
router.get(
    "/doctors/pending",
    protect,
    authorizeRoles("admin"),
    getPendingDoctors
);

// Approve Doctor
router.put(
    "/doctors/:id/approve",
    protect,
    authorizeRoles("admin"),
    approveDoctor
);

// Users
router.get(
    "/users",
    protect,
    authorizeRoles("admin"),
    getUsers
);

module.exports = router;