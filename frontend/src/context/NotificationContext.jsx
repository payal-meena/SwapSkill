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
      
      // Aggressive polling - har 5 seconds
      const pollInterval = setInterval(() => {
        fetchNotifications();
      }, 5000);
      
      return () => clearInterval(pollInterval);
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    console.log('🔌 NotificationContext: Connecting socket for', userId);
    chatService.connectSocket(userId);
    
    const setupListener = () => {
      const socket = chatService.socket;
      if (!socket) {
        console.log('⏳ Socket not ready, retrying...');
        setTimeout(setupListener, 1000);
        return;
      }

      console.log('✅ NotificationContext: Socket ready, adding listener');
      
      socket.on('newNotification', (notification) => {
        console.log('🔔 Notification received:', notification);
        
        if (notification.type === 'message') {
          setGroupedNotifications(prev => ({
            ...prev,
            [notification.senderId]: {
              _id: notification.senderId,
              senderId: notification.senderId,
              sender: { name: notification.senderName, profilePicture: notification.senderImage },
              message: `${notification.messageCount} new message${notification.messageCount > 1 ? 's' : ''}`,
              messageCount: notification.messageCount,
              chatId: notification.chatId,
              createdAt: notification.createdAt,
              type: 'message',
              isRead: false
            }
          }));
        } else {
          setNotifications(prev => [{ ...notification, sender: notification.senderId || null }, ...prev]);
        }
        setUnreadCount(prev => prev + 1);
        fetchNotifications();
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