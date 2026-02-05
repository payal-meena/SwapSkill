import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chatService';
import { skillService } from '../../services/skillService';
import { Search, Send, Trash2, Edit2, X, Check, Smile, AlertCircle, Video, Paperclip, MoreVertical } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import Avatar from '../../components/common/Avatar';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const [deleteStep, setDeleteStep] = useState('none');
  const [deleteTarget, setDeleteTarget] = useState({ msgId: null, isMe: false });
  const [tempDeleteMode, setTempDeleteMode] = useState(null);

  const myUserId = getMyId();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef();
  const fileInputRef = useRef();
  const activeChatIdRef = useRef(null);

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
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
      const msgChatId = newMsg.chat?._id || newMsg.chat;
      
      setChats(prev => {
        const updated = prev.map(c => 
          (c._id.toString() === msgChatId.toString()) ? { ...c, lastMessage: newMsg, lastMessageAt: newMsg.createdAt } : c
        );
        return updated.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
      });
      const currentId = activeChatIdRef.current;
      const isSameChat = currentId && msgChatId && 
        currentId.toString() === msgChatId.toString();
      
      if (isSameChat) {
        setMessages(prev => {
          // Avoid duplicates: check if message already exists
          if (prev.find(m => m._id === newMsg._id)) {
            return prev;
          }
          // Remove temp message with same text if file message
          if (newMsg.file) {
            const filtered = prev.filter(m => !m.isTemp || m.text !== newMsg.file?.name);
            return [...filtered, newMsg];
          }
          // For text messages, remove temp message with same text
          const filtered = prev.filter(m => !m.isTemp || m.text !== newMsg.text);
          return [...filtered, newMsg];
        });
      }
    };
    chatService.onMessageReceived?.(handleNewMessage);

    chatService.onSidebarUpdate?.((updatedChat) => {
      setChats(prev => {
        const filtered = prev.filter(c => c._id.toString() !== updatedChat._id.toString());
        return [updatedChat, ...filtered];
      });
      
      // Update activeChat if it's the same chat
      if (activeChat?._id === updatedChat._id) {
        setActiveChat(updatedChat);
      }
    });

    const handleStatusChange = ({ userId, status, lastSeen }) => {
      setChats(prev => prev.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => (p._id || p) === userId ? { ...p, isOnline: status === 'online', lastSeen } : p)
      })));

      setActiveChat(prev => {
        if (!prev) return prev;
        if (!prev.participants.some(p => (p._id || p) === userId)) return prev;
        return {
          ...prev,
          participants: prev.participants.map(p => (p._id || p) === userId ? { ...p, isOnline: status === 'online', lastSeen } : p)
        };
      });
    };
    chatService.onUserStatusChanged?.(handleStatusChange);

    // Listen for chat cleared
    chatService.onChatCleared?.(() => {
      setMessages([]);
    });

    // Listen for chat deleted
    chatService.onChatDeleted?.(({ chatId }) => {
      if (activeChat?._id === chatId) {
        setActiveChat(null);
      }
      setChats(prev => prev.filter(c => c._id !== chatId));
    });

    // Listen for chat muted
    chatService.onChatMuted?.(() => {
      // UI will re-render to show muted state
    });

    // Listen for unread count updates
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
    };
  }, [myUserId]);

  useEffect(() => {
    if (activeChat?._id) {
      activeChatIdRef.current = activeChat._id;
      // Wait a bit to ensure socket is connected
      setTimeout(() => {
        chatService.joinChat?.(activeChat._id, myUserId);
      }, 100);
      chatService.getChatHistory(activeChat._id).then(data => {
        setMessages(data);
        
        // Scroll to message if coming from notification
        if (location.state?.scrollToMessageId) {
          setTimeout(() => {
            const messageElement = document.getElementById(`message-${location.state.scrollToMessageId}`);
            if (messageElement) {
              messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              messageElement.classList.add('highlight-message');
              // Remove animation class after it completes
              setTimeout(() => {
                messageElement.classList.remove('highlight-message');
              }, 3000);
            }
          }, 100);
        }
      });
    }
  }, [activeChat?._id, myUserId, location.state?.scrollToMessageId]);

  // Auto-select chat from location state if coming from requests page (only once on first load)
  useEffect(() => {
    if (location.state?.chatId && chats.length > 0 && !activeChat) {
      const targetChat = chats.find(c => c._id === location.state.chatId);
      if (targetChat) {
        setActiveChat(targetChat);
      }
      // Clear location state after using it so it doesn't interfere with chat switching
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [chats.length, activeChat]);

  // Modified handleSend to support auto-sending links
  const handleSend = async (overrideText = null) => {
    const textToProcess = (typeof overrideText === 'string') ? overrideText : inputText.trim();
    
    // Agar pending file hai toh pehle file send karo
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
    
    // Phir text message send karo
    if (!textToProcess || !activeChat) return;

    if (editingMessage && !overrideText) {
      chatService.editMessage?.(editingMessage.id, textToProcess, activeChat._id);
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
        isTemp: true 
      };
      setMessages(prev => [...prev, newMessage]);
      chatService.sendMessage(activeChat._id, myUserId, textToProcess);
      setChats(prev => prev.map(c => c._id === activeChat._id ? { ...c, lastMessage: newMessage } : c));
    }
    if (!overrideText) setInputText("");
    setShowEmojiPicker(false);
  };

  // Video Call Link Generation Logic
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
    
    // Sirf file store karo, send nahi
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

  const otherUser = activeChat?.participants.find(p => (p._id || p) !== myUserId);

  // Helper to detect and render links in messages
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
          .EmojiPickerReact .epr-body::-webkit-scrollbar { display: none !important; }
          .EmojiPickerReact .epr-body { -ms-overflow-style: none !important; scrollbar-width: none !important; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {/* DELETE MODAL */}
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

      {/* SIDEBAR */}
      <aside className="w-80 border-r border-[#23482f] flex flex-col bg-[#102216]">
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
  
  return (
    <div key={chat._id} className="relative group/item"> {/* group/item lagaya taaki menu handle ho sake */}
      <div 
        onClick={() => {
          setActiveChat(chat);
          // Scroll to top when switching chats
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }} 
        className={`flex items-center gap-3 p-4 cursor-pointer border-b border-[#1a3322] transition-all ${activeChat?._id === chat._id ? 'bg-[#13ec5b]/10 border-r-4 border-[#13ec5b]' : 'hover:bg-white/5'}`}
      >
        <div className="relative">
          <img src={p?.profileImage || `https://ui-avatars.com/api/?name=${p?.name}&bg=13ec5b&color=000`} className="h-11 w-11 rounded-full border border-[#23482f]" alt="" />
          {chat.mutedBy?.includes(myUserId) && (
            <div className="absolute -bottom-1 -right-1 bg-[#92c9a4] text-[#102216] text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">🔕</div>
          )}
        </div>

        <div className="flex-1 truncate">
          <div className="flex justify-between items-center gap-2">
            <h4 className="text-sm font-bold">{p?.name}</h4>
            <div className="flex items-center gap-2">
               {chat.unreadCount && chat.unreadCount.find(u => (u.userId || u._id) === myUserId)?.count > 0 && (
                <span className="text-[10px] font-bold bg-[#13ec5b] text-black px-2 py-0.5 rounded-full">
                  {chat.unreadCount.find(u => (u.userId || u._id) === myUserId)?.count}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs truncate text-[#92c9a4]">
            {isMeLast ? 'You: ' : ''}{chat.lastMessage?.text || "Chat now"}
          </p>
        </div>
      </div>

      {/* --- NAYA SIDEBAR MENU (THREE DOTS) --- */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity z-30">
        <div className="relative group/menu">
          <button className="p-2 text-[#92c9a4] hover:text-[#13ec5b]">
            <MoreVertical size={16} />
          </button>
          
          <div className="absolute right-0 top-8 w-40 bg-[#193322] border border-[#23482f] rounded-xl shadow-2xl invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all z-50 overflow-hidden">
            <button 
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  // Fetch user skills to get complete profile data
                  const skillsRes = await skillService.getUserSkills(p._id);
                  const offered = skillsRes?.offered || skillsRes?.skills || skillsRes?.offeredSkills || [];
                  const wanted = skillsRes?.wanted || skillsRes?.wantedSkills || [];
                  
                  // Navigate to ExploreProfile with complete user data
                  navigate("/explore-profile", { 
                    state: { 
                      id: p._id,
                      name: p.name,
                      img: p.profileImage,
                      bio: p.bio,
                      offeredSkills: offered,
                      wantedSkills: wanted,
                      rating: p.rating || 4.9,
                      reviews: p.reviews || 0
                    } 
                  });
                } catch (err) {
                  console.error('Error fetching user skills:', err);
                  // Fallback: navigate with basic data
                  navigate("/explore-profile", { 
                    state: { 
                      id: p._id,
                      name: p.name,
                      img: p.profileImage,
                      bio: p.bio,
                      offeredSkills: [],
                      wantedSkills: [],
                      rating: p.rating || 4.9,
                      reviews: p.reviews || 0
                    } 
                  });
                }
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
                chatService.muteChat(chat._id, myUserId, !isMuted);
              }} 
              className="w-full text-left px-4 py-2.5 text-[11px] hover:bg-white/5 border-t border-[#23482f] flex items-center gap-2"
            >
              <span>{chat.mutedBy?.includes(myUserId) ? '🔔' : '🔕'}</span>
              {chat.mutedBy?.includes(myUserId) ? 'Unmute' : 'Mute'}
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this chat?')) {
                  chatService.deleteChat(chat._id, myUserId);
                  if (activeChat?._id === chat._id) setActiveChat(null);
                }
              }} 
              className="w-full text-left px-4 py-2.5 text-[11px] text-red-400 hover:bg-red-500/10 border-t border-[#23482f] flex items-center gap-2"
            >
              <span>🗑️</span> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
})}
        </div>
      </aside>

      {/* CHAT WINDOW */}
      <main className="flex-1 flex flex-col bg-[#0d1a11]">
        {activeChat ? (
          <>
            <header className="h-20 flex items-center justify-between px-8 bg-[#112217] border-b border-[#23482f]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={otherUser?.profileImage || `https://ui-avatars.com/api/?name=${otherUser?.name}&bg=13ec5b&color=000`} className="h-10 w-10 rounded-full" alt="" />
                  {activeChat?.mutedBy?.includes(myUserId) && (
                    <div className="absolute -bottom-1 -right-1 bg-[#92c9a4] text-[#102216] text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">🔕</div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold">{otherUser?.name}</h3>
                  <p className={`text-[10px] ${isRecentlyOnline(otherUser) ? 'text-[#13ec5b]' : 'text-[#92c9a4]'}`}>
                    {activeChat?.mutedBy?.includes(myUserId) ? '🔕 Muted' : isRecentlyOnline(otherUser) ? '● Online' : `Last seen ${formatLastSeen(otherUser?.lastSeen)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Unread badge */}
                {activeChat?.unreadCount && activeChat.unreadCount.length > 0 && (
                  <div className="px-3 py-1 bg-[#13ec5b]/20 border border-[#13ec5b] rounded-full text-[10px] font-bold text-[#13ec5b]">
                    {activeChat.unreadCount.find(u => (u.userId || u._id) === myUserId)?.count || 0} unread
                  </div>
                )}

                {/* Chat actions menu */}
                <div className="relative group">
                  <button className="p-2 text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
                    <MoreVertical size={24} />
                  </button>
                  <div className="absolute right-0 top-10 w-48 bg-[#193322] border border-[#23482f] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                    <button onClick={() => { const isMuted = activeChat?.mutedBy?.includes(myUserId); chatService.muteChat(activeChat._id, myUserId, !isMuted); }} className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 border-b border-[#23482f]">
                      {activeChat?.mutedBy?.includes(myUserId) ? '🔔 Unmute' : '🔕 Mute'}
                    </button>
                    <button onClick={() => { if (confirm('Clear all messages?')) chatService.clearChat(activeChat._id, myUserId); }} className="w-full text-left px-4 py-2 text-xs text-[#92c9a4] hover:bg-white/5 border-b border-[#23482f]">
                      🗑️ Clear Chat
                    </button>
                    <button onClick={() => { if (confirm('Delete this chat?')) { chatService.deleteChat(activeChat._id, myUserId); setActiveChat(null); } }} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-950/20">
                      ❌ Delete Chat
                    </button>
                  </div>
                </div>

                {/* Video call menu */}
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

            <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
              {messages.map((m, idx) => {
                const isMe = (m.sender?._id || m.sender) === myUserId;
                const isDeleted = m.isDeleted || m.text === "This message was deleted";
                const wasEdited = m.isEdited || (m.updatedAt && m.updatedAt !== m.createdAt);
                const showDateHeader = idx === 0 || formatMessageDate(messages[idx-1].createdAt) !== formatMessageDate(m.createdAt);

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
                      <div className="relative group max-w-[70%]" id={`message-${m._id}`}>
                        {!isDeleted && (
                          <div className={`absolute -top-8 flex bg-[#1a3322] border border-[#23482f] rounded-lg opacity-0 group-hover:opacity-100 transition-all z-20 ${isMe ? 'right-0' : 'left-0'}`}>
                            {isMe && <button onClick={() => { setEditingMessage({id: m._id, text: m.text}); setInputText(m.text); }} className="p-2 hover:bg-white/10 text-[#92c9a4]"><Edit2 size={14}/></button>}
                            <button onClick={() => { setDeleteTarget({ msgId: m._id, isMe }); setDeleteStep('options'); }} className="p-2 hover:bg-red-500/20 text-red-400"><Trash2 size={14}/></button>
                          </div>
                        )}
                        <div className={`px-4 py-2 rounded-2xl shadow-sm ${isDeleted ? 'border border-[#23482f] italic text-gray-500' : isMe ? 'bg-[#193322] border border-[#13ec5b]/30 text-white rounded-tr-none' : 'bg-[#193322] text-white border border-[#23482f] rounded-tl-none'}`}>
                          {m.file ? (
                            m.file.mimeType && m.file.mimeType.startsWith('image/') ? (
                              <a href={m.file.url} target="_blank" rel="noopener noreferrer" className="block">
                                <img src={m.file.url} alt={m.file.name} className="max-w-[220px] rounded-xl border border-[#23482f]" />
                              </a>
                            ) : (
                              <a href={m.file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 underline break-all hover:text-blue-200 text-sm">
                                <Paperclip size={14} />
                                <span>{m.file.name || m.file.url}</span>
                              </a>
                            )
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
                  </React.Fragment>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-[#112217] border-t border-[#23482f]">
              {editingMessage && (
                <div className="flex items-center justify-between bg-[#193322] px-4 py-1 mb-2 rounded border-l-4 border-[#13ec5b]">
                  <p className="text-[10px] text-[#92c9a4]">Editing...</p>
                  <button onClick={() => {setEditingMessage(null); setInputText("");}}><X size={12}/></button>
                </div>
              )}
              
              {/* Pending file preview */}
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
                  // Auto-close emoji picker when typing
                  if (showEmojiPicker && e.target.value.length > 0) {
                    setShowEmojiPicker(false);
                  }
                }} onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                    setShowEmojiPicker(false);
                  }
                }} placeholder="Type a message..." className="flex-1 bg-transparent outline-none text-sm" />
                
                <button onClick={() => {
                  handleSend();
                  setShowEmojiPicker(false);
                }} className="bg-[#13ec5b] p-2 rounded-lg text-black transition-transform active:scale-90">
                  {editingMessage ? <Check size={18}/> : <Send size={18}/>}
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-0 z-50">
                    <EmojiPicker onEmojiClick={(e) => {
                      setInputText(p => p + e.emoji);
                      // Keep emoji picker open for more emojis
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
    </div>
  );
};

export default MessagesPage;