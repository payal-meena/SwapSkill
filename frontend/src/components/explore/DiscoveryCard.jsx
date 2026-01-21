import React from 'react';

const DiscoveryCard = ({ name, role, rating, img, offers, level, bio }) => {
  return (
    <div className="bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#23482f] rounded-2xl p-6 shadow-sm hover:border-[#13ec5b] transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <img className="h-16 w-16 rounded-xl object-cover border-2 border-[#13ec5b33]" src={img} alt={name} />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 bg-[#13ec5b] border-2 border-white dark:border-[#112217] rounded-full"></span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-[#13ec5b]">
            <span className="material-symbols-outlined text-sm fill-icon">star</span>
            <span className="text-xs font-bold">{rating}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-widest">{level}</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">{name}</h3>
        <p className="text-slate-500 dark:text-[#92c9a4] text-xs font-medium">{role}</p>
      </div>

      <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-6 leading-relaxed">
        {bio}
      </p>

      <div className="bg-slate-50 dark:bg-[#10221680] rounded-xl p-3 border border-slate-100 dark:border-[#23482f] mb-6">
        <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#92c9a4] font-bold mb-2 text-center">Teaches</p>
        <div className="flex flex-wrap justify-center gap-2">
          {offers.map((skill, idx) => (
            <span key={idx} className="px-2 py-1 rounded-md bg-[#13ec5b1a] text-[#13ec5b] text-[10px] font-bold border border-[#13ec5b33]">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button className="w-full bg-[#13ec5b] text-[#102216] py-3 rounded-xl font-bold text-sm hover:bg-[#13ec5be6] transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(19,236,91,0.3)]">
        <span className="material-symbols-outlined text-lg">swap_horiz</span>
        Send Swap Request
      </button>
    </div>
  );
};

export default DiscoveryCard;