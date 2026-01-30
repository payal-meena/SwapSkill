import api from './api';
import { io } from 'socket.io-client';

// Socket connection (Server URL change kar lena agar zaroorat ho)
const socket = io("http://localhost:3000", {
    autoConnect: false,
});

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
  connectSocket: (userId) => {
    if (!socket.connected) {
      socket.connect();
      console.log("Socket Connected");
    }
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
  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
      console.log("Socket Disconnected");
    }
  },

 

  // Cleanup function taaki memory leak na ho
  removeMessageListener: () => {
    socket.off("receiveMessage");
  }
};