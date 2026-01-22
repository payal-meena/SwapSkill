import React, { useState } from 'react';
import { 
  Search, Notifications, Dashboard, WorkspacePremium, SwapHoriz, 
  AccountBalanceWallet, Add, Close, ExpandMore, AddPhotoAlternate,
  ChildCare, Psychology, FormatBold, FormatItalic, FormatListBulleted,
  Link, Info, RocketLaunch
} from '@mui/icons-material'; // Optional: Use Lucide or Material Icons

const ExpertisePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proficiency, setProficiency] = useState('Intermediate');

  return (
    <div className="bg-[#f5f8f5] dark:bg-[#102210] font-['Lexend'] text-white min-h-screen transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <header className="flex items-center justify-between border-b border-white/10 bg-[#102210]/80 backdrop-blur-md px-6 md:px-10 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 text-[#25f425]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">SwapSkill</h2>
          </div>
          <div className="hidden md:flex min-w-40 h-10 max-w-64 bg-white/10 rounded-xl overflow-hidden">
            <div className="text-[#25f425]/70 flex items-center justify-center pl-4">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="bg-transparent border-none text-white focus:ring-0 w-full px-4 placeholder:text-[#25f425]/40 text-sm" placeholder="Search skills..."/>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex gap-8 text-sm font-medium">
            <a className="text-white/80 hover:text-[#25f425]" href="#">Browse</a>
            <a className="text-white/80 hover:text-[#25f425]" href="#">Exchanges</a>
            <a className="text-white/80 hover:text-[#25f425]" href="#">Community</a>
          </nav>
          <div className="flex gap-3">
            <button className="rounded-xl size-10 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="size-10 rounded-full border-2 border-[#25f425]/20 bg-cover" style={{backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Alex")'}}></div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* --- SIDEBAR --- */}
        <aside className="hidden md:flex flex-col w-64 bg-[#102210] border-r border-white/5 p-6 gap-8 h-[calc(100vh-64px)] sticky top-16">
          <div className="flex gap-3 items-center">
            <div className="size-12 rounded-full border-2 border-[#25f425] bg-cover" style={{backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Alex")'}}></div>
            <div>
              <h1 className="text-sm font-bold">Alex Chen</h1>
              <p className="text-[#25f425] text-[10px] font-bold uppercase tracking-widest">Pro Member</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <SidebarLink icon="dashboard" label="Dashboard" />
            <SidebarLink icon="military_tech" label="My Expertise" active />
            <SidebarLink icon="swap_horiz" label="Requests" />
            <SidebarLink icon="account_balance_wallet" label="Wallet" />
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-white text-3xl font-bold mb-1">My Expertise</h1>
              <p className="text-white/50">Manage the skills you share with the community</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#25f425] text-[#102210] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_15px_rgba(37,244,37,0.4)]"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Expertise
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-64 hover:border-[#25f425]/30 transition-all"></div>
            ))}
          </div>
        </main>
      </div>

      {/* --- ADD EXPERTISE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102210]/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#102210]/80 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] flex flex-col relative shadow-2xl">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors z-50"
            >
              <span className="material-symbols-outlined text-white/60">close</span>
            </button>

            <div className="p-8 md:p-12 overflow-y-auto">
              {/* Stepper */}
              <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>
                <div className="absolute top-1/2 left-0 w-1/3 h-0.5 bg-[#25f425] -translate-y-1/2 z-0"></div>
                <Step number="1" label="Skill Basics" active />
                <Step number="2" label="Proficiency" />
                <Step number="3" label="Description" />
              </div>

              <div className="mb-10 text-center">
                <h2 className="text-white text-3xl font-bold mb-2 tracking-tight">Add New Expertise</h2>
                <p className="text-white/50">Define the core details of what you want to teach.</p>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <InputField label="Skill Name" placeholder="e.g. UX/UI Design with Figma" />
                    <div className="flex flex-col gap-3">
                      <label className="text-white/80 text-xs font-bold uppercase tracking-widest ml-1">Category</label>
                      <div className="relative">
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-[#25f425]">
                          <option className="bg-[#102210]">Development</option>
                          <option className="bg-[#102210]">Design</option>
                          <option className="bg-[#102210]">Marketing</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/40">expand_more</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-white/80 text-xs font-bold uppercase tracking-widest ml-1">Skill Thumbnail</label>
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#25f425]/20 rounded-2xl bg-white/5 hover:bg-[#25f425]/5 hover:border-[#25f425]/40 transition-all cursor-pointer p-8">
                      <span className="material-symbols-outlined text-5xl text-[#25f425]/60 mb-3">add_photo_alternate</span>
                      <p className="text-sm font-medium">Upload thumbnail</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-white/80 text-xs font-bold uppercase tracking-widest">Select Your Proficiency</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProficiencyCard 
                      level="Beginner" desc="Foundations" icon="child_care" 
                      selected={proficiency === 'Beginner'} 
                      onClick={() => setProficiency('Beginner')}
                    />
                    <ProficiencyCard 
                      level="Intermediate" desc="Practical Use" icon="psychology" 
                      selected={proficiency === 'Intermediate'} 
                      onClick={() => setProficiency('Intermediate')}
                    />
                    <ProficiencyCard 
                      level="Expert" desc="Mastery" icon="workspace_premium" 
                      selected={proficiency === 'Expert'} 
                      onClick={() => setProficiency('Expert')}
                    />
                  </div>
                </div>

                <div className="space-y-4 text-right pt-8">
                    <div className="flex gap-4 justify-end">
                      <button onClick={() => setIsModalOpen(false)} className="bg-white/10 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">Cancel</button>
                      <button className="bg-[#25f425] px-10 py-4 rounded-xl text-[#102210] font-black tracking-widest shadow-[0_0_15px_rgba(37,244,37,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                        <span>PUBLISH SKILL</span>
                        <span className="material-symbols-outlined text-xl">rocket_launch</span>
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SidebarLink = ({ icon, label, active = false }) => (
  <a className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#25f425]/10 text-[#25f425]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`} href="#">
    <span className={`material-symbols-outlined ${active ? 'fill-icon' : ''}`}>{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </a>
);

const Step = ({ number, label, active = false }) => (
  <div className="relative z-10 flex flex-col items-center gap-3">
    <div className={`size-12 rounded-full flex items-center justify-center font-bold ${active ? 'bg-[#25f425] text-[#102210] shadow-[0_0_15px_rgba(37,244,37,0.4)] ring-4 ring-[#25f425]/20' : 'bg-white/10 text-white/40 border-2 border-white/10'}`}>
      {number}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-[#25f425]' : 'text-white/40'}`}>{label}</span>
  </div>
);

const InputField = ({ label, placeholder }) => (
  <div className="flex flex-col gap-3 text-left">
    <label className="text-white/80 text-xs font-bold uppercase tracking-widest ml-1">{label}</label>
    <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#25f425] focus:ring-1 focus:ring-[#25f425] outline-none transition-all placeholder:text-white/20" placeholder={placeholder} type="text"/>
  </div>
);

const ProficiencyCard = ({ level, desc, icon, selected, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${selected ? 'border-[#25f425] bg-[#25f425]/10 shadow-[0_0_15px_rgba(37,244,37,0.2)]' : 'border-white/10 bg-white/5 hover:border-[#25f425]/40'}`}
  >
    <div className={`size-12 rounded-xl flex items-center justify-center ${selected ? 'bg-[#25f425] text-[#102210]' : 'bg-white/5 text-white/40'}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <p className={`font-bold text-sm ${selected ? 'text-white' : 'text-white/70'}`}>{level}</p>
      <p className={`text-[10px] uppercase font-bold ${selected ? 'text-[#25f425]' : 'text-white/40'}`}>{desc}</p>
    </div>
  </button>
);

export default ExpertisePage;