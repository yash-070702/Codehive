import React, { useState, useEffect } from "react";
import { ShineBorder } from "@/components/magicui/shine-border";
import Notification from "@/components/custom/Notification";
import { useSelector } from "react-redux";
import {
  getAllNotifications,
  deleteNotification,
  deleteAllNotification,
  markAsReadNotification,
} from "@/services/operations/notificationsAPI";
import toast from "react-hot-toast";

const NotificationPage = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Unread");

  const deleteNotificationHandler = async (notificationId) => {
    const response = await deleteNotification(notificationId, user._id, token);
    if (response) {
      toast.success("Notification deleted successfully");
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } else {
      toast.error("Failed to delete notification");
    }
  };

  const markAsReadHandler = async (notificationId) => {
    const response = await markAsReadNotification(
      notificationId,
      user._id,
      token
    );
    if (response) {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } else {
      return;
    }
  };

  const clearAllNotificationsHandler = async () => {
    const response = await deleteAllNotification(user._id, token);
    if (response) {
      setNotifications([]);
    } else {
      return ;
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const result = await getAllNotifications(user._id, token);
      if (result) {
        setNotifications(result);
      }
    };

    if (user && token) {
      fetchNotifications();
    }
  }, [user, token]);

  useEffect(() => {
    const filterednotifications = notifications.filter((n) => {
      if (selectedTab === "Unread") return !n.read;
      if (selectedTab === "Read") return n.read;
      return true; // All
    });

    setFilteredNotifications(filterednotifications);
  },[notifications, selectedTab]);

  // Filter by selected tab

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const totalPages = Math.ceil(filteredNotifications.length / pageSize);

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="mx-auto w-[700px] my-10 md:p-8 relative border border-gray-700 rounded-none md:rounded-2xl shadow-input">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />

      <div className="flex items-center justify-between mb-5 px-2">
        <h2 className="text-3xl font-semibold text-gray-100">Notifications</h2>
        <div
          onClick={clearAllNotificationsHandler}
          className="text-white cursor-pointer"
        >
          <p>Clear All</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {["Unread", "Read", "All"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setSelectedTab(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedTab === tab
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {paginatedNotifications.length === 0 ? (
        <p className="text-gray-500 text-center">
          No {selectedTab.toLowerCase()} notifications.
        </p>
      ) : (
        <>
          <ul className="space-y-4">
            {paginatedNotifications.map((notification) => (
              <Notification
                key={notification._id}
                notification={notification}
                deleteNotificationHandler={deleteNotificationHandler}
                markAsReadHandler={markAsReadHandler}
              />
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-5">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-gray-700 text-white rounded ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>

            <span className="px-4 py-2 bg-gray-200 text-black rounded">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-gray-700 text-white rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPage;
