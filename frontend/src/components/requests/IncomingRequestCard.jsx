import React from 'react';

const IncomingRequestCard = ({ name, role, rating, img, offers, wants, message }) => {
  return (
    <div className="bg-[#19332266] backdrop-blur-md border border-[#3267444d] rounded-2xl p-6 transition-all hover:shadow-[0_8px_30px_rgb(19,236,91,0.05)]">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img 
            className="h-16 w-16 rounded-xl object-cover border-2 border-[#13ec5b4d]" 
            src={img} 
            alt={name} 
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{name}</h3>
              <p className="text-slate-400 text-sm">{role} • {rating} Rating</p>
            </div>
            <div className="flex gap-2">
              <button className="px-6 py-2 rounded-xl bg-[#13ec5b] text-[#102216] font-bold text-sm hover:bg-[#13ec5be6] transition-all hover:scale-[1.02]">
                Accept Request
              </button>
              <button className="px-6 py-2 rounded-xl border border-[#326744] text-white font-medium text-sm hover:bg-white/5 transition-all">
                Decline
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <SkillBox label="Skill he offers" value={offers} icon="translate" isPrimary />
            <SkillBox label="Skill he wants" value={wants} icon="code" />
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute -left-2 -top-2 text-[#13ec5b] opacity-20 text-3xl">format_quote</span>
            <p className="text-slate-300 italic text-sm pl-6 border-l-2 border-[#13ec5b33]">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillBox = ({ label, value, icon, isPrimary }) => (
  <div className="bg-[#10221680] rounded-xl p-4 border border-[#23482f]">
    <p className="text-[10px] uppercase tracking-wider text-[#92c9a4] font-bold mb-1">{label}</p>
    <div className={`flex items-center gap-2 font-bold ${isPrimary ? 'text-[#13ec5b]' : 'text-white'}`}>
      <span className="material-symbols-outlined text-sm">{icon}</span>
      {value}
    </div>
  </div>
);

export default IncomingRequestCard;