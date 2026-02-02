// import React, { useState ,useEffect} from 'react';
// import { Link } from 'react-router-dom';
// import { chatService } from '../../services/chatService';


// import { 
//   Search, 
//   Send, 
//   Paperclip, 
//   Smile, 
//   MoreVertical, 
//   Calendar, 
// } from 'lucide-react';

// const MessagesPage = () => {
//   const [activeChat, setActiveChat] = useState(0);

//    useEffect(()=>
//     {
//       chatService.connectSocket(myUserId); // Example userId
//       chatService.getMyChats().then((chats)=>{
//         console.log("My Chats:", chats);

//       })
//    })

//   const chatList = [
//     { id: 0, name: "Sarah Johnson", msg: "Perfect, let's schedule our next Python lesson for Tuesday.", time: "10:45 AM", online: true, status: "Learning Python / Teaching French" },
//     { id: 1, name: "James Miller", msg: "Thanks for the feedback on Lesson 3!", time: "Yesterday", online: false },
//     { id: 2, name: "Liam Wilson", msg: "Request pending...", time: "Mon", online: false, pending: true },
//     { id: 3, name: "Elena Rossi", msg: "The sketching exercise was very helpful.", time: "Oct 12", online: false },
//   ];

//   return (
//     <div className="flex h-screen bg-[#102216] text-white font-sans overflow-hidden">

//       <div className="w-80 border-r border-[#23482f] flex flex-col bg-[#102216]">
//         <div className="p-6 border-b border-[#23482f]">
//           <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
//           <div className="relative group">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92c9a4] group-focus-within:text-[#13ec5b] transition-colors" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search chats..." 
//               className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-[#112217] text-white placeholder:text-[#92c9a4] text-sm focus:ring-1 focus:ring-[#13ec5b]/50 outline-none transition-all"
//             />
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto custom-scrollbar">
//           {chatList.map((chat) => (
//             <div 
//               key={chat.id}
//               onClick={() => setActiveChat(chat.id)}
//               className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4 ${
//                 activeChat === chat.id ? 'border-[#13ec5b] bg-[#13ec5b]/5' : 'border-transparent hover:bg-[#193322]/50'
//               }`}
//             >
//               <div className="relative shrink-0">
//                 <div className="h-12 w-12 rounded-full bg-[#193322] border border-[#23482f] flex items-center justify-center font-bold text-[#13ec5b]">
//                   {chat.name.split(' ').map(n => n[0]).join('')}
//                 </div>
//                 {chat.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#13ec5b] border-2 border-[#102216]"></span>}
//               </div>
//               <div className="flex-1 overflow-hidden">
//                 <div className="flex justify-between items-center mb-0.5">
//                   <h4 className={`text-sm font-bold truncate ${chat.pending ? 'text-gray-500' : 'text-white'}`}>{chat.name}</h4>
//                   <span className="text-[10px] text-[#92c9a4]">{chat.time}</span>
//                 </div>
//                 <p className={`text-xs truncate ${chat.pending ? 'text-gray-600 italic' : 'text-[#92c9a4]'}`}>{chat.msg}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <main className="flex-1 flex flex-col bg-[#102216]">
//         <header className="h-20 flex items-center justify-between px-8 bg-[#112217] border-b border-[#23482f]">
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <div className="h-10 w-10 rounded-full bg-[#13ec5b] flex items-center justify-center text-[#102216] font-bold uppercase">
//                 {chatList[activeChat].name[0]}
//               </div>
//               <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#13ec5b] border-2 border-[#112217]"></span>
//             </div>
//             <div>
//               <h3 className="font-bold text-white leading-tight">{chatList[activeChat].name}</h3>
//               <p className="text-[10px] text-[#13ec5b] font-medium tracking-wide uppercase">
//                 {chatList[activeChat].status || "Active Conversation"}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <button className="h-10 px-4 rounded-xl border border-[#23482f] text-white text-xs font-bold hover:bg-[#193322] transition-all flex items-center gap-2">
//               <Calendar size={16} className="text-[#13ec5b]" /> Schedule Session
//             </button>
//             <button className="h-10 w-10 rounded-xl bg-[#112217] border border-[#23482f] flex items-center justify-center text-white hover:text-[#13ec5b] transition-colors">
//               <MoreVertical size={18}/>
//             </button>
//           </div>
//         </header>

