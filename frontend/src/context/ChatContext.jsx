// import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// import { chatService } from '../services/chatService';
// import { useCallback } from 'react';
// import { SocketContext } from './SocketContext';

// const ChatContext = createContext(null);

// export const ChatProvider = ({ children }) => {
//   const [chats, setChats] = useState([]);
// const { socket, on, off, myUserId } = useContext(SocketContext);
//   const activeChatIdRef = useRef(null);

//   // 1. Initial Setup: Token parse karna
//   useEffect(() => {
//     try {
//       const token = localStorage.getItem('token');
//       if (token) {
//         const payload = JSON.parse(window.atob(token.split('.')[1] || ''));
//         setMyUserId(payload?.id || payload?._id || null);
//       }
//     } catch (err) {
//       console.warn('ChatProvider: failed to parse token', err);
//     }
//   }, []);

//   // 2. Chats Fetch karne ka logic
//   const refreshChats = useCallback(async () => {
//     if (!myUserId) return;

//     try {
//       const data = await chatService.getMyChats();
//       const normalized = data.map(chat => ({
//         ...chat,
//         participants: chat.participants.map(p => ({
//           ...(p || {}),
//           isOnline: !!p?.isOnline
//         }))
//       }));
//       setChats(normalized);
//     } catch (err) {
//       console.error('Error refreshing chats:', err);
//     }
//   }, [myUserId]);




//   // 3. Mark As Read Logic (WhatsApp jaisa Instant Reset)
//   const markChatAsRead = (idFromUrl) => {
//     if (!idFromUrl || !myUserId) return;

//     setChats(prev => {
//       let changed = false;

//       const updated = prev.map(chat => {
//         const isMatch =
//           chat._id === idFromUrl ||
//           chat.participants?.some(
//             p => (p._id || p).toString() === idFromUrl.toString()
//           );

//         if (!isMatch) return chat;

//         const hasUnread =
//           typeof chat.unreadCount === "number"
//             ? chat.unreadCount > 0
//             : Array.isArray(chat.unreadCount)
//               ? chat.unreadCount.some(
//                 u => (u.userId || u._id) === myUserId && u.count > 0
//               )
//               : false;

//         if (!hasUnread) return chat;

//         changed = true;

//         return {
//           ...chat,
//           unreadCount: Array.isArray(chat.unreadCount)
//             ? chat.unreadCount.map(u =>
//               (u.userId || u._id) === myUserId
//                 ? { ...u, count: 0 }
//                 : u
//             )
//             : 0
//         };
//       });

//       if (!changed) return prev; // 🔥 NO state update if nothing changed

//       chatService.markAsRead(idFromUrl, myUserId);
//       return updated;
//     });
//   };



//   const setActiveChatId = (id) => {
//     activeChatIdRef.current = id;
//     if (id) markChatAsRead(id);
//   };

//  useEffect(() => {
//   if (!socket || !myUserId) return;

//   const sidebarHandler = (updatedChat) => {
//     setChats(prev =>
//       prev.map(chat =>
//         chat._id === updatedChat._id ? updatedChat : chat
//       )
//     );
//   };

//   const messageHandler = (newMsg) => {
//     setChats(prev => {
//       const chatIndex = prev.findIndex(c => c._id === newMsg.chat);
//       if (chatIndex === -1) return prev;

//       const newChats = [...prev];
//       newChats[chatIndex].lastMessage = newMsg;
//       return newChats;
//     });
//   };

//   on("sidebarUpdate", sidebarHandler);
//   on("messageReceived", messageHandler);

//   return () => {
//     off("sidebarUpdate", sidebarHandler);
//     off("messageReceived", messageHandler);
//   };

// }, [socket, myUserId]);




//   // Helpers (Pure functions to avoid mutation)
//   const resetUnreadLogic = (uc, uid) => {
//     if (Array.isArray(uc)) return uc.map(u => (u.userId || u._id) === uid ? { ...u, count: 0 } : u);
//     return 0;
//   };

