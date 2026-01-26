import React from 'react';

// Common Styles
const glassCard = "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl";
const neonGlowPrimary = "shadow-[0_0_15px_rgba(37,244,123,0.3)]";
const neonGlowDanger = "shadow-[0_0_15px_rgba(239,68,68,0.3)]";

const SkillModeration = () => {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Header */}
      <header className="h-20 border-b border-white/5 bg-[#151515]/50 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
        <div className="flex items-center gap-6 flex-1">
          <h2 className="text-xl font-bold text-white tracking-tight">Skill Approval Queue</h2>
        </div>
        
       
      </header>

      {/* Main Layout Split */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Cards Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SkillCard 
              title="Advanced Rust Programming"
              category="Development"
              level="Expert"
              time="4h ago"
              desc="I have 5 years of experience in systems programming and have built production-grade CLI tools and web services using Rust."
              userName="Erik Chen"
              userId="#92410"
              icon="terminal"
              iconColor="text-[#25f47b]"
              iconBg="bg-[#25f47b]/10"
            />
            <SkillCard 
              title="UI/UX Design Systems"
              category="Creative"
              level="Advanced"
              time="6h ago"
              desc="Specializing in Figma-based design systems for large scale enterprise applications. Teaching how to build atomic components."
              userName="Sarah Jenkins"
              userId="#88321"
              icon="brush"
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
            />
            <SkillCard 
              title="Growth Hacking for SaaS"
              category="Marketing"
              level="Master"
              time="12h ago"
              desc="Built and scaled three startups from $0 to $1M ARR. Expert in AARRR frameworks and viral loops."
              userName="Jason Wright"
              userId="#44102"
              icon="insights"
              iconColor="text-yellow-500"
              iconBg="bg-yellow-500/10"
            />
            <SkillCard 
              title="Executive Coaching"
              category="Management"
              level="Professional"
              time="1d ago"
              desc="Certified executive coach with experience mentoring Fortune 500 directors. Helping with leadership presence."
              userName="Maria Lopez"
              userId="#55029"
              icon="psychology"
              iconColor="text-purple-500"
              iconBg="bg-purple-500/10"
            />
          </div>
        </div>

        {/* Right Side: Trends Sidebar */}
        <aside className="w-80 border-l border-white/5 bg-[#151515]/30 flex flex-col h-full shrink-0 p-6 overflow-y-auto custom-scrollbar">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#25f47b]">trending_up</span>
            Skill Category Trends
          </h3>
          
          <div className="space-y-6">
            <TrendItem label="Generative AI" growth="+124%" width="85%" tip="High demand for Prompt Engineering." />
            <TrendItem label="Sustainability Tech" growth="+56%" width="45%" tip="Emerging interest in carbon footprint." />
            <TrendItem label="Cybersecurity" growth="+42%" width="38%" tip="Growth in penetration testing." />

            <div className="h-px bg-white/5 my-6"></div>

            <div className={`${glassCard} p-4`}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Moderator Quick Stats</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Wait Time</p>
                  <p className="text-lg font-bold text-white">~4.2 hrs</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Approved Today</p>
                  <p className="text-lg font-bold text-[#25f47b]">124</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#25f47b]/5 border border-[#25f47b]/20 rounded-lg">
              <div className="flex items-center gap-2 text-[#25f47b] mb-2">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                <p className="text-xs font-bold uppercase tracking-wide">Pro Tip</p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Emerging skills in "Technical" category should be prioritized to meet marketplace demand.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const SkillCard = ({ title, category, level, time, desc, userName, userId, icon, iconColor, iconBg }) => (
  <div className={`${glassCard} p-6 flex flex-col gap-4 relative group`}>
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <div className={`size-14 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
            Category: <span className="text-slate-300">{category}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="px-3 py-1 rounded-full bg-[#25f47b]/20 text-[#25f47b] text-[10px] font-bold uppercase border border-[#25f47b]/30">Level: {level}</span>
        <p className="text-[10px] text-slate-500 mt-2 font-medium">Submitted {time}</p>
      </div>
    </div>
    
    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
      <p className="text-sm text-slate-400 leading-relaxed italic">"{desc}"</p>
    </div>

    <div className="flex items-center gap-3 pt-2">
      <div className="flex items-center gap-2">
        <div className="size-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
          {userName.charAt(0)}
        </div>
        <span className="text-xs font-bold text-white">{userName}</span>
      </div>
      <span className="text-slate-600 text-xs">•</span>
      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">ID: {userId}</span>
    </div>

    <div className="grid grid-cols-3 gap-3 mt-4">
      <button className={`flex items-center justify-center gap-2 py-3 bg-[#25f47b] text-black rounded-lg font-bold text-xs uppercase tracking-widest ${neonGlowPrimary} hover:brightness-110 transition-all`}>
        <span className="material-symbols-outlined text-[18px]">check_circle</span> Approve
      </button>
      <button className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-bold text-xs uppercase tracking-widest transition-all">
        <span className="material-symbols-outlined text-[18px]">edit_note</span> Edit
      </button>
      <button className={`flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-lg font-bold text-xs uppercase tracking-widest ${neonGlowDanger} hover:bg-red-600 transition-all`}>
        <span className="material-symbols-outlined text-[18px]">cancel</span> Reject
      </button>
    </div>
  </div>
);

const TrendItem = ({ label, growth, width, tip }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <p className="text-sm font-bold text-white">{label}</p>
      <span className="text-[10px] text-[#25f47b] font-bold">{growth}</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full bg-[#25f47b] shadow-[0_0_10px_rgba(37,244,123,0.5)] rounded-full" 
        style={{ width: width }}
      />
    </div>
    <p className="text-[10px] text-slate-500 leading-tight">{tip}</p>
  </div>
);

export default SkillModeration;