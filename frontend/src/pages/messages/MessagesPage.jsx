import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chatService';
import { Search, Send, Trash2, Edit2, X, Check, Smile, AlertCircle, Video, Paperclip } from 'lucide-react';
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
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [deleteStep, setDeleteStep] = useState('none');
  const [deleteTarget, setDeleteTarget] = useState({ msgId: null, isMe: false });
  const [tempDeleteMode, setTempDeleteMode] = useState(null);

  const myUserId = getMyId();
  const scrollRef = useRef();
  const fileInputRef = useRef();
  const activeChatIdRef = useRef(null);

  // --- WhatsApp Style Date Logic ---
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
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
      const uniqueChats = getUniqueChats(data);
      setChats(uniqueChats);
    };
    chatService.connectSocket(myUserId);
    const timer = setTimeout(() => { loadInitialData(); }, 100);
    const handleNewMessage = (newMsg) => {
      const msgChatId = newMsg.chat?._id || newMsg.chat;
      setChats(prev => {
        const updated = prev.map(c => 
          (c._id === msgChatId) ? { ...c, lastMessage: newMsg, lastMessageAt: newMsg.createdAt } : c
        );
        return updated.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
      });
      const currentId = activeChatIdRef.current;
      if (currentId === msgChatId) {
        setMessages(prev => {
          if (prev.find(m => m._id === newMsg._id)) return prev;
          return [...prev.filter(m => !m.isTemp || m.text !== newMsg.text), newMsg];
        });
      }
    };
    chatService.onMessageReceived?.(handleNewMessage);
    return () => {
      clearTimeout(timer);
      chatService.removeMessageListener?.();
    };
  }, [myUserId]);

  useEffect(() => {
    if (activeChat?._id) {
      activeChatIdRef.current = activeChat._id;
      chatService.joinChat?.(activeChat._id, myUserId);
      chatService.getChatHistory(activeChat._id).then(setMessages);
    }
  }, [activeChat?._id]);

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;
    if (editingMessage) {
      chatService.editMessage?.(editingMessage.id, inputText.trim(), activeChat._id);
      setMessages(prev => prev.map(m => 
        m._id === editingMessage.id ? { ...m, text: inputText.trim(), isEdited: true, updatedAt: new Date().toISOString() } : m
      ));
      setEditingMessage(null);
    } else {
      const tempId = "temp-" + Date.now();
      const newMessage = {
        _id: tempId,
        sender: myUserId,
        text: inputText.trim(),
        createdAt: new Date().toISOString(),
        isTemp: true 
      };
      setMessages(prev => [...prev, newMessage]);
      chatService.sendMessage(activeChat._id, myUserId, inputText.trim());
      setChats(prev => prev.map(c => c._id === activeChat._id ? { ...c, lastMessage: newMessage } : c));
    }
    setInputText("");
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && activeChat) {
      chatService.sendFile?.(activeChat._id, myUserId, file);
      // Optional: Add temporary UI message for "Sending file..."
    }
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

  return (
    <div className="relative flex h-[calc(100vh-80px)] w-full bg-[#102216] text-white overflow-hidden">
      
      {/* Scrollbar Fix for Emoji Picker */}
      <style>
        {`
          .EmojiPickerReact .epr-body::-webkit-scrollbar { display: none !important; }
          .EmojiPickerReact .epr-body { -ms-overflow-style: none !important; scrollbar-width: none !important; }
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
              <div key={chat._id} onClick={() => setActiveChat(chat)} 
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-[#1a3322] ${activeChat?._id === chat._id ? 'bg-[#13ec5b]/10 border-r-4 border-[#13ec5b]' : 'hover:bg-white/5'}`}>
                <img src={p?.profileImage || `https://ui-avatars.com/api/?name=${p?.name}&bg=13ec5b&color=000`} className="h-11 w-11 rounded-full border border-[#23482f]" />
                <div className="flex-1 truncate">
                    <h4 className="text-sm font-bold">{p?.name}</h4>
                    <p className="text-xs truncate text-[#92c9a4]">
                      {isMeLast ? 'You: ' : ''}{chat.lastMessage?.text || "Chat now"}
                    </p>
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
              <div className="flex items-center">
                <img src={otherUser?.profileImage || `https://ui-avatars.com/api/?name=${otherUser?.name}&bg=13ec5b&color=000`} className="h-10 w-10 rounded-full mr-4" />
                <div><h3 className="font-bold">{otherUser?.name}</h3><p className="text-[10px] text-[#13ec5b]">● Online</p></div>
              </div>

              {/* VIDEO CALL HOVER DROPDOWN */}
              <div className="relative group">
                <button className="p-2 text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
                  <Video size={24} />
                </button>
                
                {/* Options appear on Hover */}
                <div className="absolute right-0 top-10 w-40 bg-[#193322] border border-[#23482f] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                  <button onClick={() => window.open('https://zoom.us/start/videohost', '_blank')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                    <div className="w-6 h-6 bg-[#2D8CFF] rounded flex items-center justify-center text-[14px] font-black italic">Z</div>
                    <span className="text-xs font-bold">Zoom</span>
                  </button>
                  <button onClick={() => window.open('https://meet.google.com/new', '_blank')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-t border-[#23482f]">
                    <div className="w-6 h-6 bg-white rounded flex items-center justify-center font-bold text-blue-500 text-[14px]">M</div>
                    <span className="text-xs font-bold">Google Meet</span>
                  </button>
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
                      <div className="relative group max-w-[70%]">
                        {!isDeleted && (
                          <div className={`absolute -top-8 flex bg-[#1a3322] border border-[#23482f] rounded-lg opacity-0 group-hover:opacity-100 transition-all z-20 ${isMe ? 'right-0' : 'left-0'}`}>
                            {isMe && <button onClick={() => { setEditingMessage({id: m._id, text: m.text}); setInputText(m.text); }} className="p-2 hover:bg-white/10 text-[#92c9a4]"><Edit2 size={14}/></button>}
                            <button onClick={() => { setDeleteTarget({ msgId: m._id, isMe }); setDeleteStep('options'); }} className="p-2 hover:bg-red-500/20 text-red-400"><Trash2 size={14}/></button>
                          </div>
                        )}
                        <div className={`px-4 py-2 rounded-2xl shadow-sm ${isDeleted ? 'border border-[#23482f] italic text-gray-500' : isMe ? 'bg-[#13ec5b] text-black rounded-tr-none' : 'bg-[#193322] text-white border border-[#23482f] rounded-tl-none'}`}>
                          <p className="text-sm">{m.text}</p>
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
              <div className="flex items-center gap-3 bg-[#193322] rounded-2xl px-4 py-2 border border-[#23482f] relative">
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-[#92c9a4] hover:text-[#13ec5b]"><Smile size={22} /></button>
                
                {/* FILE UPLOAD ICON */}
                <button onClick={() => fileInputRef.current.click()} className="text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
                  <Paperclip size={20} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

                <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 bg-transparent outline-none text-sm" />
                
                <button onClick={handleSend} className="bg-[#13ec5b] p-2 rounded-lg text-black transition-transform active:scale-90">
                  {editingMessage ? <Check size={18}/> : <Send size={18}/>}
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-0 z-50">
                    <EmojiPicker onEmojiClick={(e) => setInputText(p => p + e.emoji)} theme="dark" width={300} height={400} />
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