import api from './api';

export const notificationService = {
  // Get all notifications for current user
  getNotifications: async () => {
    console.log("=== FRONTEND: GET NOTIFICATIONS ===");
    const response = await api.get('/notifications');
    console.log("Get notifications response:", response.data);
    return response.data;
  },

  // Create new notification
  createNotification: async (notificationData) => {
    console.log("=== FRONTEND: CREATE NOTIFICATION ===");
    console.log("Sending data:", notificationData);
    const response = await api.post('/notifications', notificationData);
    console.log("Create notification response:", response.data);
    return response.data;
  },

  // Mark single notification as read
  markAsRead: async (notificationId) => {
    console.log("=== FRONTEND: MARK AS READ ===", notificationId);
    const response = await api.put(`/notifications/${notificationId}/read`);
    console.log("Mark as read response:", response.data);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    console.log("=== FRONTEND: MARK ALL AS READ ===");
    const response = await api.put('/notifications/all/read');
    console.log("Mark all as read response:", response.data);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    console.log("=== FRONTEND: DELETE NOTIFICATION ===", notificationId);
    const response = await api.delete(`/notifications/${notificationId}`);
    console.log("Delete notification response:", response.data);
    return response.data;
  }
};