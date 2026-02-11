import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';

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
  const refreshChats = async () => {
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
  };

  // 3. Mark As Read Logic (WhatsApp jaisa Instant Reset)
  const markChatAsRead = (idFromUrl) => {
    if (!idFromUrl || !myUserId) return;

    setChats(prev => prev.map(chat => {
      // Check if URL ID is Chat ID or Participant's ID
      const isMatch = chat._id === idFromUrl || 
                      chat.participants?.some(p => (p._id || p).toString() === idFromUrl.toString());
      
      if (isMatch) {
        // Backend call (Debounced inside service if needed)
        chatService.markAsRead(chat._id, myUserId); 

        // UI Reset: Bina refresh badge zero
        return {
          ...chat,
          unreadCount: Array.isArray(chat.unreadCount)
            ? chat.unreadCount.map(u => (u.userId || u._id) === myUserId ? { ...u, count: 0 } : u)
            : 0
        };
      }
      return chat;
    }));
  };

  const setActiveChatId = (id) => {
    activeChatIdRef.current = id;
    if (id) markChatAsRead(id);
  };

  // 4. Real-time Socket Listeners
  useEffect(() => {
    if (!myUserId) return;

    chatService.connectSocket(myUserId);
    refreshChats();

    // Listener: Jab koi dusra user message dekhe (Sidebar Sync)
    // Aapke console mein 'onSidebarUpdate' isi liye aa raha tha
    chatService.socket?.on('onSidebarUpdate', ({ chatId, unreadCount }) => {
      setChats(prev => prev.map(chat => 
        chat._id === chatId ? { ...chat, unreadCount } : chat
      ));
    });

    // Online Status Handler
    chatService.onUserStatusChanged?.(({ userId, status, lastSeen }) => {
      setChats(prev => prev.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => 
          (p._id || p) === userId ? { ...p, isOnline: status === 'online', lastSeen } : p
        )
      })));
    });

    // New Message Handler
    const handleNewMsg = (newMsg) => {
      const msgChatId = newMsg.chat?._id || newMsg.chat;
      const senderId = newMsg.sender?._id || newMsg.sender;
      const isFromOther = senderId !== myUserId;

      setChats(prev => {
        const chatIndex = prev.findIndex(c => c._id === msgChatId);
        
        // Agar naya chat hai jo list mein nahi hai
        if (chatIndex === -1) { 
          refreshChats(); 
          return prev; 
        }

        const newChats = [...prev];
        const targetChat = { ...newChats[chatIndex] };
        targetChat.lastMessage = newMsg;
        targetChat.lastMessageAt = newMsg.createdAt || new Date().toISOString();

        if (isFromOther) {
          const isChatOpen = activeChatIdRef.current === msgChatId || activeChatIdRef.current === senderId;
          
          if (isChatOpen) {
            chatService.markAsRead(msgChatId, myUserId);
            targetChat.unreadCount = resetUnreadLogic(targetChat.unreadCount, myUserId);
          } else {
            targetChat.unreadCount = incrementUnreadLogic(targetChat.unreadCount, myUserId);
          }
        }

        newChats[chatIndex] = targetChat;
        // Sort: Latest message upar aaye
        return [...newChats].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      });
    };

    chatService.onMessageReceived(handleNewMsg);

    return () => {
      chatService.socket?.off('onSidebarUpdate');
      try { chatService.removeStatusListener?.(); } catch (e) { }
      try { chatService.removeMessageListener(handleNewMsg); } catch (e) { }
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
  if (!context) return { chats: [], setChats: () => {}, refreshChats: () => {}, setActiveChatId: () => {} };
  return context;
};