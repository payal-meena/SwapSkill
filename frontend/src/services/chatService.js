
import api from './api';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000", {
autoConnect: false,
  reconnection: true,
  transports: ['websocket'],});

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
    // Agar socket pehle se connected hai, toh dobara connect mat karo
    if (socket?.connected) return;

    // Naya connection banayein
    socket.io.opts.query = { userId };
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to Socket. ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket Connection Error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Socket Disconnected:", reason);
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

  // ✅ Naya: Message deleted event "sunne" ke liye
  onMessageDeleted: (callback) => {
    socket.on("messageDeleted", (data) => {
      callback(data);
    });
  },

  // Naye message "sunne" ke liye
  onMessageReceived: (callback) => {
    // Backend se match karne ke liye 'messageReceived' use karo
    socket.on("messageReceived", (message) => {
      callback(message);
    });
  },

  removeMessageListener: () => {
    socket.off("messageReceived");
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



  // Cleanup function taaki memory leak na ho
  removeMessageListener: () => {
    socket.off("receiveMessage");
  }
};



