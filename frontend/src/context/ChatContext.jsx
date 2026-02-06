import React, { createContext, useContext, useState, useEffect } from 'react';
import { chatService } from '../services/chatService';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
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

  useEffect(() => {
    if (!myUserId) return;

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
      chatService.onMessageReceived?.((newMsg) => {
        console.log('📨 ChatContext: Message received for chat:', newMsg.chat?._id || newMsg.chat);
        
        // Get current userId from token
        let myUserId = null;
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const payload = JSON.parse(window.atob(token.split('.')[1] || ''));
            myUserId = payload?.id || payload?._id || null;
          }
        } catch (err) {
          console.warn('ChatContext: Failed to get userId from token');
        }
        
        const msgChatId = newMsg.chat?._id || newMsg.chat;
        const isFromOther = (newMsg.sender?._id || newMsg.sender) !== myUserId;
        
        setChats(prev => {
          const updated = prev.map(chat => {
            if (chat._id === msgChatId) {
              console.log('📨 ChatContext: Updating chat:', chat._id, 'with new message, isFromOther:', isFromOther);
              
              // Update unread count if message is from other user
              let updatedUnreadCount = chat.unreadCount || [];
              if (isFromOther) {
                const userUnreadIndex = updatedUnreadCount.findIndex(u => (u.userId || u._id || u.id) === myUserId);
                if (userUnreadIndex >= 0) {
                  updatedUnreadCount = updatedUnreadCount.map((u, idx) => 
                    idx === userUnreadIndex ? { ...u, count: (u.count || 0) + 1 } : u
                  );
                } else {
                  updatedUnreadCount = [...updatedUnreadCount, { userId: myUserId, count: 1 }];
                }
                console.log('📨 ChatContext: Updated unreadCount:', updatedUnreadCount);
              }
              
              return { 
                ...chat, 
                lastMessage: newMsg, 
                updatedAt: new Date(),
                unreadCount: updatedUnreadCount
              };
            }
            return chat;
          });
          return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
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
    <ChatContext.Provider value={{ chats, setChats }}>
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