//         <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
//           <div className="flex justify-center">
//             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#92c9a4] bg-[#112217]/80 backdrop-blur px-4 py-1.5 rounded-full border border-[#23482f]">Today</span>
//           </div>

//           <MessageBubble 
//             isMe={false} 
//             text="Hi Alex! I just finished reviewing the dictionary exercises you sent over. You're making great progress with the list comprehensions!" 
//             time="10:42 AM" 
//             name={chatList[activeChat].name}
//           />

//           <MessageBubble 
//             isMe={true} 
//             text="That's great to hear! It took a while to click. Are we still on for our call to discuss the project logic?" 
//             time="10:44 AM" 
//           />

//           <MessageBubble 
//             isMe={false} 
//             text="Perfect, let's schedule our next Python lesson for Tuesday. Does 4 PM work for you?" 
//             time="10:45 AM" 
//             name={chatList[activeChat].name}
//           />
//         </div>

//         <div className="p-6 bg-[#112217] border-t border-[#23482f]">
//           <div className="flex items-center gap-3 bg-[#193322] rounded-2xl px-4 py-2 border border-[#23482f] focus-within:border-[#13ec5b]/50 transition-all">
//             <button className="text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
//               <Paperclip size={20} />
//             </button>
//             <input 
//               type="text" 
//               placeholder="Type your message..." 
//               className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-[#92c9a4] outline-none py-2"
//             />
//             <div className="flex items-center gap-3">
//               <button className="text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
//                 <Smile size={20} />
//               </button>
//               <button className="h-10 w-10 bg-[#13ec5b] rounded-xl flex items-center justify-center text-[#102216] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#13ec5b]/20">
//                 <Send size={18} fill="currentColor" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };


// const NavItem = ({ icon, label, active = false, badge = null, color = "text-white", to = "/" }) => (
//   <Link to={to} className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
//     active ? 'bg-[#13ec5b]/10 text-[#13ec5b] shadow-inner shadow-[#13ec5b]/5' : `${color} hover:bg-[#23482f]`
//   }`}>
//     <div className="flex items-center gap-3">
//       {icon}
//       <p className="text-sm font-semibold">{label}</p>
//     </div>
//     {badge && (
//       <span className="bg-[#13ec5b] text-[#102216] text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
//         {badge}
//       </span>
//     )}
//   </Link>
// );

// const MessageBubble = ({ isMe, text, time, name }) => (
//   <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse ml-auto' : ''}`}>
//     <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-1 shadow-md ${
//       isMe ? 'bg-[#13ec5b] text-[#102216]' : 'bg-[#193322] text-[#13ec5b] border border-[#23482f]'
//     }`}>
//       {isMe ? 'ME' : name?.split(' ').map(n => n[0]).join('')}
//     </div>
//     <div className={`space-y-1 ${isMe ? 'items-end flex flex-col' : ''}`}>
//       <div className={`p-4 rounded-2xl shadow-lg border leading-relaxed ${
//         isMe 
//         ? 'bg-[#13ec5b] text-[#102216] rounded-tr-none border-[#13ec5b] font-medium' 
//         : 'bg-[#193322] text-white rounded-tl-none border-[#23482f]'
//       }`}>
//         <p className="text-sm">{text}</p>
//       </div>
//       <p className="text-[10px] text-[#92c9a4] px-1 font-mono">{time}</p>
//     </div>
//   </div>
// );

// export default MessagesPage;

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { chatService } from '../../services/chatService';
// import { Search, Send, Smile, MoreVertical, Calendar } from 'lucide-react';
// import EmojiPicker from 'emoji-picker-react';

