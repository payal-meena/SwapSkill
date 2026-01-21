import React, { useState } from 'react';
import { 
  ArrowLeft, Rocket, LayoutDashboard, BrainCircuit, 
  Handshake, MessageSquare, Settings, LogOut, ChevronDown 
} from 'lucide-react';

const AddSkill = () => {
  // 1. Form State Management
  const [formData, setFormData] = useState({
    category: '',
    skillName: '',
    proficiency: 'intermediate',
    experience: '',
    description: '',
    exchangeSkills: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Skill Published:", formData);
    // Yahan aap API call add kar sakte hain
    alert("Skill Published successfully!");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#102216] font-['Lexend'] text-slate-900 dark:text-white">
      
      {/* SIDEBAR (Reusable) */}
      <aside className="w-64 hidden lg:flex flex-col bg-white dark:bg-[#112217] border-r border-slate-200 dark:border-[#23482f] p-6 justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex gap-3 items-center px-2">
            <div className="bg-[#13ec5b] rounded-lg p-2 text-[#102216] font-bold">
               <Handshake size={20} />
            </div>
            <h1 className="text-lg font-bold">SwapSkill</h1>
          </div>
          <nav className="flex flex-col gap-2">
            <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" />
            <NavItem icon={<BrainCircuit size={18}/>} label="My Skills" active />
            <NavItem icon={<Handshake size={18}/>} label="Requests" />
            <NavItem icon={<MessageSquare size={18}/>} label="Messages" />
          </nav>
        </div>
        <div className="flex flex-col gap-2">
          <NavItem icon={<Settings size={18}/>} label="Settings" />
          <NavItem icon={<LogOut size={18}/>} label="Logout" color="text-red-500" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {/* HEADER */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-[#23482f] bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md px-8 py-4">
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 text-slate-500 dark:text-white hover:text-[#13ec5b] transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold tracking-tight">Add New Skill</h2>
          </div>
          <div className="h-10 w-10 rounded-full border-2 border-[#13ec5b] overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" />
          </div>
        </header>

        {/* FORM CONTAINER */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-2xl rounded-3xl p-8 lg:p-10 relative overflow-hidden bg-[#112217]/70 backdrop-blur-xl border border-[#13ec5b]/30 shadow-[0_0_20px_rgba(19,236,91,0.1)]">
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Share your expertise</h3>
              <p className="text-[#92c9a4] text-sm">Fill in the details below to list your skill on the platform.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category & Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#92c9a4]">Skill Category</label>
                  <div className="relative">
                    <select 
                      name="category"
                      onChange={handleChange}
                      className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec5b] outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Select a category</option>
                      <option>Design & Creative</option>
                      <option>Development & IT</option>
                      <option>Business & Marketing</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 text-[#92c9a4] pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#92c9a4]">Skill Name</label>
                  <input 
                    name="skillName"
                    type="text"
                    onChange={handleChange}
                    className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec5b] outline-none placeholder:text-slate-600" 
                    placeholder="e.g. Figma Prototyping"
                  />
                </div>
              </div>

              {/* Proficiency Level (Radio Group) */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-[#92c9a4]">Proficiency Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <label key={level} className="relative cursor-pointer group">
                      <input 
                        type="radio" 
                        name="proficiency" 
                        value={level} 
                        checked={formData.proficiency === level}
                        onChange={handleChange}
                        className="peer sr-only" 
                      />
                      <div className="p-3 text-center border border-[#23482f] rounded-xl text-sm font-medium text-slate-400 capitalize peer-checked:bg-[#13ec5b]/20 peer-checked:border-[#13ec5b] peer-checked:text-[#13ec5b] transition-all">
                        {level}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#92c9a4]">Years of Experience</label>
                <input 
                  name="experience"
                  type="number"
                  onChange={handleChange}
                  className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec5b] outline-none" 
                  placeholder="0"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#92c9a4]">Description</label>
                <textarea 
                  name="description"
                  rows="4"
                  onChange={handleChange}
                  className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec5b] outline-none resize-none placeholder:text-slate-600"
                  placeholder="Briefly describe what you can teach..."
                ></textarea>
              </div>

              {/* Exchange Section */}
              <div className="pt-4 border-t border-[#23482f]">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#92c9a4]">Skills to Exchange</label>
                  <p className="text-xs text-slate-500 mb-2">What would you like to learn in return?</p>
                  <input 
                    name="exchangeSkills"
                    onChange={handleChange}
                    className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec5b] outline-none placeholder:text-slate-600" 
                    placeholder="e.g. Python, Piano..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#13ec5b] to-[#0fbd48] text-[#102216] font-bold text-lg rounded-2xl shadow-lg shadow-[#13ec5b]/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Rocket size={20} />
                  Publish Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Helper Component ---
const NavItem = ({ icon, label, active, color }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
    active ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : color || 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-[#23482f]'
  }`}>
    {icon}
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export default AddSkill;