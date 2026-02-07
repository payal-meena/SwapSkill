import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { chatService } from '../services/chatService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

 useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    fetchNotifications();
  }
}, []);


  useEffect(() => {
    // Initialize socket connection
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      chatService.connectSocket(userId);
    }

    // Get socket from chatService (singleton instance)
    const socket = chatService.socket;
    
    if (socket) {
      console.log('NotificationContext: Setting up socket listeners');
      
      // Listen for new notifications
      socket.on('newNotification', (notification) => {
        console.log('🔔 New notification:', notification);
        // Transform senderId to sender for consistency
        const transformedNotification = {
          ...notification,
          sender: notification.senderId || null
        };
        setNotifications(prev => [transformedNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      // Listen for request updates and convert to notifications
      socket.on('requestUpdated', (request) => {
        console.log('📋 Request updated:', request);
        // Auto-add to notifications if relevant
        const notification = {
          _id: request._id,
          type: 'REQUEST_UPDATE',
          title: 'Request Updated',
          message: `A connection request status has changed`,
          relatedId: request._id,
          createdAt: new Date(),
          isRead: false
        };
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      // Listen for new chats
      socket.on('chatCreated', (chat) => {
        console.log('💬 Chat created:', chat);
        const notification = {
          _id: chat._id,
          type: 'CHAT',
          title: 'New Chat Created',
          message: 'You have a new conversation',
          relatedId: chat._id,
          createdAt: new Date(),
          isRead: false
        };
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      // Listen for messages
      socket.on('messageReceived', (message) => {
        console.log('✉️ Message received:', message._id);
        const notification = {
          _id: message._id,
          type: 'MESSAGE',
          title: 'New Message',
          message: 'You have a new message',
          relatedId: message.chat || message._id,
          createdAt: new Date(),
          isRead: false
        };
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        socket.off('newNotification');
        socket.off('requestUpdated');
        socket.off('chatCreated');
        socket.off('messageReceived');
      };
    }
  }, []);

  const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
  
  // Agar token nahi hai to silently return karo
  if (!token) {
    return;
  }
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.notifications?.filter(n => !n.isRead).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      // Update unread count if deleted notification was unread
      const deletedNotification = notifications.find(n => n._id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};