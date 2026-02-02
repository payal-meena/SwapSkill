import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import { Search, Send, Smile, Video, VideoOff, ExternalLink } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

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
  const { userId: userIdFromParams } = useParams();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMeetOptions, setShowMeetOptions] = useState(false);

  const myUserId = getMyId();
  const scrollRef = useRef();
  const meetMenuRef = useRef();

  // Close meet menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (meetMenuRef.current && !meetMenuRef.current.contains(event.target)) {
        setShowMeetOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HELPERS ---
  const formatMessageTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatLastSeen = (dateString) => {
    if (!dateString) return "Offline";
    const date = new Date(dateString);
    const diff = Math.floor((new Date() - date) / 60000);
    if (diff < 1) return "Last seen just now";
    if (diff < 60) return `Last seen ${diff}m ago`;
    return `Last seen ${Math.floor(diff / 60)}h ago`;
  };

  // --- SOCKET & CHAT LIST LOAD ---
  useEffect(() => {
    if (!myUserId) return;
    chatService.connectSocket(myUserId);

    const loadInitialData = async () => {
      try {
        const data = await chatService.getMyChats();
        setChats(data);
        if (userIdFromParams) {
          const existing = data.find(c => c.participants.some(p => (p._id || p) === userIdFromParams));
          if (existing) setActiveChat(existing);
        }
      } catch (err) { console.error("Load Chats Error:", err); }
    };
    loadInitialData();

    chatService.onMessageReceived((newMsg) => {
      const msgChatId = newMsg.chat?._id || newMsg.chat;
      const senderId = newMsg.sender?._id || newMsg.sender;

      setChats(prevChats => {
        const otherChats = prevChats.filter(c => c._id !== msgChatId);
        const targetChat = prevChats.find(c => c._id === msgChatId);
        if (targetChat) {
          const isCurrentlyViewing = activeChat?._id === msgChatId;
          const updatedChat = {
            ...targetChat,
            lastMessage: { ...newMsg, isRead: isCurrentlyViewing && senderId !== myUserId },
            updatedAt: new Date()
          };
          if (isCurrentlyViewing) chatService.markAsRead(msgChatId, myUserId);
          return [updatedChat, ...otherChats];
        }
        return prevChats;
      });
      
      

      if (senderId !== myUserId) {
        setMessages(prevMsgs => {
          const isDup = prevMsgs.some(m => m._id === newMsg._id);
          return isDup ? prevMsgs : [...prevMsgs, newMsg];
        });
      }
    });

    chatService.onUserStatusChanged(({ userId, status, lastSeen }) => {
      const isOnline = status === 'online';
      setChats(prev => prev.map(c => ({
        ...c,
        participants: c.participants.map(p => (p._id || p) === userId ? { ...p, isOnline, lastSeen } : p)
      })));
      setActiveChat(prev => {
        if (!prev) return null;
        return {
          ...prev,
          participants: prev.participants.map(p => (p._id || p) === userId ? { ...p, isOnline, lastSeen } : p)
        };
      });
    });

    return () => {
      chatService.removeMessageListener();
      chatService.removeStatusListener();
    };
  }, [myUserId,activeChat?._id]);

  useEffect(() => {
    if (activeChat?._id) {
      chatService.joinChat(activeChat._id, myUserId);
      chatService.getChatHistory(activeChat._id).then(setMessages);
    }
  }, [activeChat?._id, myUserId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;
    const tempMsg = {
      _id: "temp-" + Date.now(),
      text: inputText,
      sender: { _id: myUserId },
      createdAt: new Date().toISOString(),
      chat: activeChat._id
    };
    setMessages(prev => [...prev, tempMsg]);
    chatService.sendMessage(activeChat._id, myUserId, inputText);
    setInputText("");
    setShowEmojiPicker(false);
  };

  const handleChatClick = (chat) => {
    setActiveChat(chat);
    if (chat.lastMessage && chat.lastMessage.sender !== myUserId && !chat.lastMessage.isRead) {
      chatService.markAsRead(chat._id, myUserId);
      setChats(prev => prev.map(c =>
        c._id === chat._id ? { ...c, lastMessage: { ...c.lastMessage, isRead: true } } : c
      ));
    }
  };

  const otherUser = activeChat?.participants.find(p => (p._id || p) !== myUserId);

  return (
    <div className="flex h-screen bg-[#102216] text-white overflow-hidden font-sans">
      {/* SIDEBAR */}
      <div className="w-80 border-r border-[#23482f] flex flex-col bg-[#102216]">
        <div className="p-6 border-b border-[#23482f]">
          <h2 className="text-xl font-bold mb-4 text-[#13ec5b]">Messages</h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92c9a4]" size={18} />
            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#112217] outline-none border border-transparent focus:border-[#13ec5b]/50 text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {chats.map((chat) => {
            const p = chat.participants.find(u => (u._id || u) !== myUserId);
            const isUnread = chat.lastMessage && (chat.lastMessage.sender?._id || chat.lastMessage.sender) !== myUserId && chat.lastMessage.isRead === false;

            return (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat)}
                className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4 ${activeChat?._id === chat._id ? 'border-[#13ec5b] bg-[#13ec5b]/5' : 'border-transparent hover:bg-[#193322]/50'}`}
              >
                <div className="relative shrink-0">
                  <img src={p?.profileImage || `https://ui-avatars.com/api/?name=${p?.name || 'U'}&bg=13ec5b&color=000`} className="h-12 w-12 rounded-full border border-[#23482f]" alt="p" />
                  {p?.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#13ec5b] border-2 border-[#102216]"></span>}
                </div>
                <div className="flex-1 truncate">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className={`text-sm truncate ${isUnread ? 'font-black text-white' : 'font-bold text-[#92c9a4]'}`}>{p?.name || "User"}</h4>
                    {isUnread && <span className="h-2.5 w-2.5 bg-[#13ec5b] rounded-full shadow-[0_0_10px_#13ec5b] animate-pulse"></span>}
                  </div>
                  <p className={`text-xs truncate ${isUnread ? 'text-white font-semibold' : 'text-[#92c9a4]'}`}>{chat.lastMessage?.text || "No messages yet"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <main className="flex-1 flex flex-col relative bg-[#0d1a11]">
        {activeChat ? (
          <>
            <header className="h-20 flex items-center justify-between px-8 bg-[#112217] border-b border-[#23482f] z-10 shadow-lg">
              <div className="flex items-center gap-4">
                <img 
                  src={otherUser?.profileImage ? (otherUser.profileImage.startsWith('http') ? otherUser.profileImage : `http://localhost:5000${otherUser.profileImage.startsWith('/') ? '' : '/'}${otherUser.profileImage}`) : `https://ui-avatars.com/api/?name=${otherUser?.name || 'U'}&bg=13ec5b&color=000&bold=true`}
                  className="h-10 w-10 rounded-full border border-[#23482f] object-cover" 
                  alt="avatar"
                />
                <div>
                  <h3 className="font-bold text-white">{otherUser?.name || "Unknown"}</h3>
                  <p className={`text-[10px] font-bold uppercase ${otherUser?.isOnline ? 'text-[#13ec5b]' : 'text-[#92c9a4]'}`}>
                    {otherUser?.isOnline ? '● Online' : formatLastSeen(otherUser?.lastSeen)}
                  </p>
                </div>
              </div>

              {/* MEETING OPTIONS BUTTONS */}
              <div className="relative" ref={meetMenuRef}>
                <button 
                  onClick={() => setShowMeetOptions(!showMeetOptions)}
                  className="p-2.5 rounded-full bg-[#193322] hover:bg-[#13ec5b] text-[#13ec5b] hover:text-[#102216] transition-all duration-300 border border-[#23482f]"
                  title="Schedule Meeting"
                >
                  <Video size={20} />
                </button>

                {showMeetOptions && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#112217] border border-[#23482f] rounded-2xl shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in zoom-in duration-200">
                    <p className="px-4 py-2 text-[10px] font-black text-[#92c9a4] uppercase tracking-widest border-b border-[#23482f] mb-1">Select Platform</p>
                    <a href="https://zoom.us/join" target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 hover:bg-[#13ec5b]/10 text-sm font-semibold text-white group">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Zoom Meeting
                      </div>
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 text-[#13ec5b]" />
                    </a>
                    <a href="https://meet.google.com" target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 hover:bg-[#13ec5b]/10 text-sm font-semibold text-white group">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Google Meet
                      </div>
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 text-[#13ec5b]" />
                    </a>
                  </div>
                )}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
              {messages.map((m, idx) => {
                const isMe = (m.sender?._id || m.sender) === myUserId;
                const showDate = idx === 0 || new Date(messages[idx - 1].createdAt).toDateString() !== new Date(m.createdAt).toDateString();
                return (
                  <React.Fragment key={m._id || idx}>
                    {showDate && (
                      <div className="flex justify-center my-6">
                        <span className="text-[10px] font-black text-[#92c9a4] bg-[#112217] px-4 py-1.5 rounded-full border border-[#23482f] uppercase tracking-tighter">
                          {formatDateLabel(m.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`relative max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${isMe ? 'bg-[#13ec5b] text-[#102216] rounded-tr-none' : 'bg-[#193322] text-white rounded-tl-none border border-[#23482f]'}`}>
                        <p className="text-[14px] leading-relaxed pr-8">{m.text}</p>
                        <div className="text-[9px] text-right mt-1 opacity-60 font-bold">{formatMessageTime(m.createdAt)} {isMe && "✓"}</div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <div className="p-6 bg-[#112217] border-t border-[#23482f]">
              <div className="flex items-center gap-3 bg-[#193322] rounded-2xl px-4 py-2 border border-[#23482f] relative">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} onFocus={() => setShowEmojiPicker(false)} placeholder="Type a message..." className="flex-1 bg-transparent border-none focus:ring-0 text-white outline-none"
                 />
                <div className="relative flex items-center">
                  {showEmojiPicker && (
                    <div className="absolute bottom-16 right-0 z-50 shadow-2xl no-scrollbar-picker">
                      <style>{`
                        .no-scrollbar-picker .epr-body::-webkit-scrollbar { width: 0px; background: transparent; }
                        .no-scrollbar-picker .EmojiPickerReact { border: 1px solid #23482f !important; --epr-bg-color: #112217; --epr-category-label-bg-color: #112217; }
                      `}</style>
                      <EmojiPicker 
                        onEmojiClick={(d) => setInputText(p => p + d.emoji)} 
                        theme="dark" 
                        width={320} 
                        height={400} 
                        lazyLoadEmojis={true}
                        searchDisabled={false}
                        skinTonesDisabled={true}
                      />
                    </div>
                  )}
                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-2 transition-colors ${showEmojiPicker ? 'text-[#13ec5b]' : 'text-[#92c9a4] hover:text-[#13ec5b]'}`}><Smile size={22} /></button>
                </div>
                
                <button onClick={handleSend} className="h-10 w-10 bg-[#13ec5b] rounded-xl flex items-center justify-center text-[#102216] hover:scale-105 active:scale-95 transition-all shadow-lg">
                  <Send size={18} fill="currentColor" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#92c9a4] gap-4">
            <div className="p-6 rounded-full bg-[#112217] border border-[#23482f] opacity-20"><Send size={48} /></div>
            <p className="font-bold tracking-widest uppercase text-xs">Select a conversation to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;