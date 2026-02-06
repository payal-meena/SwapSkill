
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
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
    transports: ['websocket', 'polling'],
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

  // Get reference to socket (for external listeners)
  get socket() {
    return socket;
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
      console.log("🔌 Initializing socket for userId:", userId);
      socket = initSocket(userId);
    }
    
    // If already connected, skip
    if (socket?.connected) {
      console.log('✅ Socket already connected');
      return;
    }

    console.log("🔄 Connecting socket...");
    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Connected to Socket. ID:', socket.id, 'userId:', userId);
      // Emit that user is online
      socket.emit('userOnline', { userId });
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket Connection Error:', err?.message || err);
      // Auto-retry after delay
      setTimeout(() => {
        if (socket && !socket.connected) {
          console.log('🔄 Retrying socket connection...');
          socket.connect();
        }
      }, 3000);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Socket Disconnected:', reason);
      // Auto-reconnect if not manually disconnected
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        setTimeout(() => {
          if (socket && !socket.connected) {
            console.log('🔄 Attempting to reconnect...');
            socket.connect();
          }
        }, 2000);
      }
    });
  },

  // Chat room join karne ke liye
  joinChat: (chatId, userId) => {
    if (!socket || !socket.connected) {
      console.warn('⚠️ Socket not connected, cannot join chat:', chatId);
      return;
    }
    socket.emit("joinChat", { chatId, userId });
  },


  // Naye message "sunne" (listen) karne ke liye
  // services/chatService.js update karo

  // Message emit karne ke liye (supports both object and params)
  sendMessage: (chatIdOrData, senderId, text) => {
    if (!socket) return;
    if (typeof chatIdOrData === 'object') {
      socket.emit('sendMessage', chatIdOrData);
    } else {
      socket.emit('sendMessage', { chatId: chatIdOrData, senderId, text });
    }
  },

  // Upload a file via HTTP and emit a file message over socket
  sendFile: async (chatId, senderId, file) => {
    if (!file) throw new Error('No file provided');
    try {
      // Use the helper defined at bottom to upload
      const res = await uploadFile(file);
      const fileUrl = res?.url || res?.path || res?.data?.url || res?.data?.path;
      
      if (!fileUrl) {
        throw new Error('File upload failed - no URL returned');
      }
      
      const fileMeta = { 
        url: fileUrl, 
        name: file.name, 
        mimeType: file.type, 
        size: file.size 
      };
      
      // Emit file message via socket
      if (socket && socket.connected) {
        socket.emit('sendMessage', { 
          chatId, 
          senderId, 
          text: file.name,
          file: fileMeta 
        });
        console.log('📁 File message emitted:', file.name);
      } else {
        console.warn('⚠️ Socket not connected, file message may not be sent');
      }
      
      return fileMeta;
    } catch (err) {
      console.error('File send error:', err);
      throw err;
    }
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
    if (!socket) {
      console.warn("⚠️ Socket not initialized, cannot register listener");
      return;
    }
    
    console.log("📡 Setting up messageReceived listener, socket connected:", socket.connected);
    
    // Don't remove previous listeners - multiple components can listen
    // Just add this new listener
    socket.on("messageReceived", (message) => {
      console.log("🔔 chatService received message:", message._id, "chat:", message.chat);
      try { callback(message); } catch (err) { console.error('chatService callback error', err); }
    });
  },
  removeMessageListener: (callback) => {
    if (!socket) return;
    if (typeof callback === 'function') {
      socket.off('messageReceived', callback);
    } else {
      socket.off('messageReceived');
    }
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
// Sidebar update ke liye backend se signal sunna
  onSidebarUpdate: (callback) => {
    if (!socket) return;
    // Don't remove previous listeners - just add this one
    socket.on("sidebarUpdate", (data) => {
      console.log("🔔 Sidebar Update Received:", data._id);
      callback(data);
    });
  },

  // Listen for new chat created (when connection accepted)
  onChatCreated: (callback) => {
    if (!socket) return;
    socket.on('chatCreated', (data) => {
      console.log('🆕 chatService received chatCreated:', data._id);
      try { callback(data); } catch (err) { console.error('onChatCreated callback error', err); }
    });
  },

  removeChatCreatedListener: () => {
    if (socket) socket.off('chatCreated');
  },

  // Cleanup ke liye
  removeSidebarUpdateListener: () => {
    if (socket) socket.off("sidebarUpdate");
  },

  // Emit a manual logout to the server and disconnect socket
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
  // Listen for message updates (edits)
  onMessageUpdated: (callback) => {
    if (!socket) return;
    socket.on('messageUpdated', (data) => {
      try { callback(data); } catch (err) { console.error('onMessageUpdated callback error', err); }
    });
  },
  removeMessageUpdatedListener: (callback) => {
    if (!socket) return;
    if (typeof callback === 'function') socket.off('messageUpdated', callback);
    else socket.off('messageUpdated');
  },
  // Listen for chat cleared
  onChatCleared: (callback) => {
    socket.on('chatCleared', callback);
  },
  // Listen for chat deleted
  onChatDeleted: (callback) => {
    socket.on('chatDeleted', callback);
  },
  // Listen for chat muted
  onChatMuted: (callback) => {
    socket.on('chatMuted', callback);
  },
  // Listen for unread count update
  onUnreadCountUpdated: (callback) => {
    socket.on('unreadCountUpdated', callback);
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
  // Listen for seen receipts
  onMessageSeen: (callback) => {
    if (!socket) return;
    socket.on('messageSeen', (data) => {
      try { callback(data); } catch (err) { console.error('onMessageSeen callback error', err); }
    });
  },
  removeMessageSeenListener: (callback) => {
    if (!socket) return;
    if (typeof callback === 'function') socket.off('messageSeen', callback);
    else socket.off('messageSeen');
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



