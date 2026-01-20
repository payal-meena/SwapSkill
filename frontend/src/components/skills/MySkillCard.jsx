import React from 'react';

const MySkillCard = ({ title, level, icon, detail, status, isOffer = true }) => {
  return (
    <div className={`bg-white dark:bg-[#193322] border ${isOffer ? 'border-slate-200 dark:border-[#23482f]' : 'border-dashed border-slate-200 dark:border-[#23482f]'} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`${isOffer ? 'bg-slate-100 dark:bg-[#112217]' : 'bg-primary/5 dark:bg-[#112217]'} p-3 rounded-xl`}>
          <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
        </div>
        <div className="flex gap-1">
          <button className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-xl">edit</span>
          </button>
          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </div>

      <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-1">{title}</h4>
      
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isOffer ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-[#23482f] text-slate-600 dark:text-slate-300'}`}>
          {level}
        </span>
        <span className="text-slate-400 dark:text-[#92c9a4] text-xs font-medium">• {detail}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#23482f]">
        <span className={`flex items-center gap-1.5 text-xs font-bold ${status === 'Active' ? 'text-emerald-500' : status === 'Paused' ? 'text-slate-400' : 'text-primary'}`}>
          {(status === 'Active' || status === 'Paused') && (
             <span className={`h-1.5 w-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          )}
          {status}
        </span>
        
        {isOffer ? (
          <button className="text-primary text-xs font-bold hover:underline cursor-pointer">View Curriculum</button>
        ) : (
          <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-background-dark hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-sm">search</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MySkillCard;