import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Calendar, 
} from 'lucide-react';

const MessagesPage = () => {
  const [activeChat, setActiveChat] = useState(0);

  const chatList = [
    { id: 0, name: "Sarah Johnson", msg: "Perfect, let's schedule our next Python lesson for Tuesday.", time: "10:45 AM", online: true, status: "Learning Python / Teaching French" },
    { id: 1, name: "James Miller", msg: "Thanks for the feedback on Lesson 3!", time: "Yesterday", online: false },
    { id: 2, name: "Liam Wilson", msg: "Request pending...", time: "Mon", online: false, pending: true },
    { id: 3, name: "Elena Rossi", msg: "The sketching exercise was very helpful.", time: "Oct 12", online: false },
  ];

  return (
    <div className="flex h-screen bg-[#102216] text-white font-sans overflow-hidden">

      <div className="w-80 border-r border-[#23482f] flex flex-col bg-[#102216]">
        <div className="p-6 border-b border-[#23482f]">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92c9a4] group-focus-within:text-[#13ec5b] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-[#112217] text-white placeholder:text-[#92c9a4] text-sm focus:ring-1 focus:ring-[#13ec5b]/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {chatList.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-l-4 ${
                activeChat === chat.id ? 'border-[#13ec5b] bg-[#13ec5b]/5' : 'border-transparent hover:bg-[#193322]/50'
              }`}
            >
              <div className="relative shrink-0">
                <div className="h-12 w-12 rounded-full bg-[#193322] border border-[#23482f] flex items-center justify-center font-bold text-[#13ec5b]">
                  {chat.name.split(' ').map(n => n[0]).join('')}
                </div>
                {chat.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#13ec5b] border-2 border-[#102216]"></span>}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className={`text-sm font-bold truncate ${chat.pending ? 'text-gray-500' : 'text-white'}`}>{chat.name}</h4>
                  <span className="text-[10px] text-[#92c9a4]">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.pending ? 'text-gray-600 italic' : 'text-[#92c9a4]'}`}>{chat.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 flex flex-col bg-[#102216]">
        <header className="h-20 flex items-center justify-between px-8 bg-[#112217] border-b border-[#23482f]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-[#13ec5b] flex items-center justify-center text-[#102216] font-bold uppercase">
                {chatList[activeChat].name[0]}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#13ec5b] border-2 border-[#112217]"></span>
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight">{chatList[activeChat].name}</h3>
              <p className="text-[10px] text-[#13ec5b] font-medium tracking-wide uppercase">
                {chatList[activeChat].status || "Active Conversation"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="h-10 px-4 rounded-xl border border-[#23482f] text-white text-xs font-bold hover:bg-[#193322] transition-all flex items-center gap-2">
              <Calendar size={16} className="text-[#13ec5b]" /> Schedule Session
            </button>
            <button className="h-10 w-10 rounded-xl bg-[#112217] border border-[#23482f] flex items-center justify-center text-white hover:text-[#13ec5b] transition-colors">
              <MoreVertical size={18}/>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          <div className="flex justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#92c9a4] bg-[#112217]/80 backdrop-blur px-4 py-1.5 rounded-full border border-[#23482f]">Today</span>
          </div>

          <MessageBubble 
            isMe={false} 
            text="Hi Alex! I just finished reviewing the dictionary exercises you sent over. You're making great progress with the list comprehensions!" 
            time="10:42 AM" 
            name={chatList[activeChat].name}
          />
          
          <MessageBubble 
            isMe={true} 
            text="That's great to hear! It took a while to click. Are we still on for our call to discuss the project logic?" 
            time="10:44 AM" 
          />

          <MessageBubble 
            isMe={false} 
            text="Perfect, let's schedule our next Python lesson for Tuesday. Does 4 PM work for you?" 
            time="10:45 AM" 
            name={chatList[activeChat].name}
          />
        </div>

        <div className="p-6 bg-[#112217] border-t border-[#23482f]">
          <div className="flex items-center gap-3 bg-[#193322] rounded-2xl px-4 py-2 border border-[#23482f] focus-within:border-[#13ec5b]/50 transition-all">
            <button className="text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-[#92c9a4] outline-none py-2"
            />
            <div className="flex items-center gap-3">
              <button className="text-[#92c9a4] hover:text-[#13ec5b] transition-colors">
                <Smile size={20} />
              </button>
              <button className="h-10 w-10 bg-[#13ec5b] rounded-xl flex items-center justify-center text-[#102216] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#13ec5b]/20">
                <Send size={18} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


const NavItem = ({ icon, label, active = false, badge = null, color = "text-white", to = "/" }) => (
  <Link to={to} className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-[#13ec5b]/10 text-[#13ec5b] shadow-inner shadow-[#13ec5b]/5' : `${color} hover:bg-[#23482f]`
  }`}>
    <div className="flex items-center gap-3">
      {icon}
      <p className="text-sm font-semibold">{label}</p>
    </div>
    {badge && (
      <span className="bg-[#13ec5b] text-[#102216] text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
        {badge}
      </span>
    )}
  </Link>
);

const MessageBubble = ({ isMe, text, time, name }) => (
  <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse ml-auto' : ''}`}>
    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-1 shadow-md ${
      isMe ? 'bg-[#13ec5b] text-[#102216]' : 'bg-[#193322] text-[#13ec5b] border border-[#23482f]'
    }`}>
      {isMe ? 'ME' : name?.split(' ').map(n => n[0]).join('')}
    </div>
    <div className={`space-y-1 ${isMe ? 'items-end flex flex-col' : ''}`}>
      <div className={`p-4 rounded-2xl shadow-lg border leading-relaxed ${
        isMe 
        ? 'bg-[#13ec5b] text-[#102216] rounded-tr-none border-[#13ec5b] font-medium' 
        : 'bg-[#193322] text-white rounded-tl-none border-[#23482f]'
      }`}>
        <p className="text-sm">{text}</p>
      </div>
      <p className="text-[10px] text-[#92c9a4] px-1 font-mono">{time}</p>
    </div>
  </div>
);

export default MessagesPage;