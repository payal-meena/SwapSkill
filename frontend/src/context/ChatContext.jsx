import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import { useCallback } from 'react';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [myUserId, setMyUserId] = useState(null);
  const activeChatIdRef = useRef(null);

  // 1. Initial Setup: Token parse karna
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(window.atob(token.split('.')[1] || ''));
        setMyUserId(payload?.id || payload?._id || null);
      }
    } catch (err) {
      console.warn('ChatProvider: failed to parse token', err);
    }
  }, []);

  // 2. Chats Fetch karne ka logic
const refreshChats = useCallback(async () => {
  if (!myUserId) return;

  try {
    const data = await chatService.getMyChats();
    const normalized = data.map(chat => ({
      ...chat,
      participants: chat.participants.map(p => ({
        ...(p || {}),
        isOnline: !!p?.isOnline
      }))
    }));
    setChats(normalized);
  } catch (err) {
    console.error('Error refreshing chats:', err);
  }
}, [myUserId]);




  // 3. Mark As Read Logic (WhatsApp jaisa Instant Reset)
const markChatAsRead = (idFromUrl) => {
  if (!idFromUrl || !myUserId) return;

  setChats(prev => {
    let changed = false;

    const updated = prev.map(chat => {
      const isMatch =
        chat._id === idFromUrl ||
        chat.participants?.some(
          p => (p._id || p).toString() === idFromUrl.toString()
        );

      if (!isMatch) return chat;

      const hasUnread =
        typeof chat.unreadCount === "number"
          ? chat.unreadCount > 0
          : Array.isArray(chat.unreadCount)
            ? chat.unreadCount.some(
                u => (u.userId || u._id) === myUserId && u.count > 0
              )
            : false;

      if (!hasUnread) return chat;

      changed = true;

      return {
        ...chat,
        unreadCount: Array.isArray(chat.unreadCount)
          ? chat.unreadCount.map(u =>
              (u.userId || u._id) === myUserId
                ? { ...u, count: 0 }
                : u
            )
          : 0
      };
    });

    if (!changed) return prev; // 🔥 NO state update if nothing changed

    chatService.markAsRead(idFromUrl, myUserId);
    return updated;
  });
};



  const setActiveChatId = (id) => {
    activeChatIdRef.current = id;
    if (id) markChatAsRead(id);
  };

useEffect(() => {
  if (!myUserId) return;

 const sidebarHandler = ({ chatId, unreadCount }) => {
  setChats(prev =>
    prev.map(chat => {
      if (chat._id !== chatId) return chat;

      // 🔥 IMPORTANT: Only update if value actually changed
      if (JSON.stringify(chat.unreadCount) === JSON.stringify(unreadCount)) {
        return chat; // no change → no re-render
      }

      return { ...chat, unreadCount };
    })
  );
};


  const handleNewMsg = (newMsg) => {
    const msgChatId = newMsg.chat?._id || newMsg.chat;
    const senderId = newMsg.sender?._id || newMsg.sender;
    const isFromOther = senderId !== myUserId;

    setChats(prev => {
      const chatIndex = prev.findIndex(c => c._id === msgChatId);
      if (chatIndex === -1) return prev;

      const newChats = [...prev];
      const targetChat = { ...newChats[chatIndex] };

      targetChat.lastMessage = newMsg;
      targetChat.lastMessageAt = newMsg.createdAt || new Date().toISOString();

      if (isFromOther) {
        targetChat.unreadCount = incrementUnreadLogic(
          targetChat.unreadCount,
          myUserId
        );
      }

      newChats[chatIndex] = targetChat;

      return [...newChats].sort(
        (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
      );
    });
  };

  chatService.socket?.off('onSidebarUpdate', sidebarHandler);
  chatService.socket?.on('onSidebarUpdate', sidebarHandler);

  chatService.removeMessageListener?.(handleNewMsg);
  chatService.onMessageReceived?.(handleNewMsg);

  return () => {
    chatService.socket?.off('onSidebarUpdate', sidebarHandler);
    chatService.removeMessageListener?.(handleNewMsg);
  };

}, [myUserId]);



  // Helpers (Pure functions to avoid mutation)
  const resetUnreadLogic = (uc, uid) => {
    if (Array.isArray(uc)) return uc.map(u => (u.userId || u._id) === uid ? { ...u, count: 0 } : u);
    return 0;
  };

  const incrementUnreadLogic = (currentUnread, myUserId) => {
    if (!currentUnread) return 1;
    if (typeof currentUnread === 'number') return currentUnread + 1;
    if (Array.isArray(currentUnread)) {
      let found = false;
      const updated = currentUnread.map(u => {
        if ((u.userId || u._id) === myUserId) {
          found = true;
          return { ...u, count: u.count + 1 };
        }
        return u;
      });
      if (!found) updated.push({ userId: myUserId, count: 1 });
      return updated;
    }
    return 1;
  };
  return (
    <ChatContext.Provider value={{ chats, setChats, refreshChats, setActiveChatId, markChatAsRead, myUserId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) return { chats: [], setChats: () => { }, refreshChats: () => { }, setActiveChatId: () => { } };
  return context;
};