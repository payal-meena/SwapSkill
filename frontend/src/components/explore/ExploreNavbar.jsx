import React from 'react';

const ExploreNavbar = () => {
  return (
    <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#23482f] px-8 py-6">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">Discover Skills</h2>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <img alt="User" className="w-8 h-8 rounded-full border-2 border-[#102216] object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
              <div className="w-8 h-8 rounded-full border-2 border-[#102216] bg-[#13ec5b] flex items-center justify-center text-[10px] font-bold text-black">AJ</div>
            </div>
            <span className="text-xs text-slate-500 dark:text-[#92c9a4]">1,248 active mentors</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#92c9a4] group-focus-within:text-[#13ec5b] transition-colors">search</span>
            <input 
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none bg-slate-100 dark:bg-[#112217] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92c9a4] text-base focus:ring-2 focus:ring-[#13ec5b]/50 transition-all shadow-inner outline-none" 
              placeholder="Search for skills, users, or topics..." 
              type="text" 
            />
          </div>
          <button className="md:hidden flex items-center justify-center p-3.5 bg-slate-100 dark:bg-[#112217] rounded-2xl text-slate-600 dark:text-white">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreNavbar;