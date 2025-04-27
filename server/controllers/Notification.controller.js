const Notification = require("../models/Notification.model");

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    // Find the notification by its ID
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    // Ensure the notification belongs to the logged-in user
    if (notification.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this notification.",
      });
    }

    // Delete the notification
    await Notification.findByIdAndDelete(notificationId);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all notifications for the logged-in user
    await Notification.deleteMany({ user: userId });

    return res.status(200).json({
      success: true,
      message: "All notifications cleared successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

  exports.getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch total count first
    const totalNotifications = await Notification.countDocuments({
      user: userId,
    });

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
      totalNotifications,
      totalPages: Math.ceil(totalNotifications / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // ✅ Ownership check
    if (notification.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    notification.read = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error" });
  }
};
