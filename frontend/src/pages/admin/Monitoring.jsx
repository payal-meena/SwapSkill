import React, { useState } from 'react';

// --- Static Data for Logs ---
const MOCK_LOGS = [
  { id: "#EX-98241", u1: "James L.", u2: "Emma S.", s1: "React", s2: "Marketing", time: "Oct 24, 14:22", status: "Active", statusClass: "bg-primary/10 text-primary border-primary/20" },
  { id: "#EX-98235", u1: "Sarah J.", u2: "Mike T.", s1: "Python", s2: "UI Design", time: "Oct 24, 12:05", status: "Flagged", statusClass: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  { id: "#EX-98212", u1: "Alice W.", u2: "Sofia R.", s1: "Spanish", s2: "SEO", time: "Oct 23, 22:45", status: "Completed", statusClass: "bg-white/10 text-slate-400 border-white/20" },
];

const Monitoring = () => {
  const [showAudit, setShowAudit] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const openAudit = (id) => {
    setSelectedId(id);
    setShowAudit(true);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0a] font-['Space_Grotesk']">
      
      {/* 1. Header Area */}
      <header className="h-20 border-b border-white/5 bg-[#151515]/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6 flex-1">
          <h2 className="text-xl font-bold text-white hidden lg:block">Exchange & Chat Logs</h2>
          <div className="relative max-w-sm w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">search</span>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-[#25f47b] focus:border-[#25f47b] outline-none transition-all text-slate-200" 
              placeholder="Search exchange ID, users..." 
              type="text"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-white leading-none">Admin Alex</p>
              <p className="text-[10px] text-[#25f47b] uppercase font-bold tracking-tighter mt-1">Superuser</p>
            </div>
            <div className="size-10 rounded-full border-2 border-[#25f47b]/30 p-0.5">
              <img alt="Admin" className="rounded-full w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content Scrollable Area */}
      <div className="flex-1 overflow-hidden flex flex-col p-8 space-y-6">
        
        {/* Filter Bar */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-wrap items-center gap-4">
          <FilterSelect label="Date Range" options={["Last 24 Hours", "Last 7 Days", "Custom Range"]} />
          <FilterSelect label="Skill Type" options={["All Skills", "Programming", "Design", "Marketing"]} />
          
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Status Filter</label>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-[#25f47b]/10 text-[#25f47b] border border-[#25f47b]/30 rounded-lg text-xs font-bold">All</button>
              <button className="px-3 py-1.5 bg-white/5 text-slate-400 border border-white/10 rounded-lg text-xs font-bold hover:text-white transition-all">Flagged</button>
            </div>
          </div>

          <div className="ml-auto">
            <button className="bg-[#25f47b] hover:brightness-110 text-black px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(37,244,123,0.3)]">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Logs
            </button>
          </div>
        </div>

        {/* Logs Table Container */}
        <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden flex flex-col">
          <div className="overflow-y-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-[#151515]">
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Exchange ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Participants</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Skill Pair</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Started</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_LOGS.map((log, index) => (
                  <tr key={index} className="group hover:bg-white/[0.03] transition-colors border-l-2 border-transparent hover:border-[#25f47b]">
                    <td className="px-6 py-4 font-mono text-xs text-[#25f47b] font-bold">{log.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center -space-x-3">
                        <img className="size-8 rounded-full border-2 border-[#151515]" src={`https://api.dicebear.com/7.x/initials/svg?seed=${log.u1}`} alt="" />
                        <img className="size-8 rounded-full border-2 border-[#151515]" src={`https://api.dicebear.com/7.x/initials/svg?seed=${log.u2}`} alt="" />
                        <span className="text-xs text-slate-400 ml-5">{log.u1} & {log.u2}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-white">
                        <span>{log.s1}</span>
                        <span className="material-symbols-outlined text-[14px] text-slate-600">swap_horiz</span>
                        <span>{log.s2}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{log.time}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${log.statusClass}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => openAudit(log.id)}
                        className="p-2 text-[#25f47b] hover:bg-[#25f47b]/10 rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined">chat_bubble</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="p-4 border-t border-white/5 bg-white/5 flex items-center justify-between">
            <p className="text-xs text-slate-500">Showing <span className="text-white">50</span> of 1,202 exchanges</p>
            <div className="flex items-center gap-2">
              <button className="size-8 rounded bg-[#25f47b] text-black text-[11px] font-bold">1</button>
              <button className="size-8 rounded hover:bg-white/10 text-slate-400 text-[11px] font-bold">2</button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Audit Modal (Fixed Overlay) */}
      {showAudit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl bg-[#151515] rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[80vh] shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#25f47b]">chat_bubble</span>
                <div>
                  <h3 className="text-white font-bold">Chat Audit: {selectedId}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Read-Only View</p>
                </div>
              </div>
              <button onClick={() => setShowAudit(false)} className="p-2 rounded-full hover:bg-white/10 text-slate-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <ChatBubble name="James L." time="14:22" text="Hi, I saw you were looking for marketing help. I can definitely help with your Google Ads campaign." isRight={false} />
              <ChatBubble name="Emma S." time="14:25" text="That sounds great! I have 5 years experience in React/Next.js. What's your project about?" isRight={true} />
            </div>

            <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Security flag: None detected</span>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-red-500/30 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500/10 transition-all uppercase tracking-widest">Flag Thread</button>
                <button className="px-4 py-2 bg-[#25f47b] text-black text-xs font-bold rounded-lg hover:brightness-110 transition-all uppercase tracking-widest">Verify Exchange</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Components ---

const FilterSelect = ({ label, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">{label}</label>
    <select className="bg-[#151515] border border-white/10 text-slate-300 text-sm rounded-lg focus:ring-[#25f47b] focus:border-[#25f47b] py-1.5 pl-3 pr-8 outline-none">
      {options.map((opt, i) => <option key={i}>{opt}</option>)}
    </select>
  </div>
);

const ChatBubble = ({ name, time, text, isRight }) => (
  <div className={`flex flex-col gap-1 ${isRight ? 'items-end ml-auto' : ''} max-w-[80%]`}>
    <div className={`p-3 text-sm rounded-2xl ${
      isRight 
      ? 'bg-[#25f47b]/10 border border-[#25f47b]/20 text-[#25f47b] rounded-tr-none' 
      : 'bg-white/5 text-slate-300 rounded-tl-none'
    }`}>
      {text}
    </div>
    <span className="text-[10px] text-slate-600 px-2">{name} • {time}</span>
  </div>
);

export default Monitoring;