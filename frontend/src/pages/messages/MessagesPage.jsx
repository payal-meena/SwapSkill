import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chatService';
import { skillService } from '../../services/skillService';
import { Search, Send, Trash2, Edit2, X, Check, Smile, AlertCircle, Video, Paperclip, MoreVertical, Bell, BellOff, ArrowLeft, Download, Reply } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import Avatar from '../../components/common/Avatar';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const getMyId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload.id || payload._id;
  } catch (e) { return null; }
};

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pendingFile, setPendingFile] = useState(null);
  const [inputText, setInputText] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [deleteStep, setDeleteStep] = useState('none');
  const [deleteTarget, setDeleteTarget] = useState({ msgId: null, isMe: false });
  const [tempDeleteMode, setTempDeleteMode] = useState(null);
  const [openSidebarMenuId, setOpenSidebarMenuId] = useState(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [chatConfirm, setChatConfirm] = useState({ isOpen: false, type: null, chatId: null });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Reply feature states
  const [replyTo, setReplyTo] = useState(null);

  // Download toast state
  const [toastMessage, setToastMessage] = useState("");

  const myUserId = getMyId();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef();
  const fileInputRef = useRef();
  const activeChatIdRef = useRef(null);
  const activeChatRef = useRef(null);

  // Refs for scrolling to messages
  const messageRefs = useRef({});

  const activeChatFromList = React.useMemo(() => {
    if (!activeChat) return null;
    return chats.find(c => c._id === activeChat._id) || activeChat;
  }, [chats, activeChat]);

  // Toast auto hide
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleDownload = (url, fileName) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage("Downloaded");
  };

  // Set reply (WhatsApp style)
  const handleSetReply = (message) => {
    const senderName = (message.sender?._id || message.sender) === myUserId ? "You" : (otherUser?.name || "User");

    let content = message.text || "";
    if (message.file) {
      if (message.file.mimeType?.startsWith('image/')) {
        content = "Photo";
      } else if (message.file.mimeType === 'application/pdf') {
        content = `PDF • ${message.file.name || 'document.pdf'}`;
      } else {
        content = message.file.name || "Attachment";
      }
    }

    setReplyTo({
      messageId: message._id,
      content: content,
      senderName,
      isMe: (message.sender?._id || message.sender) === myUserId
    });

    // Focus input
    setTimeout(() => {
      document.querySelector('input[placeholder="Type a message..."]')?.focus();
    }, 100);
  };
  const scrollToOriginalMessage = (messageId) => {
    const messageElement = messageRefs.current[messageId];

    if (!messageElement) return;

    messageElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    // Animation re-trigger fix
    setHighlightedMessageId(null);

    setTimeout(() => {
      setHighlightedMessageId(messageId);
    }, 100);

    setTimeout(() => {
      setHighlightedMessageId(null);
    }, 2200);
  };



  // Function to get quoted content from messages state



  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getUnreadCount = (chat) => {
    if (!chat) return 0;
    const uc = chat.unreadCount;
    if (uc == null) return 0;
    if (typeof uc === 'number') return uc;
    if (Array.isArray(uc)) {
      const item = uc.find(u => (u.userId || u._id || u.id) === myUserId);
      return item?.count || 0;
    }
    if (typeof uc === 'object') {
      const key = myUserId;
      if (uc[key] != null) return uc[key];
      return uc.count || 0;
    }
    return 0;
  };

  const formatLastSeen = (dateString) => {
    if (!dateString) return "unknown";
    const d = new Date(dateString);
    const diff = Date.now() - d.getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return 'just now';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    return d.toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const isRecentlyOnline = (user) => {
    if (!user) return false;
    return !!user.isOnline;
  };

  const getUniqueChats = (allChats) => {
    const uniqueMap = new Map();
    allChats.forEach(chat => {
      const otherUser = chat.participants.find(p => (p._id || p) !== myUserId);
      const otherId = otherUser?._id || otherUser;
      if (otherId) {
        const existing = uniqueMap.get(otherId);
        if (!existing || new Date(chat.lastMessageAt || 0) > new Date(existing.lastMessageAt || 0)) {
          uniqueMap.set(otherId, chat);
        }
      }
    });
    return Array.from(uniqueMap.values());
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!myUserId) return;
    const loadInitialData = async () => {
      const data = await chatService.getMyChats();
      const normalized = data.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => ({
          ...(p || {}),
          isOnline: !!p?.isOnline
        }))
      }));
      const uniqueChats = getUniqueChats(normalized);
      setChats(uniqueChats);
    };
    chatService.connectSocket(myUserId);
    const timer = setTimeout(() => { loadInitialData(); }, 100);

    const handleNewMessage = (newMsg) => {
      console.log('📨 MessagesPage.handleNewMessage called with:', { msgId: newMsg._id, chat: newMsg.chat });

      const msgChatId = newMsg.chat?._id || newMsg.chat;
      const isFromOther = (newMsg.sender?._id || newMsg.sender) !== myUserId;
      const currentId = activeChatIdRef.current;
      const currentActiveChat = activeChatRef.current;

      const isSameChatById = currentId && msgChatId &&
        currentId.toString() === msgChatId.toString();
      const isSameChatByRef = currentActiveChat && msgChatId &&
        currentActiveChat._id?.toString() === msgChatId.toString();
      const isSameChat = isSameChatById || isSameChatByRef;

      console.log('📨 handleNewMessage:', {
        msgId: newMsg._id,
        msgChatId,
        activeChatIdRef: currentId,
        activeChatRef: currentActiveChat?._id,
        isSameChatById,
        isSameChatByRef,
        isSameChat,
        isFromOther
      });

      setChats(prev => {
        const updated = prev.map(c =>
          (c._id.toString() === msgChatId.toString()) ? {
            ...c,
            lastMessage: newMsg,
            lastMessageAt: newMsg.createdAt,
            unreadCount: isFromOther && !isSameChat
              ? (c.unreadCount || []).some(u => (u.userId || u._id || u.id) === myUserId)
                ? c.unreadCount.map(u => (u.userId || u._id || u.id) === myUserId ? { ...u, count: (u.count || 0) + 1 } : u)
                : [...(c.unreadCount || []), { userId: myUserId, count: 1 }]
              : (c.unreadCount || [])
          } : c
        );
        return updated.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
      });

      if (isSameChat) {
        console.log('✅ MessagesPage: Adding message to active chat');
        setMessages(prev => {
          if (prev.find(m => m._id === newMsg._id)) {
            console.log('⚠️ Message already exists, skipping');
            return prev;
          }
          if (newMsg.file) {
            const filtered = prev.filter(m => !m.isTemp || m.text !== newMsg.file?.name);
            const next = [...filtered, newMsg];
            setTimeout(() => {
              if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }, 30);
            console.log('✅ File message added, total messages:', next.length);
            return next;
          }
          const filtered = prev.filter(m => !m.isTemp || m.text !== newMsg.text);
          const next = [...filtered, newMsg];
          setTimeout(() => {
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }, 30);
          console.log('✅ Text message added, total messages:', next.length);
          return next;
        });

        if (isFromOther) {
          try {
            setChats(prev => prev.map(c => c._id?.toString() === msgChatId.toString() ? ({
              ...c,
              unreadCount: (c.unreadCount || []).map(u => (u.userId || u._id || u.id) === myUserId ? { ...u, count: 0 } : u)
            }) : c));
            chatService.markAsRead?.(msgChatId, myUserId);
            chatService.markMessageSeen?.(newMsg._id, msgChatId, myUserId);
          } catch (err) {
            console.warn('markAsRead/markMessageSeen failed', err);
          }
        }
      } else {
        console.log('❌ Message is for different chat, not adding to messages');
      }
    };

    console.log('📡 MessagesPage: Registering messageReceived listener');
    chatService.onMessageReceived?.(handleNewMessage);

    chatService.onSidebarUpdate?.((updatedChat) => {
      console.log('📲 onSidebarUpdate received:', updatedChat._id, 'unreadCount:', updatedChat.unreadCount);
      setChats(prev => {
        const filtered = prev.filter(c => c._id.toString() !== updatedChat._id.toString());
        return [updatedChat, ...filtered];
      });

      if (activeChat?._id === updatedChat._id) {
        setActiveChat(updatedChat);
        activeChatRef.current = updatedChat;
      }
    });

    chatService.onChatCreated?.((newChat) => {
      console.log('🆕 New chat created:', newChat._id);
      setChats(prev => {
        const exists = prev.find(c => c._id === newChat._id);
        if (exists) return prev;
        return [{ ...newChat, isNew: true }, ...prev];
      });
    });

    const handleStatusChange = ({ userId, status, lastSeen }) => {
      setChats(prev => prev.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => (p._id || p) === userId ? { ...p, isOnline: status === 'online', lastSeen } : p)
      })));

      setActiveChat(prev => {
        if (!prev) return prev;
        if (!prev.participants.some(p => (p._id || p) === userId)) return prev;
        const updated = {
          ...prev,
          participants: prev.participants.map(p => (p._id || p) === userId ? { ...p, isOnline: status === 'online', lastSeen } : p)
        };
        activeChatRef.current = updated;
        return updated;
      });
    };
    chatService.onUserStatusChanged?.(handleStatusChange);

    chatService.onMessageSeen?.(({ messageId, chatId, seenBy }) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, seen: true } : m));
      setChats(prev => prev.map(c => c._id?.toString() === chatId?.toString() ? ({
        ...c,
        lastMessage: c.lastMessage && (c.lastMessage._id === messageId || c.lastMessage === messageId) ? { ...c.lastMessage, seen: true } : c.lastMessage
      }) : c));
    });

    chatService.onChatCleared?.(() => {
      setMessages([]);
    });

    chatService.onMessageUpdated?.((updatedMsg) => {
      try {
        setMessages(prev => prev.map(m => m._id === updatedMsg._id ? { ...m, ...updatedMsg } : m));
        setChats(prev => prev.map(c => c._id?.toString() === (updatedMsg.chat?._id || updatedMsg.chat)?.toString() ? ({
          ...c,
          lastMessage: c.lastMessage && (c.lastMessage._id === updatedMsg._id || c.lastMessage === updatedMsg._id) ? { ...c.lastMessage, ...updatedMsg } : c.lastMessage
        }) : c));
      } catch (err) { console.error('handle messageUpdated', err); }
    });

    chatService.onChatDeleted?.(({ chatId }) => {
      if (activeChat?._id === chatId) {
        setActiveChat(null);
      }
      setChats(prev => prev.filter(c => c._id !== chatId));
    });

    chatService.onChatMuted?.(() => {
      // UI will re-render to show muted state
    });

    chatService.onUnreadCountUpdated?.(({ chatId, count }) => {
      setChats(prev => prev.map(c =>
        c._id === chatId
          ? { ...c, unreadCount: c.unreadCount?.map(u => (u.userId || u._id) === myUserId ? { ...u, count } : u) || [{ userId: myUserId, count }] }
          : c
      ));
    });

    return () => {
      clearTimeout(timer);
      chatService.removeMessageListener?.();
      chatService.removeStatusListener?.();
      chatService.removeMessageSeenListener?.();
      chatService.removeMessageUpdatedListener?.();
      chatService.removeSidebarUpdateListener?.();
      chatService.removeChatCreatedListener?.();
    };
  }, [myUserId]);

  useEffect(() => {
    if (activeChat?._id) {
      activeChatIdRef.current = activeChat._id;
      activeChatRef.current = activeChat;

      console.log('🔄 Active chat updated:', activeChat._id, 'loading history...');

      setTimeout(() => {
        chatService.joinChat?.(activeChat._id, myUserId);
      }, 100);

      chatService.getChatHistory(activeChat._id).then(data => {
        setMessages(data);
        console.log('💬 Chat history loaded:', data.length, 'messages');

        try {
          const unreadNow = getUnreadCount(activeChat) || 0;
          if (unreadNow > 0) {
            setChats(prev => prev.map(c => c._id === activeChat._id ? { ...c, unreadCount: (c.unreadCount || []).map(u => (u.userId || u._id || u.id) === myUserId ? { ...u, count: 0 } : u) } : c));
            setTimeout(() => {
              chatService.markAsRead?.(activeChat._id, myUserId);
              data.forEach(msg => {
                try {
                  const isFromOther = (msg.sender?._id || msg.sender) !== myUserId;
                  if (isFromOther && !msg.seen) {
                    chatService.markMessageSeen?.(msg._id, activeChat._id, myUserId);
                  }
                } catch (err) {
                  console.error('emit messageSeen for old message failed', err);
                }
              });
            }, 300);
          }
        } catch (err) {
          console.warn('post-history markAsRead failed', err);
        }
      }).catch(err => {
        console.error('Error loading chat history:', err);
      });
    }
  }, [activeChat?._id, myUserId]);

  useEffect(() => {
    if (location.state?.chatId && chats.length > 0 && !activeChat) {
      const targetChat = chats.find(c => c._id === location.state.chatId);
      if (targetChat) {
        setActiveChat(targetChat);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [chats.length, activeChat]);

  const { userId } = useParams();

  useEffect(() => {
    if (!userId) return;
    if (chats.length === 0) return;
    if (activeChat) return;

    const existing = chats.find(c => c.participants.some(p => (p._id || p) === userId));
    if (existing) {
      setActiveChat(existing);
      return;
    }

    (async () => {
      try {
        const resp = await chatService.createOrGetChat({ otherUserId: userId });
        if (resp && resp._id) {
          setChats(prev => {
            const found = prev.find(p => p._id === resp._id);
            if (found) return prev;
            return [resp, ...prev];
          });
          setActiveChat(resp);
        }
      } catch (err) {
        console.error('Failed to create/get chat for user', userId, err);
      }
    })();
  }, [userId, chats.length, activeChat]);

  const handleSend = async (overrideText = null) => {
    const textToProcess = (typeof overrideText === 'string') ? overrideText : inputText.trim();

    if (pendingFile && activeChat) {
      try {
        const tempId = "temp-file-" + Date.now();
        const tempMsg = {
          _id: tempId,
          sender: myUserId,
          text: pendingFile.name,
          createdAt: new Date().toISOString(),
          isTemp: true,
          uploading: true,
          file: { name: pendingFile.name, size: pendingFile.size }
        };

        setMessages(prev => [...prev, tempMsg]);
        const fileMeta = await chatService.sendFile(activeChat._id, myUserId, pendingFile);
        setMessages(prev => prev.map(m => m._id === tempId ? { ...m, isTemp: false, uploading: false, file: fileMeta } : m));
        setChats(prev => prev.map(c => c._id === activeChat._id ? { ...c, lastMessage: fileMeta, lastMessageAt: new Date().toISOString() } : c));
        setPendingFile(null);
      } catch (err) {
        console.error('File send failed', err);
        setPendingFile(null);
        alert('File send failed');
        return;
      }
    }

    if (!textToProcess || !activeChat) return;

    if (editingMessage && !overrideText) {
      chatService.editMessage?.(editingMessage.id, textToProcess, activeChat._id, myUserId);
      setMessages(prev => prev.map(m =>
        m._id === editingMessage.id ? { ...m, text: textToProcess, isEdited: true, updatedAt: new Date().toISOString() } : m
      ));
      setEditingMessage(null);
    } else {
      const tempId = "temp-" + Date.now();
      const newMessage = {
        _id: tempId,
        sender: myUserId,
        text: textToProcess,
        createdAt: new Date().toISOString(),
        isTemp: true,
        replyTo: replyTo ? { messageId: replyTo.messageId } : null
      };
      setMessages(prev => [...prev, newMessage]);
      chatService.sendMessage(activeChat._id, myUserId, textToProcess, replyTo ? replyTo.messageId : null);
      setChats(prev => prev.map(c => c._id === activeChat._id ? { ...c, lastMessage: newMessage } : c));
    }
    if (!overrideText) setInputText("");
    setShowEmojiPicker(false);
    setReplyTo(null); // Clear reply after send
  };


  const handleVideoCallAction = (type) => {
    const meetingId = Math.random().toString(36).substring(7);
    const link = type === 'zoom'
      ? `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`
      : `https://meet.google.com/new`;

    const messageBody = `Let's have a video call on ${type === 'zoom' ? 'Zoom' : 'Google Meet'}. Join here: ${link}`;
    handleSend(messageBody);
    window.open(link, '_blank');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPendingFile(file);
    e.target.value = null;
  };

  const finalDeleteExecute = async () => {
    chatService.deleteMessage(deleteTarget.msgId, activeChat._id, tempDeleteMode, myUserId);
    if (tempDeleteMode === 'me') {
      setMessages(prev => prev.filter(m => m._id !== deleteTarget.msgId));
    } else {
      setMessages(prev => prev.map(m => m._id === deleteTarget.msgId ? { ...m, text: "This message was deleted", isDeleted: true } : m));
    }
    setDeleteStep('none');
  };

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const handler = () => {
      setOpenSidebarMenuId(null);
      setShowHeaderMenu(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const otherUser = activeChat?.participants.find(p => (p._id || p) !== myUserId);

  const renderMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline break-all hover:text-blue-200">{part}</a>;
      }
      return part;
    });
  };

  return (
    <div className="relative flex h-[calc(100vh-80px)] w-full bg-[#102216] text-white overflow-hidden">
      <style>
        {`
  @keyframes messageFlash {
    0% {
      background-color: rgba(19, 236, 91, 0.45);
      transform: scale(1.02);
    }
    50% {
      background-color: rgba(19, 236, 91, 0.6);
      transform: scale(1.03);
    }
    100% {
      background-color: transparent;
      transform: scale(1);
    }
  }

  .message-highlight {
    animation: messageFlash 1.2s ease-in-out;
    border-left: 4px solid #13ec5b !important;
    box-shadow: 0 0 15px rgba(19, 236, 91, 0.4);
    border-radius: 16px;
  }
`}
      </style>


      <style>
        {`
          .EmojiPickerReact .epr-body::-webkit-scrollbar { display: none !important; }
          .EmojiPickerReact .epr-body { -ms-overflow-style: none !important; scrollbar-width: none !important; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {/* Download toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#13ec5b] text-black px-6 py-3 rounded-full shadow-lg z-50 font-medium">
          {toastMessage}
        </div>
      )}

      {deleteStep !== 'none' && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#193322] border border-[#23482f] w-full max-w-[320px] rounded-3xl p-6 shadow-2xl">
            {deleteStep === 'options' ? (
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-center mb-4">Delete?</h3>
                <button onClick={() => { setTempDeleteMode('me'); setDeleteStep('confirm'); }} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm">Delete for me</button>
                {deleteTarget.isMe && (
                  <button onClick={() => { setTempDeleteMode('everyone'); setDeleteStep('confirm'); }} className="w-full py-3 rounded-xl bg-red-600/20 text-red-400 text-sm font-semibold">Delete for everyone</button>
                )}
                <button onClick={() => setDeleteStep('none')} className="w-full py-3 text-[#13ec5b] text-sm font-bold">Cancel</button>
              </div>
            ) : (
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 text-yellow-500" size={40} />
                <h3 className="font-bold mb-6">Confirm Delete?</h3>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteStep('none')} className="flex-1 py-2 rounded-lg bg-white/5 text-sm">No</button>
                  <button onClick={finalDeleteExecute} className="flex-1 py-2 rounded-lg bg-[#13ec5b] text-black font-bold">Yes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!isMobile || !activeChat ? (
        <aside className={`border-r border-[#23482f] flex flex-col bg-[#102216] ${isMobile ? 'w-full' : 'w-80'}`}>
          <div className="p-5 border-b border-[#23482f]">
            <h2 className="text-xl font-bold text-[#13ec5b] mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92c9a4]" size={16} />
              <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#112217] text-sm outline-none border border-[#23482f]" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {chats.map((chat) => {
              const p = chat.participants.find(u => (u._id || u) !== myUserId);
              const isMeLast = chat.lastMessage?.sender === myUserId || chat.lastMessage?.sender?._id === myUserId;
              const unread = getUnreadCount(chat) || 0;

              return (
                <div key={chat._id} className="relative group/item">
                  {openSidebarMenuId === chat._id && (
                    <div className="fixed inset-0 z-20" onClick={() => setOpenSidebarMenuId(null)} />
                  )}

                  <div
                    onClick={() => {
                      setActiveChat(chat);
                      activeChatIdRef.current = chat._id;
                      activeChatRef.current = chat;

                      if (chat.isNew) {
                        setChats(prev => prev.map(c => c._id === chat._id ? { ...c, isNew: false } : c));
                      }
                      chatService.joinChat?.(chat._id, myUserId);

                      if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                      }
                    }}
                    className={`flex items-center gap-3 p-4 cursor-pointer border-b border-[#1a3322] transition-all ${chat.isNew ? 'bg-[#13ec5b]/15 border-l-4 border-[#13ec5b]' : activeChat?._id === chat._id ? 'bg-[#13ec5b]/10 border-r-4 border-[#13ec5b]' : (unread ? 'bg-[#072814] border-l-4 border-[#13ec5b]' : 'hover:bg-white/5')}`}
                  >
                    <div className="relative">
                      <img src={p?.profileImage || `https://ui-avatars.com/api/?name=${p?.name}&bg=13ec5b&color=000`} className={`h-11 w-11 rounded-full border border-[#23482f] ${unread ? 'ring-2 ring-[#13ec5b]/40' : ''}`} alt="" />
                      {unread > 0 && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#13ec5b] animate-pulse border border-transparent"></span>
                      )}
                      {chat.mutedBy?.includes(myUserId) && (
                        <div className="absolute -bottom-1 -right-1 bg-[#92c9a4] text-[#102216] rounded-full w-4 h-4 flex items-center justify-center font-bold"><BellOff size={10} /></div>
                      )}
                    </div>

                    <div className="flex-1 truncate">
                      <div className="flex justify-between items-center gap-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm ${unread || chat.isNew ? 'font-bold text-[#13ec5b]' : 'font-bold'}`}>{p?.name}</h4>
                          {chat.isNew && (
                            <span className="text-[7px] font-bold bg-[#13ec5b] text-[#102216] px-1.5 py-0.5 rounded-full flex-shrink-0 animate-pulse">NEW</span>
                          )}
                        </div>
                        {unread > 0 && (
                          <span className="text-[9px] font-bold bg-[#13ec5b] text-black px-1.5 py-0.5 rounded-full flex-shrink-0">
                            {unread}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${unread || chat.isNew ? 'text-[#e6f9ec] font-semibold' : 'text-[#92c9a4]'}`}>
                        {isMeLast ? 'You: ' : ''}{chat.lastMessage?.text || "Chat now"}
                      </p>
                    </div>

                    <div className="relative flex-shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); setOpenSidebarMenuId(prev => prev === (chat._id) ? null : chat._id); }} className="p-2 text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
                        <MoreVertical size={16} />
                      </button>

                      {openSidebarMenuId === chat._id && (
                        <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-10 w-40 bg-[#193322] border border-[#23482f] rounded-xl shadow-2xl z-50 overflow-hidden">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const skillsRes = await skillService.getUserSkills(p._id);
                                const offered = skillsRes?.offered || skillsRes?.skills || skillsRes?.offeredSkills || [];
                                const wanted = skillsRes?.wanted || skillsRes?.wantedSkills || [];
                                navigate("/explore-profile", {
                                  state: {
                                    id: p._id,
                                    name: p.name,
                                    img: p.profileImage,
                                    offeredSkills: offered,
                                    wantedSkills: wanted,
                                    rating: p.rating || 4.9,
                                    reviews: p.reviews || 0
                                  }
                                });
                              } catch (err) {
                                console.error('Error fetching user skills:', err);
                                navigate("/explore-profile", {
                                  state: {
                                    id: p._id,
                                    name: p.name,
                                    img: p.profileImage,
                                    offeredSkills: [],
                                    wantedSkills: [],
                                    rating: p.rating || 4.9,
                                    reviews: p.reviews || 0
                                  }
                                });
                              }
                              setOpenSidebarMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[11px] font-bold hover:bg-[#13ec5b] hover:text-black transition-colors flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-sm">person</span>
                            View Profile
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const isMuted = chat.mutedBy?.includes(myUserId);
                              setChats(prev => prev.map(c => c._id === chat._id ? { ...c, mutedBy: isMuted ? (c.mutedBy || []).filter(id => id !== myUserId) : [...(c.mutedBy || []), myUserId] } : c));
                              if (activeChat?._id === chat._id) setActiveChat(prev => prev ? { ...prev, mutedBy: (isMuted ? prev.mutedBy?.filter(id => id !== myUserId) : [...(prev.mutedBy || []), myUserId]) } : prev);
                              chatService.muteChat(chat._id, myUserId, !isMuted);
                              setOpenSidebarMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[11px] hover:bg-white/5 border-t border-[#23482f] flex items-center gap-2"
                          >
                            {chat.mutedBy?.includes(myUserId) ? <Bell size={16} /> : <BellOff size={16} />}
                            <span>{chat.mutedBy?.includes(myUserId) ? 'Unmute' : 'Mute'}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatConfirm({ isOpen: true, type: 'clear', chatId: chat._id });
                              setOpenSidebarMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[11px] text-[#92c9a4] hover:bg-white/5 border-t border-[#23482f] flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            <span>Clear Chat</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatConfirm({ isOpen: true, type: 'delete', chatId: chat._id });
                              setOpenSidebarMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[11px] text-red-400 hover:bg-red-500/10 border-t border-[#23482f] flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      ) : null}

      {!isMobile || activeChat ? (
        <main className={`flex-1 flex flex-col bg-[#0d1a11] ${isMobile ? 'w-full' : ''}`}>
          {activeChat ? (
            <>
              <header className="h-20 flex items-center justify-between px-8 bg-[#112217] border-b border-[#23482f]">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <button onClick={() => setActiveChat(null)} className="text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
                      <ArrowLeft size={24} />
                    </button>
                  )}
                  <div className="relative">
                    <img src={otherUser?.profileImage || `https://ui-avatars.com/api/?name=${otherUser?.name}&bg=13ec5b&color=000`} className="h-10 w-10 rounded-full" alt="" />
                    {activeChat?.mutedBy?.includes(myUserId) && (
                      <div className="absolute -bottom-1 -right-1 bg-[#92c9a4] text-[#102216] rounded-full w-5 h-5 flex items-center justify-center font-bold"><BellOff size={12} /></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">{otherUser?.name}</h3>
                    <p className={`text-[10px] ${isRecentlyOnline(otherUser) ? 'text-[#13ec5b]' : 'text-[#92c9a4]'}`}>
                      {isRecentlyOnline(otherUser)
                        ? '● Online'
                        : `Last seen ${formatLastSeen(otherUser?.lastSeen)}`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getUnreadCount(activeChatFromList) > 0 && (
                    <div className="px-3 py-1 bg-[#13ec5b]/20 border border-[#13ec5b] rounded-full text-[10px] font-bold text-[#13ec5b]">
                      {getUnreadCount(activeChatFromList)} unread
                    </div>
                  )}

                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setShowHeaderMenu(prev => !prev); }} className="p-2 text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
                      <MoreVertical size={24} />
                    </button>
                    {showHeaderMenu && (
                      <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-10 w-48 bg-[#193322] border border-[#23482f] rounded-xl shadow-2xl opacity-100 visible transition-all duration-300 z-50 overflow-hidden">
                        <button onClick={() => {
                          const isMuted = activeChat?.mutedBy?.includes(myUserId);
                          setChats(prev => prev.map(c => c._id === activeChat._id ? { ...c, mutedBy: isMuted ? (c.mutedBy || []).filter(id => id !== myUserId) : [...(c.mutedBy || []), myUserId] } : c));
                          if (activeChat) setActiveChat(prev => prev ? { ...prev, mutedBy: isMuted ? prev.mutedBy?.filter(id => id !== myUserId) : [...(prev.mutedBy || []), myUserId] } : prev);
                          chatService.muteChat(activeChat._id, myUserId, !isMuted);
                          setShowHeaderMenu(false);
                        }} className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 border-b border-[#23482f] flex items-center gap-2">
                          {activeChat?.mutedBy?.includes(myUserId) ? <><Bell size={16} /><span>Unmute</span></> : <><BellOff size={16} /><span>Mute</span></>}
                        </button>
                        <button onClick={() => { setChatConfirm({ isOpen: true, type: 'clear', chatId: activeChat?._id }); setShowHeaderMenu(false); }} className="w-full text-left px-4 py-2 text-xs text-[#92c9a4] hover:bg-white/5 border-b border-[#23482f] flex items-center gap-2">
                          <Trash2 size={14} />
                          <span>Clear Chat</span>
                        </button>
                        <button onClick={() => { setChatConfirm({ isOpen: true, type: 'delete', chatId: activeChat?._id }); setShowHeaderMenu(false); }} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-950/20 flex items-center gap-2">
                          <X size={14} />
                          <span>Delete Chat</span>
                        </button>

                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <button className="p-2 text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
                      <Video size={24} />
                    </button>
                    <div className="absolute right-0 top-10 w-48 bg-[#193322] border border-[#23482f] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                      <button onClick={() => handleVideoCallAction('zoom')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                        <div className="w-6 h-6 bg-[#2D8CFF] rounded flex items-center justify-center text-[10px] font-black text-white italic">Z</div>
                        <span className="text-xs font-bold">Zoom Link</span>
                      </button>
                      <button onClick={() => handleVideoCallAction('meet')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-t border-[#23482f]">
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center font-bold text-blue-500 text-[10px]">M</div>
                        <span className="text-xs font-bold">Meet Link</span>
                      </button>
                    </div>
                  </div>
                </div>
              </header>

              <ConfirmModal
                isOpen={chatConfirm.isOpen}
                title={chatConfirm.type === 'delete' ? 'Delete Chat' : 'Clear Chat'}
                message={chatConfirm.type === 'delete' ? 'Delete this chat? This will remove it permanently.' : 'Clear all messages from this chat? This will remove messages only.'}
                confirmLabel={chatConfirm.type === 'delete' ? 'Delete' : 'Clear'}
                cancelLabel={'Cancel'}
                onClose={() => { setChatConfirm({ isOpen: false, type: null, chatId: null }); setShowHeaderMenu(false); setOpenSidebarMenuId(null); }}
                onConfirm={async () => {
                  try {
                    const cid = chatConfirm.chatId || activeChat?._id;
                    if (!cid) return;
                    if (chatConfirm.type === 'clear') {
                      await chatService.clearChat(cid, myUserId);
                      if (activeChat?._id === cid) setMessages([]);
                    } else if (chatConfirm.type === 'delete') {
                      await chatService.deleteChat(cid, myUserId);
                      setChats(prev => prev.filter(c => c._id !== cid));
                      if (activeChat?._id === cid) setActiveChat(null);
                    }
                  } catch (err) {
                    console.error('chat action failed', err);
                  } finally {
                    setChatConfirm({ isOpen: false, type: null, chatId: null });
                    setShowHeaderMenu(false);
                    setOpenSidebarMenuId(null);
                  }
                }}
              />

              <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
                {messages.map((m, idx) => {
                  const isMe = (m.sender?._id || m.sender) === myUserId;
                  const isDeleted = m.isDeleted || m.text === "This message was deleted";
                  const wasEdited = (m.isEdited === true);
                  const showDateHeader = idx === 0 || formatMessageDate(messages[idx - 1].createdAt) !== formatMessageDate(m.createdAt);
                  const isImage = m.file && m.file.mimeType?.startsWith('image/');
                  const isPdf = m.file && m.file.mimeType === 'application/pdf';

                  // For attachment, show the message if it has text, else file name
                  let messageContent = m.text || "";
                  if (m.file && !m.text) {
                    messageContent = m.file.name || "Attachment";
                  }

                  return (
                    <React.Fragment key={m._id || idx}>
                      {showDateHeader && (
                        <div className="flex justify-center my-6">
                          <span className="bg-[#193322] text-[#92c9a4] text-[10px] px-4 py-1 rounded-full border border-[#23482f] uppercase tracking-widest">
                            {formatMessageDate(m.createdAt)}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className="relative group max-w-[70%]">
                          <div ref={(el) => {
                            if (m._id) messageRefs.current[m._id] = el;
                          }} className="message-container">
                            {!isDeleted && (
                              <div className={`absolute -top-8 flex bg-[#1a3322] border border-[#23482f] rounded-lg opacity-0 group-hover:opacity-100 transition-all z-20 ${isMe ? 'right-0' : 'left-0'}`}>
                                {isMe && <button onClick={() => { setEditingMessage({ id: m._id, text: m.text }); setInputText(m.text); }} className="p-2 hover:bg-white/10 text-[#92c9a4]"><Edit2 size={14} /></button>}
                                <button onClick={() => handleSetReply(m)} className="p-2 hover:bg-[#13ec5b]/30 text-[#13ec5b]" title="Reply"><Reply size={14} /></button>
                                <button onClick={() => { setDeleteTarget({ msgId: m._id, isMe }); setDeleteStep('options'); }} className="p-2 hover:bg-red-500/20 text-red-400"><Trash2 size={14} /></button>
                              </div>
                            )}
                            <div
                              className={`px-4 py-2 rounded-2xl shadow-sm relative transition-all duration-300
    ${highlightedMessageId === m._id ? 'message-highlight' : ''}
    ${isDeleted
                                  ? 'border border-[#23482f] italic text-gray-500'
                                  : isMe
                                    ? 'bg-[#193322] border border-[#13ec5b]/30 text-white rounded-tr-none'
                                    : 'bg-[#193322] text-white border border-[#23482f] rounded-tl-none'
                                }`}
                            >

                              {/* Quoted reply */}

                              {m.replyTo && (
                                <div
                                  onClick={() => scrollToOriginalMessage(m.replyTo._id)}  // ← yahan replyTo._id use karo (populated ID)
                                  className="border-l-4 border-[#13ec5b] pl-3 mb-2 text-xs bg-black/20 rounded-r cursor-pointer hover:bg-black/30 transition-all"
                                >
                                  <p className="font-semibold text-[#13ec5b]">
                                    {(m.replyTo.sender?._id || m.replyTo.sender) === myUserId ? "You" : otherUser?.name || "User"}
                                  </p>
                                  <p className="opacity-90 line-clamp-2">
                                    {m.replyTo.text || (m.replyTo.file ? (m.replyTo.file.mimeType?.startsWith('image/') ? "Photo" : m.replyTo.file.name || "Attachment") : "Message")}
                                  </p>
                                </div>
                              )}




                              {m.file ? (
                                <>
                                  {isImage ? (
                                    <div className="relative group/image">
                                      <a href={m.file.url} target="_blank" rel="noopener noreferrer" className="block">
                                        <img src={m.file.url} alt={m.file.name} className="max-w-[220px] rounded-xl border border-[#23482f]" />
                                      </a>
                                      <button
                                        onClick={() => handleDownload(m.file.url, m.file.name)}
                                        className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 p-2 rounded-full text-white opacity-0 group-hover/image:opacity-100 transition"
                                        title="Download image"
                                      >
                                        <Download size={16} />
                                      </button>
                                    </div>
                                  ) : isPdf ? (
                                    <div className="flex items-center gap-3 bg-[#112217] p-3 rounded-xl border border-[#23482f]">
                                      <div className="text-red-500 text-2xl font-bold">PDF</div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium truncate">{m.file.name}</p>
                                        {m.file.size && <p className="text-xs text-[#92c9a4]">{(m.file.size / 1024 / 1024).toFixed(1)} MB</p>}
                                      </div>
                                      <button
                                        onClick={() => handleDownload(m.file.url, m.file.name)}
                                        className="p-2 hover:bg-white/10 rounded-full text-[#92c9a4] hover:text-white transition"
                                        title="Download PDF"
                                      >
                                        <Download size={20} />
                                      </button>
                                    </div>
                                  ) : (
                                    <a href={m.file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 underline break-all hover:text-blue-200 text-sm">
                                      <Paperclip size={14} />
                                      <span>{m.file.name || m.file.url}</span>
                                    </a>
                                  )}
                                </>
                              ) : (
                                <p className="text-sm">{renderMessageText(m.text)}</p>
                              )}
                              <div className="flex items-center justify-end gap-2 mt-1">
                                {!isDeleted && wasEdited && <span className="text-[8px] opacity-50 italic font-bold">edited</span>}
                                <p className="text-[9px] opacity-60">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                {isMe && !isDeleted && <Check size={10} className={m.seen ? "text-blue-500" : "text-gray-400"} />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              <div className="p-4 bg-[#112217] border-t border-[#23482f]">
                {editingMessage && (
                  <div className="flex items-center justify-between bg-[#193322] px-4 py-1 mb-2 rounded border-l-4 border-[#13ec5b]">
                    <p className="text-[10px] text-[#92c9a4]">Editing...</p>
                    <button onClick={() => { setEditingMessage(null); setInputText(""); }}><X size={12} /></button>
                  </div>
                )}

                {/* Reply preview */}
                {replyTo && (
                  <div className="bg-[#193322] border-l-4 border-[#13ec5b] px-4 py-2.5 mb-2 rounded-r-xl flex items-start gap-3 relative">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#13ec5b]">{replyTo.senderName}</p>
                      <p className="text-sm opacity-80 line-clamp-2">{replyTo.content}</p>
                    </div>
                    <button
                      onClick={() => setReplyTo(null)}
                      className="text-[#92c9a4] hover:text-red-400 transition-colors mt-1"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                {pendingFile && (
                  <div className="flex items-center gap-3 bg-[#193322] border border-[#23482f] p-3 rounded-xl mb-2">
                    {pendingFile.type.startsWith('image/') ? (
                      <>
                        <img src={URL.createObjectURL(pendingFile)} alt="preview" className="h-12 w-12 rounded object-cover" />
                        <span className="text-sm text-white flex-1">{pendingFile.name}</span>
                      </>
                    ) : (
                      <>
                        <Paperclip size={20} className="text-[#92c9a4]" />
                        <span className="text-sm text-white flex-1 truncate">{pendingFile.name}</span>
                      </>
                    )}
                    <button onClick={() => setPendingFile(null)} className="text-red-400 hover:text-red-300">
                      <X size={18} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 bg-[#193322] rounded-2xl px-4 py-2 border border-[#23482f] relative">
                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-[#92c9a4] hover:text-[#13ec5b]"><Smile size={22} /></button>

                  <button onClick={() => fileInputRef.current.click()} className="text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
                    <Paperclip size={20} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

                  <input value={inputText} onChange={(e) => {
                    setInputText(e.target.value);
                    if (showEmojiPicker && e.target.value.length > 0) {
                      setShowEmojiPicker(false);
                    }
                  }} onFocus={() => setShowEmojiPicker(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSend();
                        setShowEmojiPicker(false);
                      }
                    }} placeholder="Type a message..." className="flex-1 bg-transparent outline-none text-sm" />

                  <button onClick={() => {
                    handleSend();
                    setShowEmojiPicker(false);
                  }} className="bg-[#13ec5b] p-2 rounded-lg text-black transition-transform active:scale-90">
                    {editingMessage ? <Check size={18} /> : <Send size={18} />}
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute bottom-16 left-0 z-50">
                      <EmojiPicker onEmojiClick={(e) => {
                        setInputText(p => p + e.emoji);
                      }} theme="dark" width={300} height={400} />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-10">
              <Send size={80} />
              <p className="mt-4 font-bold tracking-[0.3em]">SELECT A CHAT</p>
            </div>
          )}
        </main>
      ) : null}
    </div>
  );
};

export default MessagesPage;