import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { notificationEndpoints } from "../apis";

const { GET_ALL_NOTIFICATIONS_API, DELETE_NOTIFICATION_API,DELETE_ALL_NOTIFICATION_API,MARK_AS_READ_NOTIFICATION_API } =
  notificationEndpoints;

export const getAllNotifications = async (userId, token) => {
  const toastId = toast.loading("Fetching Notifications...");

  try {
    const response = await apiConnector(
      "POST",
      GET_ALL_NOTIFICATIONS_API,
      {
        userId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("GET ALL NOTIFICATIONS RESPONSE:", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.dismiss(toastId);
    toast.success("Notifications fetched successfully!");
    return response.data.notifications;
  } catch (error) {
    console.log("GET NOTIFICATIONS ERROR:", error);
    toast.error(
      error?.response?.data?.message || "Failed to fetch notifications"
    );
  }
};

export const deleteNotification = async (notificationId, userId, token) => {
  const toastId = toast.loading("Deleting Notification...");

  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_NOTIFICATION_API}/${notificationId}`,
      {
        userId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("DELETE NOTIFICATION RESPONSE:", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    toast.success("Notification deleted successfully!");
    return true;
  } catch (error) {
    console.log("DELETE NOTIFICATION ERROR:", error);
    toast.dismiss(toastId);
    toast.error(
      error?.response?.data?.message || "Failed to delete notification"
    );
    return false;
  }
};

export const deleteAllNotification = async ( userId, token) => {
  const toastId = toast.loading("Deleting Notification...");

  try {
    const response = await apiConnector(
      "DELETE",
     DELETE_ALL_NOTIFICATION_API,
      {
        userId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("CLEAR NOTIFICATIONS RESPONSE:", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    toast.success("Notification cleared successfully!");
    return true;
  } catch (error) {
    console.log("CLEAR NOTIFICATION ERROR:", error);
    toast.dismiss(toastId);
    toast.error(
      error?.response?.data?.message || "Failed to delete notification"
    );
    return false;
  }
};

export const markAsReadNotification = async (notificationId, userId, token) => {
  const toastId = toast.loading("Marking Notification...");

  try {
    const response = await apiConnector(
      "PUT",
    `${MARK_AS_READ_NOTIFICATION_API}/${notificationId}`,
      {
        userId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("MARKING NOTIFICATION RESPONSE:", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.dismiss(toastId);
    toast.success("Notification marked as read"); 
    return true;
  } catch (error) {
    console.log("MARKING NOTIFICATION ERROR:", error);
    toast.dismiss(toastId);
    toast.error(
      error?.response?.data?.message || "Failed to mark notification"
    );
    return false;
  }
};