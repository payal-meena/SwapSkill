import React from 'react';

const SkillCard = ({ name, rating, reviews, img, offeredSkill, level, wantedSkill, statusColor = 'bg-[#13ec5b]' }) => {
  return (
    <div className="group bg-white dark:bg-[#193322] border border-slate-200 dark:border-[#23482f] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#13ec5b]/5 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img alt={name} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#13ec5b]/20" src={img} />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColor} border-2 border-[#193322] rounded-full`}></span>
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg">{name}</h3>
              <div className="flex items-center text-amber-400 gap-1 mt-0.5">
                <span className="material-symbols-outlined text-sm fill-icon">star</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{rating}</span>
                <span className="text-[10px] text-slate-400">({reviews} reviews)</span>
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-[#13ec5b] transition-colors">
            <span className="material-symbols-outlined">bookmark</span>
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#92c9a4] font-bold mb-2">Offered Skill</p>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-[#102216]/50 p-3 rounded-xl border border-slate-100 dark:border-[#23482f]">
              <span className="text-slate-900 dark:text-white font-semibold">{offeredSkill}</span>
              <span className="bg-[#13ec5b]/20 text-[#13ec5b] text-[10px] font-bold px-2 py-1 rounded">{level}</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#92c9a4] font-bold mb-2">Wanted Skill</p>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className="material-symbols-outlined text-[#13ec5b] text-lg">search</span>
              <span className="font-medium">{wantedSkill}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="py-2.5 rounded-xl border border-slate-200 dark:border-[#326744] text-slate-700 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-[#23482f] transition-all">
            View Profile
          </button>
          <button className="py-2.5 rounded-xl bg-[#13ec5b] text-[#112217] text-sm font-bold hover:bg-[#13ec5b]/90 hover:shadow-lg hover:shadow-[#13ec5b]/20 transition-all">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;