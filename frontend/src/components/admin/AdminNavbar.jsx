import React from 'react';

const AdminNavbar = () => {
  return (
    <header className="h-16 border-b dark:border-[#23482f] bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
      <div className="w-96">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#39FF14] transition-colors">
            search
          </span>
          <input 
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm focus:ring-1 focus:ring-[#39FF14]/40 focus:border-[#39FF14]/40 text-white placeholder:text-slate-600 transition-all outline-none" 
            placeholder="Search for users, skills or exchanges..." 
            type="text" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-[#39FF14] transition-all relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#39FF14] rounded-full border-2 border-black shadow-[0_0_5px_#39FF14]"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-white/5 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-tight">Alex Rivera</p>
            <p className="text-[10px] text-[#39FF14] uppercase font-bold tracking-tighter mt-1">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)] bg-center bg-cover overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;