import api from './api';
import { io } from 'socket.io-client';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://swapskill-backend-4ovd.onrender.com';

let socket;

export const chatService = {
 
  getMyChats: async () => {
    const res = await api.get("/chats/my-chats");
    return res.data;
  },


  get socket() {
    return socket;
  },

  
  getChatHistory: async (chatId) => {
    const res = await api.get(`/chats/history/${chatId}`);
    return res.data;
  },

  

  createOrGetChat: async (payload) => {
    try {
      const response = await api.post('/chats', payload);
      console.log('createOrGetChat called with payload:', payload);
      return response.data;
    } catch (error) {
      console.error("API Error in createOrGetChat:", error.response?.data || error.message);
      throw error; 
    }
  },
 
  joinChat: (chatId, userId) => {
    if (!socket || !socket.connected) {
      console.warn('⚠️ Socket not connected, cannot join chat:', chatId);
      return;
    }
    socket.emit("joinChat", { chatId, userId });
  },


  
sendMessage: (chatId, senderId, text, replyToId = null, tempId = null) => {
  if (!socket || !socket.connected) {
    console.warn('Socket not connected, cannot send message');
    return;
  }

  const payload = {
    chatId,
    senderId,
    text: text || '',
    replyTo: replyToId,          
    tempId
  };

  console.log('Emitting sendMessage with payload:', payload);  

  socket.emit('sendMessage', payload);
},

sendFile: async (chatId, senderId, file, tempId = null) => {
  if (!file) throw new Error('No file provided');

  try {
    // Upload to Cloudinary via your existing /api/uploads route
    const res = await uploadFile(file);
    const fileUrl = res?.url || res?.path || res?.secure_url || res?.data?.url;

    if (!fileUrl) {
      throw new Error('File upload failed - no URL returned');
    }

    const fileMeta = {
      url: fileUrl,
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size
    };

    // Use same tempId that frontend created (very important)
    const finalTempId = tempId || `temp-file-${Date.now()}`;

    if (socket && socket.connected) {
      socket.emit('sendMessage', {
        chatId,
        senderId,
        text: '',                    // clean rakho
        file: fileMeta,
        tempId: finalTempId          // ← yeh line sabse zaroori hai
      });
      console.log('📤 File sent via socket with URL:', fileUrl);
    }

    return { ...fileMeta, tempId: finalTempId };

  } catch (err) {
    console.error('File send error:', err);
    throw err;
  }
},
  deleteMessage: (messageId, chatId, type, userId) => {
    socket.emit("deleteMessage", { messageId, chatId, type, userId });
  },

 
  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
      console.log("Socket Disconnected");
    }
  },
 
  logout: (userId) => {
    try {
      if (socket && socket.connected) {
        socket.emit('manualLogout', { userId });
        socket.disconnect();
      }
    } catch (err) {
      console.warn('chatService.logout error', err);
    }
  },
  // Clear all messages in a chat
  clearChat: (chatId, userId) => {
    if (socket && socket.connected) {
      socket.emit('clearChat', { chatId, userId });
    }
  },
  // Delete entire chat
  deleteChat: (chatId, userId) => {
    if (socket && socket.connected) {
      socket.emit('deleteChat', { chatId, userId });
    }
  },
  // Mute/unmute chat
  muteChat: (chatId, userId, isMuted) => {
    if (socket && socket.connected) {
      socket.emit('muteChat', { chatId, userId, isMuted });
    }
  },
  // Update unread count
  updateUnreadCount: (chatId, userId, increment) => {
    if (socket && socket.connected) {
      socket.emit('updateUnreadCount', { chatId, userId, increment });
    }
  },
  // Edit an existing message (real-time via socket)
  editMessage: (messageId, newText, chatId, userId) => {
    if (!socket || !socket.connected) return;
    socket.emit('editMessage', { messageId, newText, chatId, userId });
  },
  
  markAsRead: (chatId, userId) => {
    if (socket && socket.connected) {
      socket.emit("markAsRead", { chatId, userId });
    }
  },
  // Mark a specific message as seen (read receipt)
  markMessageSeen: (messageId, chatId, userId) => {
    if (socket && socket.connected) {
      socket.emit('messageSeen', { messageId, chatId, userId });
    }
  },
  
};


export const uploadFile = async (file) => {
  const form = new FormData();
  form.append('file', file);

  try {
    const res = await api.post('/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log("Backend upload response:", res.data); // ← yeh add kar
    return res.data;
  } catch (err) {
    console.error("Upload API failed:", err.response?.data || err.message);
    throw err;
  }
};

// Convenience: send a message that contains a file (url + meta)
export const sendFileMessage = (chatId, senderId, fileMeta) => {
  // fileMeta: { url, name, mimeType, size }
  socket.emit('sendMessage', { chatId, senderId, text: '', file: fileMeta });
};