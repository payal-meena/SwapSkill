import React, { createContext, useContext, useState, useEffect } from 'react';
import { chatService } from '../services/chatService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const myUserId = localStorage.getItem('token') ? JSON.parse(window.atob(localStorage.getItem('token').split('.')[1])).id : null;

  useEffect(() => {
    if (!myUserId) return;

    // Background mein chats load karna (normalize online flags)
    chatService.getMyChats().then(data => {
      const normalized = data.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => ({
          ...(p || {}),
          // Keep server-provided isOnline as authoritative
          isOnline: !!p?.isOnline
        }))
      }));
      setChats(normalized);
    });

    // Global Listeners: Jo hamesha chalenge chahe aap kisi bhi page par ho
    chatService.onUserStatusChanged(({ userId, status, lastSeen }) => {
      setChats(prev => prev.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => 
          (p._id || p) === userId ? { ...p, isOnline: status === 'online', lastSeen } : p
        )
      })));
    });

    // Real-time message update for sidebar
    chatService.onMessageReceived((newMsg) => {
      setChats(prev => {
        const updated = prev.map(chat => {
          if (chat._id === (newMsg.chat?._id || newMsg.chat)) {
            return { ...chat, lastMessage: newMsg, updatedAt: new Date() };
          }
          return chat;
        });
        return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    });

    return () => {
      chatService.removeStatusListener();
      chatService.removeMessageListener();
    };
  }, [myUserId]);

  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);