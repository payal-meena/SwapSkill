import React from 'react';

const ExchangeCard = ({ 
  title, 
  status, 
  meta, 
  metaIcon, 
  progress, 
  progressText, 
  image, 
  instructorImg, 
  actionLabel, 
  actionIcon, 
  isTeaching = false 
}) => {
  return (
    <div className="group flex flex-col md:flex-row rounded-2xl bg-white dark:bg-[#193322] border border-slate-100 dark:border-[#23482f] overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={image} 
          alt={title} 
        />
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">{title}</h3>
            <span className="bg-[#13ec5b]/20 text-[#13ec5b] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {status}
            </span>
          </div>
          
          <p className="text-slate-500 dark:text-[#92c9a4] text-sm flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-sm">{metaIcon}</span> 
            {meta}
          </p>

          <div className="w-full bg-slate-100 dark:bg-[#112217] h-2 rounded-full mb-2 overflow-hidden">
            <div 
              className="bg-[#13ec5b] h-full rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-slate-400 dark:text-[#92c9a4] text-xs font-medium">{progressText}</p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex -space-x-3">
            <img 
              className="h-8 w-8 rounded-full border-2 border-white dark:border-[#193322] object-cover" 
              src={instructorImg} 
              alt="Participant" 
            />
            <div className="h-8 w-8 rounded-full border-2 border-white dark:border-[#193322] bg-slate-200 dark:bg-[#23482f] flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-600 dark:text-white">ME</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isTeaching && (
              <button className="h-9 px-4 rounded-xl border border-slate-200 dark:border-[#326744] text-slate-700 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#23482f] transition-colors">
                Curriculum
              </button>
            )}
            <button className="h-9 px-4 rounded-xl bg-[#13ec5b] text-[#112217] text-sm font-bold hover:bg-[#13ec5b]/90 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">{actionIcon}</span> 
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeCard;