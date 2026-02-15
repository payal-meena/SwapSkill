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
  const [groupedNotifications, setGroupedNotifications] = useState({});

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    fetchNotifications();

    // Polling - har 10 sec (ya 5 sec agar chahta hai)
    const pollInterval = setInterval(() => {
      fetchNotifications();
    }, 10000);  // 10 seconds

    return () => clearInterval(pollInterval);
  }
}, []);

useEffect(() => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  chatService.connectSocket(userId);

  const setupListener = () => {
    const socket = chatService.socket;
    if (!socket) {
      setTimeout(setupListener, 1000);
      return;
    }

    socket.on('newNotification', (notification) => {
      console.log('🔔 Notification received (final working):', notification);

      // 1. Message ke liye grouped update (purane jaisa)
      if (notification.type === 'message') {
        const senderIdKey = notification.senderId?._id?.toString() || notification.senderId || 'unknown';
        const senderName = notification.senderId?.name || 'Someone';
        const senderImage = notification.senderId?.profilePicture || '';

        setGroupedNotifications(prev => ({
          ...prev,
          [senderIdKey]: {
            _id: senderIdKey,
            senderId: senderIdKey,
            sender: { name: senderName, profilePicture: senderImage },
            message: 'sent you a message',
            messageCount: (prev[senderIdKey]?.messageCount || 0) + 1,
            chatId: notification.redirectUrl?.split('/').pop() || '',
            createdAt: notification.createdAt || new Date().toISOString(),
            type: 'message',
            isRead: false
          }
        }));
      } else {
        // Baki notifications direct add
        setNotifications(prev => [{ ...notification, sender: notification.senderId || null }, ...prev]);
      }

      // 2. Unread count badhao
      setUnreadCount(prev => prev + 1);

      // 3. Yeh purane version ki magic thi — har notification pe full refresh
      fetchNotifications();  // ← bina refresh ke bell + modal update karne ka secret

    });
  };

  setupListener();

  return () => {
    const socket = chatService.socket;
    if (socket) socket.off('newNotification');
  };
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
    groupedNotifications,
    setGroupedNotifications,
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