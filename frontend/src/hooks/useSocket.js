import { useEffect, useState } from 'react';
import { chatService } from '../services/chatService';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      // Use chatService to get the socket instance instead of creating a new one
      // This ensures only one socket instance is used throughout the app
      chatService.connectSocket(userId);
      
      // Get socket from chatService
      const appSocket = chatService.socket;
      if (appSocket) {
        setSocket(appSocket);
      }

      return () => {
        // Don't close socket here, let chatService manage it
      };
    }
  }, []);

  return socket;
};