//   const incrementUnreadLogic = (currentUnread, myUserId) => {
//     if (!currentUnread) return 1;
//     if (typeof currentUnread === 'number') return currentUnread + 1;
//     if (Array.isArray(currentUnread)) {
//       let found = false;
//       const updated = currentUnread.map(u => {
//         if ((u.userId || u._id) === myUserId) {
//           found = true;
//           return { ...u, count: u.count + 1 };
//         }
//         return u;
//       });
//       if (!found) updated.push({ userId: myUserId, count: 1 });
//       return updated;
//     }
//     return 1;
//   };
//   return (
//     <ChatContext.Provider value={{ chats, setChats, refreshChats, setActiveChatId, markChatAsRead, myUserId }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) return { chats: [], setChats: () => { }, refreshChats: () => { }, setActiveChatId: () => { } };
//   return context;
// };
// ChatContext.jsx (Full updated code)
// Added socket listeners for real-time chats update (no refresh)

// import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// import { chatService } from '../services/chatService';
// import { useCallback } from 'react';
// import { SocketContext } from './SocketContext';

// const ChatContext = createContext(null);

// export const ChatProvider = ({ children }) => {
//   const [chats, setChats] = useState([]);
//   const { socket, on, off, myUserId } = useContext(SocketContext);
//   const activeChatIdRef = useRef(null);

//   // 1. Initial Setup: Token parse karna
//   useEffect(() => {
//     try {
//       const token = localStorage.getItem('token');
//       if (token) {
//         const payload = JSON.parse(window.atob(token.split('.')[1] || ''));
//         setMyUserId(payload?.id || payload?._id || null);
//       }
//     } catch (err) {
//       console.warn('ChatProvider: failed to parse token', err);
//     }
//   }, []);

//   // 2. Chats Fetch karne ka logic
//   const refreshChats = useCallback(async () => {
//     if (!myUserId) return;

//     try {
//       const data = await chatService.getMyChats();
//       const normalized = data.map(chat => ({
//         ...chat,
//         participants: chat.participants.map(p => ({
//           ...(p || {}),
//           isOnline: !!p?.isOnline
//         }))
//       }));
//       setChats(normalized);
//     } catch (err) {
//       console.error('Error refreshing chats:', err);
//     }
//   }, [myUserId]);

//   // 3. Mark As Read Logic (WhatsApp jaisa Instant Reset)
//   const markChatAsRead = (idFromUrl) => {
//     if (!idFromUrl || !myUserId) return;

//     setChats(prev => {
//       let changed = false;

//       const updated = prev.map(chat => {
//         const isMatch =
//           chat._id === idFromUrl ||
//           chat.participants?.some(
//             p => (p._id || p).toString() === idFromUrl.toString()
//           );

//         if (!isMatch) return chat;

//         const hasUnread =
//           typeof chat.unreadCount === "number"
//             ? chat.unreadCount > 0
//             : Array.isArray(chat.unreadCount)
//               ? chat.unreadCount.some(
//                 u => (u.userId || u._id) === myUserId && u.count > 0
//               )
//               : false;

//         if (!hasUnread) return chat;

//         changed = true;

//         return {
//           ...chat,
//           unreadCount: Array.isArray(chat.unreadCount)
//             ? chat.unreadCount.map(u =>
//               (u.userId || u._id) === myUserId
//                 ? { ...u, count: 0 }
//                 : u
//             )
//             : 0
//         };
//       });

//       if (!changed) return prev; // 🔥 NO state update if nothing changed

//       chatService.markAsRead(idFromUrl, myUserId);
//       return updated;
//     });
//   };

//   const setActiveChatId = (id) => {
//     activeChatIdRef.current = id;
//     if (id) markChatAsRead(id);
//   };

// useEffect(() => {
//   if (!socket || !myUserId) return;

//   // Sidebar / chat metadata update
//   const handleSidebarUpdate = (updatedChat) => {
//     setChats(prev => 
//       prev.map(chat => 
//         chat._id === updatedChat._id ? { ...chat, ...updatedChat } : chat
//       )
//     );
//   };

//   // New message → lastMessage + unread count increment (if not active chat)
//   const handleNewMessage = (newMsg) => {
//     setChats(prev => {
//       const chatId = newMsg.chat?._id || newMsg.chat;
//       const chatIndex = prev.findIndex(c => c._id === chatId);

