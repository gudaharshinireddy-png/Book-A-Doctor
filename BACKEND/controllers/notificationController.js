const Notification = require("../models/Notification");
const asyncHandler = require("../middleware/asyncHandler");

// Get My Notifications
const getNotifications = asyncHandler(async (req, res) => {

    const notifications = await Notification.find({
        receiverId: req.user._id
    }).sort({ createdAt: -1 });

    res.json(notifications);

});

// Mark Notification Read
const markAsRead = asyncHandler(async (req, res) => {

    const notification = await Notification.findById(
        req.params.id
    );

    if (!notification) {
        return res.status(404).json({
            message: "Notification not found"
        });
    }

    notification.isRead = true;

    await notification.save();

    res.json({
        success: true,
        message: "Notification marked as read"
    });

});

module.exports = {
    getNotifications,
    markAsRead
};