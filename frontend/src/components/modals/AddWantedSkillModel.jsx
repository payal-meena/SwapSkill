import React, { useState } from 'react';
import { 
  LayoutDashboard, BrainCircuit, Handshake, MessageSquare, 
  Settings, LogOut, PlusCircle, Search, X, CheckCircle2 
} from 'lucide-react';

const AddWantedSkillModel = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [targetProficiency, setTargetProficiency] = useState('beginner');

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#102216] font-['Lexend'] text-slate-900 dark:text-white relative">
      
      {/* SIDEBAR */}
      <aside className="w-64 flex flex-col bg-white dark:bg-[#112217] border-r border-slate-200 dark:border-[#23482f] p-6 justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex gap-3 items-center px-2 cursor-pointer">
            <div className="bg-[#13ec5b] rounded-lg p-2 flex items-center justify-center text-[#102216]">
              <Handshake size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight">SwapSkill</h1>
              <p className="text-slate-500 dark:text-[#92c9a4] text-xs">Peer-to-Peer Learning</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem icon={<BrainCircuit size={18} />} label="My Skills" active />
            <NavItem icon={<Handshake size={18} />} label="Requests" badge />
            <NavItem icon={<MessageSquare size={18} />} label="Messages" />
          </nav>
        </div>
        <div className="flex flex-col gap-2">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<LogOut size={18} />} label="Logout" color="text-red-500" />
        </div>
      </aside>

      {/* MAIN CONTENT (Opacity reduced when modal is open) */}
      <main className={`flex-1 flex flex-col overflow-y-auto transition-opacity duration-300 ${isModalOpen ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-[#23482f] bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md px-8 py-4">
          <h2 className="text-xl font-bold tracking-tight">My Skills</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#13ec5b] text-[#102216] font-bold rounded-xl hover:bg-[#13ec5b]/90 transition-all shadow-lg shadow-[#13ec5b]/10"
          >
            <PlusCircle size={18} /> Add New Skill
          </button>
        </header>

        <div className="p-8 max-w-[1200px] mx-auto w-full">
          <section className="mb-12">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#13ec5b]/10 text-[#13ec5b]"><BrainCircuit /></div>
                <h3 className="text-xl font-bold">Skills I Offer</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#193322] border border-slate-200 dark:border-[#23482f] rounded-2xl p-5 shadow-sm">
                   <h4 className="font-bold text-lg">UI/UX Design</h4>
                </div>
             </div>
          </section>
        </div>
      </main>

      {/* ADD WANTED SKILL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102216]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#102216]/85 backdrop-blur-xl w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#13ec5b]/20">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-[#23482f]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#13ec5b]/10 flex items-center justify-center">
                  <PlusCircle className="text-[#13ec5b]" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Add Wanted Skill</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {/* Search Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#92c9a4]">What do you want to learn?</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    className="w-full bg-[#193322]/50 border border-[#23482f] focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all" 
                    placeholder="Find a skill you want to learn" 
                    type="text"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-slate-500 font-medium py-1">Suggested:</span>
                  {['Python', 'Photography', 'Data Science', 'Guitar'].map(skill => (
                    <button key={skill} className="px-3 py-1 rounded-full bg-[#23482f] text-[#92c9a4] text-xs font-medium hover:bg-[#13ec5b]/20 hover:text-[#13ec5b] transition-all">
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Proficiency Radio Buttons */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#92c9a4]">Target Proficiency</label>
                <div className="grid grid-cols-3 gap-3">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <label key={level} className="cursor-pointer group">
                      <input 
                        className="peer hidden" 
                        name="proficiency" 
                        type="radio" 
                        checked={targetProficiency === level}
                        onChange={() => setTargetProficiency(level)}
                      />
                      <div className="text-center py-3 rounded-xl border border-[#23482f] bg-[#193322]/30 text-slate-400 peer-checked:bg-[#13ec5b]/10 peer-checked:border-[#13ec5b] peer-checked:text-[#13ec5b] transition-all font-medium text-sm capitalize">
                        {level}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Note Textarea */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#92c9a4]">Add a note to potential mentors</label>
                <textarea 
                  className="w-full bg-[#193322]/50 border border-[#23482f] focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] rounded-xl py-3 px-4 text-white placeholder-slate-500 outline-none transition-all resize-none" 
                  placeholder="Explain what you're hoping to achieve..." 
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 pt-0 flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-4 rounded-xl border border-[#23482f] text-slate-400 font-bold hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button className="flex-[2] px-6 py-4 rounded-xl bg-[#13ec5b] text-[#102216] font-bold hover:shadow-lg hover:shadow-[#13ec5b]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <CheckCircle2 size={20} />
                Add to My List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for Sidebar Items
const NavItem = ({ icon, label, active, badge, color }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer relative ${
    active ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : color || 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-[#23482f]'
  }`}>
    {icon}
    <p className="text-sm font-medium">{label}</p>
    {badge && <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-2 w-2 rounded-full bg-[#13ec5b]"></span>}
  </div>
);

export default AddWantedSkillModel;