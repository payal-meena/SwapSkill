import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ icon, label, to, badge = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer relative ${
      isActive 
        ? 'bg-[#39FF14]/10 text-[#39FF14]' 
        : 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-[#23482f]'
    }`}>
      <span className={`material-symbols-outlined ${isActive ? 'fill-icon' : ''}`}>
        {icon}
      </span>
      <p className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
        {label}
      </p>
      {badge && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5 rounded-full bg-[#39FF14] text-black text-[10px] font-bold">
          {badge}
        </span>
      )}
    </Link>
  );
};

const AdminSidebar = () => {
  return (
    <aside className="w-64 hidden lg:flex flex-col bg-white dark:bg-[#112217] border-r border-slate-200 dark:border-[#23482f] p-6 justify-between h-screen sticky top-0 font-['Lexend']">
      <div className="flex flex-col gap-8">
        {/* Logo Section */}
        <Link to="/admin/dashboard" className="flex gap-3 items-center px-2 cursor-pointer">
          <div className="bg-[#39FF14] rounded-lg p-2 flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.5)]">
            <span className="material-symbols-outlined text-[#102216] font-bold">swap_horiz</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">SwapSkill</h1>
            <p className="text-slate-500 dark:text-[#39FF14] text-xs font-normal uppercase tracking-widest">Admin Portal</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          <NavItem to="/admin/dashboard" icon="dashboard" label="Overview" />
          <NavItem to="/admin/users" icon="group" label="User Management" />
          <NavItem to="/admin/skills" icon="verified" label="Skill Moderation" badge="12" />
          <NavItem to="/admin/exchanges" icon="swap_horiz" label="Monitoring" />
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        {/* Server Status Box */}
        <div className="bg-black/40 border border-[#39FF14]/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_8px_#39FF14]"></span>
            <p className="text-[10px] font-bold text-[#39FF14] uppercase tracking-wider">Server Status</p>
          </div>
          <p className="text-[10px] text-slate-500">All systems operational. 24ms</p>
        </div>

        {/* Bottom Actions */}
        <nav className="flex flex-col gap-2">
          <NavItem to="/admin/settings" icon="settings" label="Settings" />
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium">Logout</p>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;