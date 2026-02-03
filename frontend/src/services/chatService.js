
import api from './api';
import { io } from 'socket.io-client';

// Use environment variable so other devices can connect to the real backend
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket;

const initSocket = (userId) => {
  const token = localStorage.getItem('token');
  socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    transports: ['websocket'],
    query: {
      userId: userId,
      token: token
    }
  });
  return socket;
};

export const chatService = {
  // --- HTTP Methods (Axios) ---

  // Saari chats ki list mangwane ke liye (Sidebar)
  getMyChats: async () => {
    const res = await api.get("/chats/my-chats");
    return res.data;
  },

  // Kisi specific chat ki history load karne ke liye
  getChatHistory: async (chatId) => {
    const res = await api.get(`/chats/history/${chatId}`);
    return res.data;
  },

  // Nayi chat create karne ke liye (agar exist na karti ho)
  // services/chatService.js update
  // services/chatService.js

  createOrGetChat: async (payload) => {
    try {
      // payload mein { requestId, otherUserId } hona chahiye
      const response = await api.post('/chats', payload);

      // Axios response hamesha .data mein actual result deta hai
      return response.data;
    } catch (error) {
      // Agar error aaye toh handle karein taaki 'status' undefined na ho
      console.error("API Error in createOrGetChat:", error.response?.data || error.message);
      throw error; // Isse frontend ke catch block mein control chala jayega
    }
  },
  // --- Socket Methods (Real-time) ---

  // Socket connect karne ke liye
  // services/chatService.js

  // services/chatService.js

  connectSocket: (userId) => {
    // Initialize socket with userId if not already done
    if (!socket) {
      socket = initSocket(userId);
    }
    
    // If already connected, skip
    if (socket?.connected) {
      console.log('✅ Socket already connected');
      return;
    }

    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Connected to Socket. ID:', socket.id, 'userId:', userId);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket Connection Error:', err?.message || err);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Socket Disconnected:', reason);
    });
  },

  // Chat room join karne ke liye
  joinChat: (chatId, userId) => {
    socket.emit("joinChat", { chatId, userId });
  },

  // Message emit karne ke liye (Backend ki ChatService ko call karega)
  sendMessage: (data) => {
    // data = { chatId, senderId, text }
    socket.emit("sendMessage", data);
  },

  // Naye message "sunne" (listen) karne ke liye
  // services/chatService.js update karo

  // Message emit karne ke liye 
  sendMessage: (chatId, senderId, text) => {
    socket.emit("sendMessage", { chatId, senderId, text });
  },
  // ✅ Naya: Delete message ka signal bhejne ke liye
  deleteMessage: (messageId, chatId, type, userId) => {
    socket.emit("deleteMessage", { messageId, chatId, type, userId });
  },

  onMessageDeleted: (callback) => {
    socket.on("messageDeleted", (data) => {
      callback(data);
    });
  },
  removeDeleteListener: () => {
    socket.off("messageDeleted");
  },

  // Naye message "sunne" ke liye
  onMessageReceived: (callback) => {
    // Remove any existing listener first to avoid duplicates
    socket.off('messageReceived');
    // Backend se match karne ke liye 'messageReceived' use karo
    socket.on("messageReceived", (message) => {
      console.log("🔔 chatService received message:", message._id);
      callback(message);
    });
  },
  removeMessageListener: () => {
    socket.off('messageReceived');
  },
  removeDeleteListener: () => {
    socket.off("messageDeleted");
  },
  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
      console.log("Socket Disconnected");
    }
  },
  onUserStatusChanged: (callback) => {
    socket.on("userStatusChanged", (data) => {
      // data = { userId: "123", status: "online", lastSeen: Date }
      callback(data);
    });
  },
  markAsRead: (chatId, userId) => {
    if (socket && socket.connected) {
      socket.emit("markAsRead", { chatId, userId });
    }
  },
  removeStatusListener: () => {
    socket.off("userStatusChanged");
  },
  // Cleanup function taaki memory leak na ho (legacy name)
  removeReceiveListener: () => {
    socket.off('receiveMessage');
  }
};

// Upload helper using existing axios instance
export const uploadFile = async (file) => {
  const form = new FormData();
  form.append('file', file);
  // Backend should expose an endpoint to upload files and return { success, url, type }
  const res = await api.post('/uploads', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
};

// Convenience: send a message that contains a file (url + meta)
export const sendFileMessage = (chatId, senderId, fileMeta) => {
  // fileMeta: { url, name, mimeType, size }
  socket.emit('sendMessage', { chatId, senderId, text: '', file: fileMeta });
};



