
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SocketContext } from './SocketContext';
import { chatService } from '../services/chatService';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chats, setChats]         = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [myUserId, setMyUserId]   = useState(null);
  const { socket, on, off } = useContext(SocketContext);

  // Parse myUserId once
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1] || ''));
        setMyUserId(payload?.id || payload?._id || null);
      }
    } catch (err) {
      console.warn('ChatProvider: failed to parse token', err);
    }
  }, []);

  // Auto-refresh chats when myUserId becomes available
  useEffect(() => {
    if (myUserId) {
      refreshChats();
    }
  }, [myUserId]);

  const refreshChats = useCallback(async () => {
    if (!myUserId) return;
    try {
      const data = await chatService.getMyChats();
      setChats(data || []); // ← no need to normalize every time unless backend changed format
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  }, [myUserId]);

  // Reliable unread count helper (used everywhere)
  const getUnreadCount = (chat) => {
    if (!chat?.unreadCount) return 0;
    const uc = chat.unreadCount;

    if (typeof uc === 'number') return uc;
    if (Array.isArray(uc)) {
      const entry = uc.find(
        item => String(item.userId || item._id || item.id) === String(myUserId)
      );
      return entry?.count ?? 0;
    }
    if (uc && typeof uc === 'object') {
      return uc[myUserId] ?? uc.count ?? 0;
    }
    return 0;
  };

  const markChatAsRead = useCallback((chatId) => {
    if (!chatId || !myUserId) return;

    setChats(prev =>
      prev.map(chat => {
        if (String(chat._id) !== String(chatId)) return chat;

        const newUnread = Array.isArray(chat.unreadCount)
          ? chat.unreadCount.map(u =>
              String(u.userId || u._id) === String(myUserId) ? { ...u, count: 0 } : u
            )
          : 0;

        return { ...chat, unreadCount: newUnread };
      })
    );

    // Call backend (fire and forget — no await needed in most cases)
    chatService.markAsRead(chatId, myUserId).catch(err =>
      console.warn('markAsRead failed:', err)
    );
  }, [myUserId]);

  // Socket listeners — central place
  useEffect(() => {
    if (!socket || !myUserId) return;

    const handleNewMessage = (msg) => {
      const chatId   = msg.chat?._id || msg.chat;
      const senderId = msg.sender?._id || msg.sender;
      const isFromMe = String(senderId) === String(myUserId);

      setChats(prev => {
        let found = false;
        const updated = prev.map(chat => {
          if (String(chat._id) !== String(chatId)) return chat;
          found = true;

          const currentUnread = getUnreadCount(chat);
          const shouldIncrement = !isFromMe && String(activeChatId) !== String(chatId);

          let newUnread = currentUnread;
          if (shouldIncrement) newUnread += 1;

          return {
            ...chat,
            lastMessage   : msg,
            lastMessageAt : msg.createdAt || new Date(),
            unreadCount   : Array.isArray(chat.unreadCount)
              ? chat.unreadCount.map(u =>
                  String(u.userId || u._id) === String(myUserId)
                    ? { ...u, count: newUnread }
                    : u
                )
              : newUnread
          };
        });

        // New chat (rare, but handle it)
        if (!found && !isFromMe) {
          // You can either ignore or add placeholder chat
          // Most apps fetch full list again → simplest is to call refreshChats()
          refreshChats();
          return prev;
        }

        // Sort by last message (latest first)
        return updated.sort((a, b) =>
          new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
        );
      });
    };

    const handleMessageSeen = ({ chatId, messageId }) => {
      setChats(prev =>
        prev.map(chat => {
          if (String(chat._id) !== String(chatId)) return chat;
          return {
            ...chat,
            lastMessage:
              chat.lastMessage?._id === messageId
                ? { ...chat.lastMessage, seen: true, read: true }
                : chat.lastMessage,
            unreadCount: 0
          };
        })
      );
    };

    const handleSidebarUpdate = (updatedChat) => {
      setChats(prev =>
        prev.map(c => (String(c._id) === String(updatedChat._id) ? { ...c, ...updatedChat } : c))
      );
    };

    on('messageReceived', handleNewMessage);
    on('messageSeen',     handleMessageSeen);
    on('sidebarUpdate',   handleSidebarUpdate);

    return () => {
      off('messageReceived', handleNewMessage);
      off('messageSeen',     handleMessageSeen);
      off('sidebarUpdate',   handleSidebarUpdate);
    };
  }, [socket, myUserId, activeChatId, on, off, refreshChats]);

  const value = {
    chats,
    setChats,
    refreshChats,
    activeChatId,
    setActiveChatId,
    markChatAsRead,
    myUserId,
    getUnreadCount,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    console.warn('useChat must be used inside ChatProvider');
    return {
      chats: [],
      setChats: () => {},
      refreshChats: () => Promise.resolve(),
      activeChatId: null,
      setActiveChatId: () => {},
      markChatAsRead: () => {},
      myUserId: null,
      getUnreadCount: () => 0,
    };
  }
  return context;
};