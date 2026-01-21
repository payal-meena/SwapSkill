import React from 'react';

const StatCard = ({ label, value, trend, progress, status, icon }) => {
  const isPositive = trend?.includes('+');

  return (
    <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#23482f] shadow-sm hover:border-[#13ec5b] transition-colors">
      <div className="flex justify-between items-start">
        <p className="text-slate-500 dark:text-[#92c9a4] text-sm font-medium">{label}</p>
        <span className={`material-symbols-outlined text-[#13ec5b]`}>{icon || 'analytics'}</span>
      </div>
      
      <div className="flex items-end gap-3 mt-1">
        <p className="text-slate-900 dark:text-white text-3xl font-bold">{value}</p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
          status 
            ? 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-500 dark:bg-yellow-500/10 dark:border-yellow-500/20' 
            : 'text-[#13ec5b] bg-[#13ec5b1a] border-[#13ec5b33]'
        }`}>
          {trend || status}
        </span>
      </div>

      {progress !== undefined ? (
        <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
          <div 
            className="bg-[#13ec5b] h-full shadow-[0_0_8px_rgba(19,236,91,0.4)] transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      ) : (
        <p className="text-xs text-slate-400 dark:text-[#92c9a4]/60 mt-1">Platform metric</p>
      )}
    </div>
  );
};

export default StatCard;