import React, { createContext, useContext, useState, useEffect } from 'react';
import { chatService } from '../services/chatService';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const activeChatIdRef = React.useRef(null);
  let myUserId = null;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1] || ''));
      myUserId = payload?.id || payload?._id || null;
    }
  } catch (err) {
    // If token is malformed, don't crash the provider
    console.warn('ChatProvider: failed to parse token', err);
    myUserId = null;
  }
  const setActiveChatId = (id) => {
    activeChatIdRef.current = id;
  };
const refreshChats = async () => {
    if (!myUserId) return;
    try {
      const data = await chatService.getMyChats();
      const normalized = data.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => ({ ...(p || {}), isOnline: !!p?.isOnline }))
      }));
      setChats(normalized);
    } catch (err) {
      console.error('Error refreshing chats:', err);
    }
  };
  useEffect(() => {
    if (!myUserId) return;
refreshChats();
    // Ensure socket is connected
    chatService.connectSocket(myUserId);

    // Background mein chats load karna (normalize online flags)
    chatService.getMyChats()
      .then(data => {
        console.log('📚 Chats loaded from server:', data);
        const normalized = data.map(chat => ({
          ...chat,
          participants: chat.participants.map(p => ({
            ...(p || {}),
            // Keep server-provided isOnline as authoritative
            isOnline: !!p?.isOnline
          }))
        }));
        console.log('📚 Normalized chats with unreadCount:', normalized.map(c => ({ id: c._id, unreadCount: c.unreadCount })));
        setChats(normalized);
      })
      .catch(err => {
        console.error('❌ Error loading chats:', err);
      });

    // Global Listeners: register safely (socket may not be initialized yet)
    try {
      chatService.onUserStatusChanged?.(({ userId, status, lastSeen }) => {
        setChats(prev => prev.map(chat => ({
          ...chat,
          participants: chat.participants.map(p => 
            (p._id || p) === userId ? { ...p, isOnline: status === 'online', lastSeen } : p
          )
        })));
      });
    } catch (err) {
      console.warn('ChatProvider: onUserStatusChanged registration failed', err);
    }

    // Real-time message update for sidebar
    try {
  // ChatProvider.js ke andar handleNewMessage listener ko isse replace karo:
// ChatProvider.js ke andar onMessageReceived ko aise update karo:

// ChatProvider.js ke andar onMessageReceived listener ko update karo
// ChatContext.jsx ke andar onMessageReceived listener ko isse replace karein
chatService.onMessageReceived?.((newMsg) => {
  const msgChatId = newMsg.chat?._id || newMsg.chat;
  const isFromOther = (newMsg.sender?._id || newMsg.sender) !== myUserId;

  setChats(prev => {
    const chatIndex = prev.findIndex(c => c._id === msgChatId);
    
    // Agar chat list mein nahi hai (Naya connection)
    if (chatIndex === -1) {
      // API se puri list firse mangao taaki naya banda list mein aa jaye
      refreshChats(); 
      return prev;
    }

    const newChats = [...prev];
    const targetChat = { ...newChats[chatIndex] };

    targetChat.lastMessage = newMsg;
    targetChat.lastMessageAt = newMsg.createdAt || new Date().toISOString();

    // 🔔 REAL-TIME COUNT UPDATE:
    if (isFromOther) {
      const isChatOpen = activeChatIdRef.current === msgChatId;
      if (!isChatOpen) {
        // Simple logic for unread count
        if (typeof targetChat.unreadCount === 'number') {
          targetChat.unreadCount += 1;
        } else if (Array.isArray(targetChat.unreadCount)) {
          const updatedUnread = [...targetChat.unreadCount];
          const idx = updatedUnread.findIndex(u => (u.userId || u._id) === myUserId);
          if (idx >= 0) {
            updatedUnread[idx] = { ...updatedUnread[idx], count: (updatedUnread[idx].count || 0) + 1 };
          } else {
            updatedUnread.push({ userId: myUserId, count: 1 });
          }
          targetChat.unreadCount = updatedUnread;
        }
      }
    }

    newChats[chatIndex] = targetChat;
    // Latest message waali chat upar laane ke liye sort
    return [...newChats].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
  });
});
    } catch (err) {
      console.warn('ChatProvider: onMessageReceived registration failed', err);
    }

    return () => {
      try { chatService.removeStatusListener?.(); } catch (e) { }
      try { chatService.removeMessageListener?.(); } catch (e) { }
    };
  }, [myUserId]);

  return (
    <ChatContext.Provider value={{ chats, setChats,refreshChats,setActiveChatId}}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined || context === null) {
    console.warn('useChat must be used within ChatProvider');
    return { chats: [], setChats: () => {} };
  }
  return context;
};