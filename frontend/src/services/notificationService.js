import api from './api';

export const notificationService = {
 
  getNotifications: async () => {
    
    const response = await api.get('/notifications');
  
    
    
    const transformedNotifications = {
      ...response.data,
      notifications: response.data.notifications?.map(notif => ({
        ...notif,
        sender: notif.senderId || null
      })) || []
    };
    
    return transformedNotifications;
  },

  // Create new notification
  createNotification: async (notificationData) => {
   
    const response = await api.post('/notifications', notificationData);
    
    return response.data;
  },

  // Mark single notification as read
  markAsRead: async (notificationId) => {
    
    const response = await api.put(`/notifications/${notificationId}/read`);
    
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    
    const response = await api.put('/notifications/all/read');
    
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    
    const response = await api.delete(`/notifications/${notificationId}`);
    
    return response.data;
  }
};