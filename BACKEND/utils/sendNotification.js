const Notification = require("../models/Notification");

const sendNotification = async (
    receiverId,
    title,
    message
) => {
    console.log("================================");
    console.log("Creating Notification");
    console.log("Receiver:", receiverId);
    console.log("Title:", title);
    console.log("Message:", message);
    console.log("================================");

    const notification = await Notification.create({
        receiverId,
        title,
        message
    });

    console.log("Saved Notification:", notification._id);

    return notification;
};

module.exports = sendNotification;