// const getMyId = () => {
//   const token = localStorage.getItem('token');
//   if (!token) return null;
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const payload = JSON.parse(window.atob(base64));
//     return payload.id || payload._id;
//   } catch (e) { return null; }
// };

// const MessagesPage = () => {
//   const { userId: userIdFromParams } = useParams();
//   const [chats, setChats] = useState([]);
//   const [activeChat, setActiveChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
//   const [showDeletePopup, setShowDeletePopup] = useState(false);

//   const myUserId = getMyId();
//   const scrollRef = useRef();

//   // --- HELPERS ---
//   const formatMessageTime = (dateString) => {
//     if (!dateString) return "";
//     return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
//   };

//   const formatDateLabel = (dateString) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     if (date.toDateString() === today.toDateString()) return "Today";
//     return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
//   };

//   const formatLastSeen = (dateString) => {
//     if (!dateString) return "Offline";
//     const date = new Date(dateString);
//     const diff = Math.floor((new Date() - date) / 60000);
//     if (diff < 1) return "Last seen just now";
//     if (diff < 60) return `Last seen ${diff}m ago`;
//     return `Last seen ${Math.floor(diff / 60)}h ago`;
//   };

//   // --- SOCKET & CHAT LIST LOAD ---
//   useEffect(() => {
//     if (!myUserId) return;
//     chatService.connectSocket(myUserId);

//     const loadInitialData = async () => {
//       try {
//         const data = await chatService.getMyChats();
//         setChats(data);
//         if (userIdFromParams) {
//           const existing = data.find(c => c.participants.some(p => (p._id || p) === userIdFromParams));
//           if (existing) setActiveChat(existing);
//         }
//       } catch (err) { console.error("Load Chats Error:", err); }
//     };
//     loadInitialData();
// const activeChatRef = useRef(activeChat);

// // Jab bhi activeChat badle, ref ko update karein
// useEffect(() => {
//   activeChatRef.current = activeChat;
// }, [activeChat]);

//     // MESSAGE LISTENER
//   chatService.onMessageReceived((newMsg) => {
//   const msgChatId = newMsg.chat?._id || newMsg.chat;
//   const senderId = newMsg.sender?._id || newMsg.sender;
  
//   // Ref se latest activeChat uthayein (Stale closure fix)
//   const currentActiveChat = activeChatRef.current;

//   // 1. Sidebar update logic
//   setChats(prevChats => {
//     const otherChats = prevChats.filter(c => c._id !== msgChatId);
//     const targetChat = prevChats.find(c => c._id === msgChatId);

//     if (targetChat) {
//       const isCurrentlyViewing = currentActiveChat?._id === msgChatId;

//       const updatedChat = {
//         ...targetChat,
//         // Agar main dekh raha hoon toh isRead true, warna false
//         lastMessage: { 
//           ...newMsg, 
//           isRead: isCurrentlyViewing && senderId !== myUserId 
//         },
//         updatedAt: new Date()
//       };

//       if (isCurrentlyViewing && senderId !== myUserId) {
//         chatService.markAsRead(msgChatId, myUserId);
//       }

//       return [updatedChat, ...otherChats]; // Message aate hi chat list mein upar le aao
//     }
//     return prevChats;
//   });

//   // 2. Messages screen update logic
//   // Check karein ki message usi chat ka hai jo abhi open hai
//   if (currentActiveChat?._id === msgChatId) {
//     if (senderId !== myUserId) {
//       setMessages(prevMsgs => {
//         const isDup = prevMsgs.some(m => m._id === newMsg._id);
//         return isDup ? prevMsgs : [...prevMsgs, newMsg];
//       });
//     }
//   }
// });

//     // STATUS LISTENER
//     chatService.onUserStatusChanged(({ userId, status, lastSeen }) => {
//       const isOnline = status === 'online';
//       setChats(prev => prev.map(c => ({
//         ...c,
//         participants: c.participants.map(p => (p._id || p) === userId ? { ...p, isOnline, lastSeen } : p)
//       })));
//       setActiveChat(prev => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           participants: prev.participants.map(p => (p._id || p) === userId ? { ...p, isOnline, lastSeen } : p)
//         };
//       });
//     });