//       if (chatIndex === -1) {
//         // New chat aaya (rare case)
//         console.log("New chat detected via socket:", chatId);
//         return [...prev, {
//           _id: chatId,
//           lastMessage: newMsg,
//           lastMessageAt: newMsg.createdAt,
//           unreadCount: [{ userId: myUserId, count: 1 }],
//           participants: newMsg.participants || [] // agar backend bhej raha hai
//         }];
//       }

//       const chat = prev[chatIndex];
//       const isFromMe = (newMsg.sender?._id || newMsg.sender) === myUserId;

//       // Active chat check – Sidebar mein active chatId nahi hota, toh assume increment karo
//       // (better hai MessagesPage se bhi emit kare "activeChatChanged" lekin abhi simple rakhenge)
//       let newUnread = getUnreadCount(chat) || 0;
//       if (!isFromMe) {
//         newUnread += 1;
//       }

//       const updatedChat = {
//         ...chat,
//         lastMessage: newMsg,
//         lastMessageAt: newMsg.createdAt,
//         unreadCount: Array.isArray(chat.unreadCount)
//           ? chat.unreadCount.map(u => 
//               (u.userId || u._id) === myUserId ? { ...u, count: newUnread } : u
//             )
//           : newUnread
//       };

//       const newChats = [...prev];
//       newChats[chatIndex] = updatedChat;

//       // Sort latest message first
//       newChats.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));

//       return newChats;
//     });
//   };

//   // Message seen – unread reset (if needed) + blue tick
//   const handleMessageSeen = ({ messageId, chatId }) => {
//     setChats(prev => prev.map(chat => {
//       if (chat._id !== chatId) return chat;

//       let updatedUnread = getUnreadCount(chat);
//       if (updatedUnread > 0) updatedUnread = 0; // Reset on seen (simple logic)

//       return {
//         ...chat,
//         lastMessage: chat.lastMessage?._id === messageId 
//           ? { ...chat.lastMessage, seen: true } 
//           : chat.lastMessage,
//         unreadCount: updatedUnread
//       };
//     }));
//   };

//   on("sidebarUpdate", handleSidebarUpdate);
//   on("messageReceived", handleNewMessage);
//   on("messageSeen", handleMessageSeen);

//   return () => {
//     off("sidebarUpdate", handleSidebarUpdate);
//     off("messageReceived", handleNewMessage);
//     off("messageSeen", handleMessageSeen);
//   };
// }, [socket, myUserId, on, off]);

//   // Helpers (Pure functions to avoid mutation)
//   const resetUnreadLogic = (uc, uid) => {
//     if (Array.isArray(uc)) return uc.map(u => (u.userId || u._id) === uid ? { ...u, count: 0 } : u);
//     return 0;
//   };

//   const incrementUnreadLogic = (currentUnread, myUserId) => {
//     if (!currentUnread) return 1;
//     if (typeof currentUnread === 'number') return currentUnread + 1;
//     if (Array.isArray(currentUnread)) {
//       let found = false;
//       const updated = currentUnread.map(u => {
//         if ((u.userId || u._id) === myUserId) {
//           found = true;
//           return { ...u, count: u.count + 1 };
//         }
//         return u;
//       });
//       if (!found) updated.push({ userId: myUserId, count: 1 });
//       return updated;
//     }
//     return 1;
//   };
//   return (
//     <ChatContext.Provider value={{ chats, setChats, refreshChats, setActiveChatId, markChatAsRead, myUserId }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) return { chats: [], setChats: () => { }, refreshChats: () => { }, setActiveChatId: () => { } };
//   return context;
// };

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useCallback } from 'react';
// import { SocketContext } from './SocketContext';
// import { chatService } from '../services/chatService';

// const ChatContext = createContext(null);

// export const ChatProvider = ({ children }) => {
//   const [chats, setChats] = useState([]);
//   const [activeChatId, setActiveChatId] = useState(null); // Changed from ref to state
//   const [myUserId, setMyUserId] = useState(null);
//   const { socket, on, off } = useContext(SocketContext);

//   // Parse token for myUserId
//   useEffect(() => {
//     try {
//       const token = localStorage.getItem('token');
//       if (token) {
//         const payload = JSON.parse(window.atob(token.split('.')[1] || ''));
//         setMyUserId(payload?.id || payload?._id || null);
//       }
//     } catch (err) {
//       console.warn('ChatProvider: failed to parse token', err);
//     }
//   }, []);

