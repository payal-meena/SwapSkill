import React from 'react';
import { useNavigate } from 'react-router-dom';


const UserNavbar = ({ userName = "Alex" }) => {

  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-[#23482f] bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md px-8 py-4">
      <div className="flex items-center gap-4">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">
          Welcome back, {userName}!
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-64 hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#92c9a4] text-xl">
            search
          </span>
          <input 
            className="w-full pl-10 pr-4 py-2 rounded-xl border-none bg-slate-100 dark:bg-[#23482f] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92c9a4] text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none" 
            placeholder="Find a skill to learn..." 
            type="text"
          />
        </div>

        <div className="flex gap-3 items-center">
          <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-[#23482f] text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-[#326744] transition-colors relative cursor-pointer">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary"></span>
          </button>

          <div className="flex items-center gap-3 pl-2">
            <div className="h-10 w-10 rounded-full border-2 border-primary overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                className="w-full h-full object-cover" 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                alt="User profile" 
                onClick={()=> navigate("/my-profile")}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;