//     return () => {
//       chatService.removeMessageListener();
//       chatService.removeStatusListener();
//     };
//   }, [myUserId]);

//   // --- JOIN CHAT & HISTORY ---
//   useEffect(() => {
//     if (activeChat?._id) {
//       chatService.joinChat(activeChat._id, myUserId);
//       chatService.getChatHistory(activeChat._id).then(setMessages);
//     }
//   }, [activeChat?._id, myUserId]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // --- ACTIONS ---
//   const handleSend = () => {
//     if (!inputText.trim() || !activeChat) return;
//     const tempMsg = {
//       _id: "temp-" + Date.now(),
//       text: inputText,
//       sender: { _id: myUserId },
//       createdAt: new Date().toISOString(),
//       chat: activeChat._id
//     };
//     setMessages(prev => [...prev, tempMsg]);
//     chatService.sendMessage(activeChat._id, myUserId, inputText);
//     setInputText("");
//     setShowEmojiPicker(false);
//   };
//   const handleChatClick = (chat) => {
//     setActiveChat(chat);

//     // Agar last message saamne wale ne bheja hai aur wo unread hai
//     if (chat.lastMessage && chat.lastMessage.sender !== myUserId && !chat.lastMessage.isRead) {
//       // Socket ke zariye "read" event bhejo
//       chatService.markAsRead(chat._id, myUserId);

//       // Local state update karo taaki turant dot hat jaye
//       setChats(prev => prev.map(c =>
//         c._id === chat._id
//           ? { ...c, lastMessage: { ...c.lastMessage, isRead: true } }
//           : c
//       ));
//     }
//   };
//   const otherUser = activeChat?.participants.find(p => (p._id || p) !== myUserId);

//   return (
//     <div className="flex h-screen bg-[#102216] text-white overflow-hidden font-sans">
//       {/* SIDEBAR */}
//       <div className="w-80 border-r border-[#23482f] flex flex-col bg-[#102216]">
//         <div className="p-6 border-b border-[#23482f]">
//           <h2 className="text-xl font-bold mb-4">Messages</h2>
//           <div className="relative group">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92c9a4]" size={18} />
//             <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#112217] outline-none border border-transparent focus:border-[#13ec5b]/50 text-sm" />
//           </div>
//         </div>
//         <div className="flex-1 overflow-y-auto custom-scrollbar">

//           {chats.map((chat) => {
//             const p = chat.participants.find(u => (u._id || u) !== myUserId);

//             // Logic: Agar last message kisi aur ne bheja hai aur wo "unread" hai
//             const isUnread = chat.lastMessage &&
//               (chat.lastMessage.sender?._id || chat.lastMessage.sender) !== myUserId &&
//               chat.lastMessage.isRead === false;

//             return (
//               <div
//                 key={chat._id}
//                 onClick={() => handleChatClick(chat)}
//                 className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4 ${activeChat?._id === chat._id ? 'border-[#13ec5b] bg-[#13ec5b]/5' : 'border-transparent hover:bg-[#193322]/50'
//                   }`}
//               >
//                 <div className="relative shrink-0">
//                   <img
//                     src={p?.profileImage || `https://ui-avatars.com/api/?name=${p?.name || 'U'}&bg=13ec5b&color=000`}
//                     className="h-12 w-12 rounded-full border border-[#23482f]"
//                   />
//                   {p?.isOnline && (
//                     <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#13ec5b] border-2 border-[#102216]"></span>
//                   )}
//                 </div>

//                 <div className="flex-1 truncate">
//                   <div className="flex justify-between items-center mb-0.5">
//                     {/* Unread hone par naam Bold aur White dikhega */}
//                     <h4 className={`text-sm truncate ${isUnread ? 'font-black text-white' : 'font-bold text-[#92c9a4]'}`}>
//                       {p?.name || "User"}
//                     </h4>

