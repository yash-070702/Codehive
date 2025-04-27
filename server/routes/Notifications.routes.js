const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/Auth.middleware");

const {deleteNotification,clearAllNotifications,getAllNotifications,markNotificationAsRead} = require("../controllers/Notification.controller");

router.delete('/deleteNotification/:notificationId', auth, deleteNotification);
router.delete('/deleteAllNotifications/clear', auth, clearAllNotifications);
router.put("/markAsRead/:notificationId", auth, markNotificationAsRead);
router.post("/getAllNotifications", auth, getAllNotifications);

module.exports = router;