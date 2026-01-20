import React from 'react';

const RequestCard = ({ name, location, rating, time, wants, offers, message, img, online = false }) => {
  return (
    <div className="bg-white dark:bg-[#193322] border border-slate-200 dark:border-[#23482f] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
              <div className="relative">
                <img alt={name} className="h-14 w-14 rounded-xl object-cover" src={img} />
                {online && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 bg-primary border-2 border-white dark:border-[#193322] rounded-full"></span>
                )}
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white text-lg font-bold">{name}</h3>
                <p className="text-slate-500 dark:text-[#92c9a4] text-sm">{location} • {rating} ★</p>
              </div>
            </div>
            <span className="text-slate-400 dark:text-[#92c9a4] text-xs">{time}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-[#112217] p-3 rounded-xl border border-slate-100 dark:border-[#23482f]">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#92c9a4] font-bold mb-1">Wants to learn</p>
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-lg">code</span> {wants}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-[#112217] p-3 rounded-xl border border-slate-100 dark:border-[#23482f]">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#92c9a4] font-bold mb-1">Offers in exchange</p>
              <div className="flex items-center gap-2 text-white dark:text-slate-200 font-bold">
                <span className="material-symbols-outlined text-lg">language</span> {offers}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#112217]/50 p-4 rounded-xl border border-dashed border-slate-200 dark:border-[#326744]">
            <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed">"{message}"</p>
          </div>
        </div>

        <div className="flex md:flex-col justify-end gap-3 min-w-[160px]">
          <button className="flex-1 bg-primary text-[#112217] py-2.5 px-4 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-lg">check_circle</span> Accept
          </button>
          <button className="flex-1 border border-slate-200 dark:border-[#326744] text-slate-700 dark:text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-slate-100 dark:hover:bg-[#23482f] transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-lg">cancel</span> Decline
          </button>
          <button className="flex-1 border border-transparent text-slate-500 dark:text-[#92c9a4] py-2.5 px-4 rounded-xl font-medium text-sm hover:text-primary transition-all underline cursor-pointer">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;