//                     {/* GREEN DOT INDICATOR */}
//                     {isUnread && (
//                       <span className="h-2.5 w-2.5 bg-[#13ec5b] rounded-full shadow-[0_0_10px_#13ec5b] animate-pulse shrink-0"></span>
//                     )}
//                   </div>

//                   {/* Unread hone par message text bhi white dikhega */}
//                   <p className={`text-xs truncate ${isUnread ? 'text-white font-semibold' : 'text-[#92c9a4]'}`}>
//                     {chat.lastMessage?.text || "No messages yet"}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* CHAT WINDOW */}
//       <main className="flex-1 flex flex-col relative">
//         {activeChat ? (
//           <>
//             <header className="h-20 flex items-center justify-between px-8 bg-[#112217] border-b border-[#23482f] z-10">
//               <div className="flex items-center gap-4">
//                 <div className="h-10 w-10 rounded-full bg-[#13ec5b] text-[#102216] flex items-center justify-center font-bold uppercase">
//                   <img
//                   src={
//                     otherUser?.profileImage
//                       ? (otherUser.profileImage.startsWith('http')
//                         ? otherUser.profileImage
//                         : `http://localhost:5000${otherUser.profileImage.startsWith('/') ? '' : '/'}${otherUser.profileImage}`)
//                       : `https://ui-avatars.com/api/?name=${otherUser?.name || 'U'}&bg=13ec5b&color=000&bold=true`
//                   }
//                   className="h-10 w-10 rounded-full border border-[#23482f] object-cover"
//                   alt={otherUser?.name}
//                   onError={(e) => {
//                     e.target.src = `https://ui-avatars.com/api/?name=${otherUser?.name || 'U'}&bg=13ec5b&color=000&bold=true`;
//                   }}
//                 /></div>
                
//                 <div>
//                   <h3 className="font-bold">{otherUser?.name || "Unknown"}</h3>
//                   <p className={`text-[10px] font-bold uppercase ${otherUser?.isOnline ? 'text-[#13ec5b]' : 'text-[#92c9a4]'}`}>
//                     {otherUser?.isOnline ? '● Active Now' : formatLastSeen(otherUser?.lastSeen)}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
//               {messages.map((m, idx) => {
//                 const isMe = (m.sender?._id || m.sender) === myUserId;
//                 const showDate = idx === 0 || new Date(messages[idx - 1].createdAt).toDateString() !== new Date(m.createdAt).toDateString();
//                 return (
//                   <React.Fragment key={m._id || idx}>
//                     {showDate && (
//                       <div className="flex justify-center my-6">
//                         <span className="text-[10px] font-bold text-[#92c9a4] bg-[#112217] px-4 py-1 rounded-full border border-[#23482f]">{formatDateLabel(m.createdAt)}</span>
//                       </div>
//                     )}
//                     <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
//                       <div className={`relative max-w-[75%] px-3 pt-2 pb-1 rounded-2xl shadow-md ${isMe ? 'bg-[#13ec5b] text-[#102216] rounded-tr-none' : 'bg-[#193322] text-white rounded-tl-none border border-[#23482f]'}`}>
//                         <p className="text-sm pr-10">{m.text}</p>
//                         <div className="text-[9px] self-end text-right mt-1 opacity-70">{formatMessageTime(m.createdAt)} {isMe && "✓✓"}</div>
//                       </div>
//                     </div>
//                   </React.Fragment>
//                 );
//               })}
//               <div ref={scrollRef} />
//             </div>