//   // Refresh chats
//   const refreshChats = useCallback(async () => {
//     if (!myUserId) return;
//     try {
//       const data = await chatService.getMyChats();
//       const normalized = data.map(chat => ({
//         ...chat,
//         participants: chat.participants.map(p => ({
//           ...(p || {}),
//           isOnline: !!p?.isOnline
//         }))
//       }));
//       setChats(normalized);
//     } catch (err) {
//       console.error('Error refreshing chats:', err);
//     }
//   }, [myUserId]);

//   // Mark as read
//   const markChatAsRead = (idFromUrl) => {
//     if (!idFromUrl || !myUserId) return;
//     setChats(prev => prev.map(chat => {
//       if (chat._id !== idFromUrl) return chat;
//       return {
//         ...chat,
//         unreadCount: Array.isArray(chat.unreadCount)
//           ? chat.unreadCount.map(u => (u.userId || u._id) === myUserId ? { ...u, count: 0 } : u)
//           : 0
//       };
//     }));
//     chatService.markAsRead(idFromUrl, myUserId);
//   };

//   // Centralized getUnreadCount
//   const getUnreadCount = (chat) => {
//     if (!chat) return 0;
//     const uc = chat.unreadCount;
//     if (typeof uc === 'number') return uc;
//     if (Array.isArray(uc)) {
//       const myEntry = uc.find(item => (item.userId?.toString() === myUserId?.toString()) || (item._id?.toString() === myUserId?.toString()));
//       return myEntry ? myEntry.count : 0;
//     }
//     if (typeof uc === 'object' && uc !== null) {
//       return uc[myUserId] || uc.count || 0;
//     }
//     return 0;
//   };

//   // Centralized socket listeners (moved from UserSidebar and MessagesPage)
//   useEffect(() => {
//     if (!socket || !myUserId) return;

//     const handleSidebarUpdate = (updatedChat) => {
//       setChats(prev => prev.map(chat => chat._id === updatedChat._id ? { ...chat, ...updatedChat } : chat));
//     };

//     const handleNewMessage = (newMsg) => {
//       const msgChatId = newMsg.chat?._id || newMsg.chat;
//       const isFromOther = (newMsg.sender?._id || newMsg.sender) !== myUserId;
//       const isActive = activeChatId === msgChatId; // Now using state, reactive
//       if (isFromOther && !isActive) {
//         setChats(prev => prev.map(chat => {
//           if (chat._id !== msgChatId) return chat;
//           let unread = getUnreadCount(chat) || 0;
//           unread += 1;
//           return {
//             ...chat,
//             unreadCount: Array.isArray(chat.unreadCount)
//               ? chat.unreadCount.map(u => (u.userId || u._id) === myUserId ? { ...u, count: unread } : u)
//               : unread,
//             lastMessage: newMsg,
//             lastMessageAt: newMsg.createdAt
//           };
//         }));
//       } else if (isActive) {
//         // If active, mark as read immediately
//         markChatAsRead(msgChatId);
//       }
//     };

//     const handleMessageSeen = ({ messageId, chatId }) => {
//       setChats(prev => prev.map(chat => {
//         if (chat._id !== chatId) return chat;
//         return {
//           ...chat,
//           lastMessage: chat.lastMessage?._id === messageId ? { ...chat.lastMessage, seen: true } : chat.lastMessage,
//           unreadCount: 0 // Reset on seen
//         };
//       }));
//     };

//     on("sidebarUpdate", handleSidebarUpdate);
//     on("messageReceived", handleNewMessage);
//     on("messageSeen", handleMessageSeen);

//     return () => {
//       off("sidebarUpdate", handleSidebarUpdate);
//       off("messageReceived", handleNewMessage);
//       off("messageSeen", handleMessageSeen);
//     };
//   }, [socket, myUserId, activeChatId, on, off]);

//   return (
//     <ChatContext.Provider value={{ chats, setChats, refreshChats, activeChatId, setActiveChatId, markChatAsRead, myUserId, getUnreadCount }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => useContext(ChatContext) || { chats: [], setChats: () => {}, refreshChats: () => {}, activeChatId: null, setActiveChatId: () => {}, markChatAsRead: () => {}, myUserId: null, getUnreadCount: () => 0 };

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