const express = require("express");
const router = express.Router();

const {
    applyDoctor,
    getDoctors
} = require("../controllers/doctorController");

const {
    protect
} = require("../middleware/authMiddleware");

router.post(
    "/apply",
    protect,
    applyDoctor
);

router.get(
    "/",
    getDoctors
);

module.exports = router;