//             <div className="p-6 bg-[#112217] border-t border-[#23482f]">
//               <div className="flex items-center gap-3 bg-[#193322] rounded-2xl px-4 py-2 border border-[#23482f] relative">
//                 <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 bg-transparent border-none focus:ring-0 text-white outline-none" />
//                 <div className="relative flex items-center">
//                   {showEmojiPicker && <div className="absolute bottom-14 right-0 z-50"><EmojiPicker onEmojiClick={(d) => setInputText(p => p + d.emoji)} theme="dark" width={300} height={400} /></div>}
//                   <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-1 ${showEmojiPicker ? 'text-[#13ec5b]' : 'text-[#92c9a4]'}`}><Smile size={24} /></button>
//                 </div>
//                 <button onClick={handleSend} className="h-10 w-10 bg-[#13ec5b] rounded-xl flex items-center justify-center text-[#102216] hover:scale-105 transition-all"><Send size={18} fill="currentColor" /></button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-[#92c9a4]">Select a conversation to start chatting</div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default MessagesPage;
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import { Search, Send, Smile } from 'lucide-react';
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

  const myUserId = getMyId();
  const scrollRef = useRef();
  
  // 🔥 IMPORTANT: activeChatRef ko function level par rakhein taaki listener hamesha latest value paye
  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // --- SOCKET LISTENERS ---
  useEffect(() => {
    if (!myUserId) return;
    chatService.connectSocket(myUserId);

    // 1. Initial Data Load
    chatService.getMyChats().then(data => {
      setChats(data);
      if (userIdFromParams) {
        const existing = data.find(c => c.participants.some(p => (p._id || p) === userIdFromParams));
        if (existing) setActiveChat(existing);
      }
    });

    // 2. REAL-TIME MESSAGE RECEIVED (BINA REFRESH)
    chatService.onMessageReceived((newMsg) => {
      const msgChatId = newMsg.chat?._id || newMsg.chat;
      const senderId = newMsg.sender?._id || newMsg.sender;
      const currentActiveChat = activeChatRef.current;

      // Logic for Message Screen update
      if (currentActiveChat?._id === msgChatId) {
        if (senderId !== myUserId) {
          setMessages(prev => {
            const isDup = prev.some(m => m._id === newMsg._id);
            return isDup ? prev : [...prev, newMsg];
          });
          chatService.markAsRead(msgChatId, myUserId);
        }
      }

      // Logic for Sidebar Update (Bring to Top)
      setChats(prevChats => {
        const targetChat = prevChats.find(c => c._id === msgChatId);
        const otherChats = prevChats.filter(c => c._id !== msgChatId);

        if (targetChat) {
          const isNowViewing = currentActiveChat?._id === msgChatId;
          return [{
            ...targetChat,
            lastMessage: { 
              ...newMsg, 
              isRead: isNowViewing || senderId === myUserId 
            },
            updatedAt: new Date()
          }, ...otherChats];
        }
        return prevChats;
      });
    });

    // 3. ONLINE/OFFLINE STATUS SYNC
    chatService.onUserStatusChanged(({ userId, status, lastSeen }) => {
      const isOnline = status === 'online';
      const updateStatus = (list) => list.map(c => ({
        ...c,
        participants: c.participants.map(p => (p._id || p) === userId ? { ...p, isOnline, lastSeen } : p)
      }));
      setChats(updateStatus);
      setActiveChat(prev => prev ? updateStatus([prev])[0] : null);
    });

    return () => {
      chatService.removeMessageListener();
      chatService.removeStatusListener();
    };
  }, [myUserId, activeChat?._id]);

  // --- CHAT SELECTION & HISTORY ---
  useEffect(() => {
    if (activeChat?._id) {
      chatService.joinChat(activeChat._id, myUserId);
      chatService.getChatHistory(activeChat._id).then(setMessages);
    }
  }, [activeChat?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;
    
    // Optimistic UI update (Self message)
    const tempId = "temp-" + Date.now();
    setMessages(prev => [...prev, {
      _id: tempId,
      text: inputText,
      sender: { _id: myUserId },
      createdAt: new Date().toISOString()
    }]);

    chatService.sendMessage(activeChat._id, myUserId, inputText);
    setInputText("");
    setShowEmojiPicker(false);
  };

  const handleChatClick = (chat) => {
    setActiveChat(chat);
    const senderId = chat.lastMessage?.sender?._id || chat.lastMessage?.sender;
    if (senderId !== myUserId && !chat.lastMessage?.isRead) {
      chatService.markAsRead(chat._id, myUserId);
    }
  };

  // --- RENDERING HELPERS ---
  const otherUser = activeChat?.participants.find(p => (p._id || p) !== myUserId);

  return (
    <div className="flex h-screen bg-[#102216] text-white overflow-hidden font-sans">
      {/* Sidebar */}
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
            const isUnread = chat.lastMessage && 
                           (chat.lastMessage.sender?._id || chat.lastMessage.sender) !== myUserId && 
                           !chat.lastMessage.isRead;
            return (
              <div key={chat._id} onClick={() => handleChatClick(chat)} className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4 ${activeChat?._id === chat._id ? 'border-[#13ec5b] bg-[#13ec5b]/5' : 'border-transparent hover:bg-[#193322]/50'}`}>
                <div className="relative shrink-0">
                  <img src={p?.profileImage || `https://ui-avatars.com/api/?name=${p?.name || 'U'}&bg=13ec5b&color=000`} className="h-12 w-12 rounded-full border border-[#23482f]" alt="" />
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

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {activeChat ? (
          <>
            <header className="h-20 flex items-center justify-between px-8 bg-[#112217] border-b border-[#23482f]">
              <div className="flex items-center gap-4">
                <img src={otherUser?.profileImage || `https://ui-avatars.com/api/?name=${otherUser?.name || 'U'}&bg=13ec5b&color=000`} className="h-10 w-10 rounded-full border border-[#23482f] object-cover" alt="" />
                <div>
                  <h3 className="font-bold text-white">{otherUser?.name || "Unknown"}</h3>
                  <p className={`text-[10px] font-bold uppercase ${otherUser?.isOnline ? 'text-[#13ec5b]' : 'text-[#92c9a4]'}`}>
                    {otherUser?.isOnline ? '● Active Now' : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="relative" ref={meetMenuRef}>
                <button
                  onClick={() => setShowMeetOptions(!showMeetOptions)}
                  className="p-2.5 rounded-full bg-[#193322] hover:bg-[#13ec5b] text-[#13ec5b] hover:text-[#102216] transition-all duration-300 border border-[#23482f]"
                >
                  <Video size={20} />
                </button>

                {showMeetOptions && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#112217] border border-[#23482f] rounded-2xl shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in zoom-in duration-200">
                    <p className="px-4 py-2 text-[10px] font-black text-[#92c9a4] uppercase tracking-widest border-b border-[#23482f] mb-1">Select Platform</p>
                    <a href="https://zoom.us/join" target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 hover:bg-[#13ec5b]/10 text-sm font-semibold text-white group">
                      <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Zoom</div>
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 text-[#13ec5b]" />
                    </a>
                    <a href="https://meet.google.com" target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 hover:bg-[#13ec5b]/10 text-sm font-semibold text-white group">
                      <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-500"></span> Google Meet</div>
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 text-[#13ec5b]" />
                    </a>
                  </div>
                )}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 hide-scrollbar">
              {messages.map((m, idx) => {
                const isMe = (m.sender?._id || m.sender) === myUserId;
                return (
                  <div key={m._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`relative max-w-[75%] px-3 pt-2 pb-1 rounded-2xl shadow-md ${isMe ? 'bg-[#13ec5b] text-[#102216] rounded-tr-none' : 'bg-[#193322] text-white rounded-tl-none border border-[#23482f]'}`}>
                      <p className="text-sm">{m.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <div className="p-6 bg-[#112217] border-t border-[#23482f]">
              <div className="flex items-center gap-3 bg-[#193322] rounded-2xl px-4 py-2 border border-[#23482f]">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 bg-transparent border-none focus:ring-0 text-white outline-none" />
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-[#92c9a4] hover:text-[#13ec5b]"><Smile size={24} /></button>
                <button onClick={handleSend} className="h-10 w-10 bg-[#13ec5b] rounded-xl flex items-center justify-center text-[#102216] hover:scale-105 transition-all"><Send size={18} fill="currentColor" /></button>
              </div>
              {showEmojiPicker && <div className="absolute bottom-24 right-10"><EmojiPicker onEmojiClick={(d) => setInputText(p => p + d.emoji)} theme="dark" /></div>}
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