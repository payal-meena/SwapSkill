import React, { useState } from 'react';

// Common Styles
const glassCard = "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl";
const neonGlow = "shadow-[0_0_15px_rgba(37,244,123,0.3)]";

const UserManagment = () => {
  const [activeTab, setActiveTab] = useState('User Moderation');

  return (
    <div className="bg-[#0a0a0a] text-slate-100 min-h-screen flex overflow-hidden font-['Space_Grotesk']">
      
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
       
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">User Management</h2>
              <p className="text-slate-400 mt-1">Manage user compliance and reputation across the platform.</p>
            </div>
            <button className="text-[#25f47b] text-sm font-bold hover:underline flex items-center gap-1 group">
              View Full Analytics
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Users" value="12,450" trend="+18%" icon="groups" color="text-[#25f47b]" />
            <StatCard label="Active Reports" value="42" badge="High Risk" icon="report" color="text-yellow-500" />
            <StatCard label="Daily Verifications" value="156" trend="+12%" icon="verified_user" color="text-[#25f47b]" />
          </div>

          {/* Moderation Queue */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#25f47b]">manage_accounts</span>
                Moderation Queue
              </h3>
              <div className="flex gap-2">
                <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
                  <button className="px-3 py-1.5 rounded-md bg-[#25f47b] text-black text-xs font-bold uppercase transition-all">All</button>
                  <button className="px-3 py-1.5 rounded-md text-slate-400 hover:text-white text-xs font-bold uppercase">Flagged</button>
                </div>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">filter_list</span> Risk Level
                </button>
              </div>
            </div>

            <div className={`${glassCard} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Account Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Reputation</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <UserRow name="Erik Chen" email="erik@design.io" status="Verified" rep="4.9" id="#92410" />
                    <UserRow name="Sarah Jenkins" email="sj_creative" status="Flagged" rep="3.2" id="#88321" />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${glassCard} p-6 flex flex-col`}>
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#25f47b]">analytics</span>
                  Exchange Activity Monitor
               </h3>
               <div className="space-y-4">
                  <ActivityItem user1="James L." user2="Emma S." skill="React Architecture" time="2m ago" status="safe" />
                  <ActivityItem user1="Alice W." user2="Marcus P." skill="Business Spanish" time="Risk" status="risk" />
               </div>
            </div>

            <div className={`${glassCard} p-6`}>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#25f47b]">verified</span>
                Skill Approval Queue
              </h3>
              <div className="space-y-3">
                <SkillRequest title="AI Prompt Engineering" user="@tech_guru" icon="psychology" color="text-blue-500" />
                <SkillRequest title="3D Procedural Texturing" user="@visual_art" icon="palette" color="text-purple-500" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// Sub-components
const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
      active ? 'bg-[#25f47b]/10 text-[#25f47b] border-r-[3px] border-[#25f47b]' : 'text-slate-400 hover:text-[#25f47b] hover:bg-[#25f47b]/5'
    }`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const SectionLabel = ({ label, className }) => (
  <div className={`text-xs font-bold text-slate-500 uppercase px-3 py-2 tracking-widest ${className}`}>
    {label}
  </div>
);

const StatCard = ({ label, value, trend, badge, icon, color }) => (
  <div className={`${glassCard} p-6 relative overflow-hidden group`}>
    <div className={`absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-500 ${color}`}>
      <span className="material-symbols-outlined text-[60px]">{icon}</span>
    </div>
    <p className="text-slate-400 text-sm font-medium">{label}</p>
    <div className="flex items-baseline gap-3 mt-2">
      <h3 className="text-4xl font-bold text-white tracking-tight">{value}</h3>
      {trend && <span className="text-[#25f47b] text-sm font-bold">{trend}</span>}
      {badge && <span className="bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{badge}</span>}
    </div>
  </div>
);

const UserRow = ({ name, email, status, rep, id }) => (
  <tr className="group hover:bg-white/[0.02] transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-white/10 border border-white/10" />
        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          <p className="text-[10px] text-slate-500 font-mono">ID: {id} • {email}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-center">
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
        status === 'Verified' ? 'bg-[#25f47b]/10 text-[#25f47b] border-[#25f47b]/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-center font-bold text-white">
      <span className="material-symbols-outlined text-[14px] text-[#25f47b] mr-1">star</span>
      {rep}
    </td>
    <td className="px-6 py-4 text-right">
      <button className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] font-bold hover:bg-white/10 transition-all uppercase mr-2">Manage</button>
      <button className="px-4 py-1.5 rounded-lg border border-red-500/30 text-red-500 text-[11px] font-bold hover:bg-red-500/10 transition-all uppercase">Block</button>
    </td>
  </tr>
);

const ActivityItem = ({ user1, user2, skill, time, status }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#25f47b]/20 transition-all">
    <div className="flex items-start gap-4">
      <div className={`size-2 mt-2 rounded-full shrink-0 ${status === 'risk' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]' : 'bg-[#25f47b] ' + neonGlow}`} />
      <div>
        <p className="text-sm text-slate-200 font-bold">{user1} ↔ {user2}</p>
        <p className="text-xs text-slate-500">{skill}</p>
      </div>
    </div>
    <span className={`text-[10px] font-bold uppercase ${status === 'risk' ? 'text-yellow-500' : 'text-slate-500'}`}>{time}</span>
  </div>
);

const SkillRequest = ({ title, user, icon, color }) => (
  <div className="p-4 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
    <div className="flex items-center gap-3">
      <div className={`size-8 rounded flex items-center justify-center border border-white/10 bg-white/5 ${color}`}>
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      <div>
        <span className="text-sm font-bold text-slate-200 block">{title}</span>
        <span className="text-[10px] text-slate-500 uppercase">Requested by {user}</span>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="p-1.5 rounded bg-[#25f47b]/20 text-[#25f47b] hover:bg-[#25f47b] hover:text-black transition-all">
        <span className="material-symbols-outlined text-[18px]">check</span>
      </button>
    </div>
  </div>
);

export default UserManagment;