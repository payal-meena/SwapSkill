import { useEffect } from 'react';
import { useSocket } from './useSocket';

/**
 * Custom hook to manage all real-time socket updates across the application
 * Handles: notifications, requests, messages, chats, user status, etc.
 */
export const useRealTimeUpdates = (handlers = {}) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Notification handlers
    if (handlers.onNewNotification) {
      socket.on('newNotification', handlers.onNewNotification);
    }

    // Request handlers
    if (handlers.onRequestUpdated) {
      socket.on('requestUpdated', handlers.onRequestUpdated);
    }

    if (handlers.onRequestReceived) {
      socket.on('newRequest', handlers.onRequestReceived);
    }

    // Chat handlers
    if (handlers.onChatCreated) {
      socket.on('chatCreated', handlers.onChatCreated);
    }

    if (handlers.onChatUpdated) {
      socket.on('sidebarUpdate', handlers.onChatUpdated);
    }

    if (handlers.onMessageReceived) {
      socket.on('messageReceived', handlers.onMessageReceived);
    }

    // User status handlers
    if (handlers.onUserStatusChanged) {
      socket.on('userStatusChanged', handlers.onUserStatusChanged);
    }

    if (handlers.onUserBlocked) {
      socket.on('userBlockedMe', handlers.onUserBlocked);
    }

    if (handlers.onUserUnblocked) {
      socket.on('userUnblockedMe', handlers.onUserUnblocked);
    }

    // Connection handlers
    if (handlers.onConnectionEstablished) {
      socket.on('connect', handlers.onConnectionEstablished);
    }

    if (handlers.onConnectionLost) {
      socket.on('disconnect', handlers.onConnectionLost);
    }

    // Cleanup
    return () => {
      if (handlers.onNewNotification) {
        socket.off('newNotification', handlers.onNewNotification);
      }
      if (handlers.onRequestUpdated) {
        socket.off('requestUpdated', handlers.onRequestUpdated);
      }
      if (handlers.onRequestReceived) {
        socket.off('newRequest', handlers.onRequestReceived);
      }
      if (handlers.onChatCreated) {
        socket.off('chatCreated', handlers.onChatCreated);
      }
      if (handlers.onChatUpdated) {
        socket.off('sidebarUpdate', handlers.onChatUpdated);
      }
      if (handlers.onMessageReceived) {
        socket.off('messageReceived', handlers.onMessageReceived);
      }
      if (handlers.onUserStatusChanged) {
        socket.off('userStatusChanged', handlers.onUserStatusChanged);
      }
      if (handlers.onUserBlocked) {
        socket.off('userBlockedMe', handlers.onUserBlocked);
      }
      if (handlers.onUserUnblocked) {
        socket.off('userUnblockedMe', handlers.onUserUnblocked);
      }
      if (handlers.onConnectionEstablished) {
        socket.off('connect', handlers.onConnectionEstablished);
      }
      if (handlers.onConnectionLost) {
        socket.off('disconnect', handlers.onConnectionLost);
      }
    };
  }, [socket, handlers]);

  return socket;
};
