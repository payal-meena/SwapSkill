import React from 'react';
import { User, Ban } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const SettingsSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'account', label: 'Account', path: '/settings/account', icon: <User size={18} /> },
    { id: 'blocked', label: 'Blocked Users', path: '/settings/blocked-users', icon: <Ban size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-full md:w-60 shrink-0">
      <nav className="flex flex-col gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-left ${
              isActive(tab.path) 
              ? 'bg-[#13ec5b] text-[#102216] font-bold shadow-lg shadow-[#13ec5b]/20' 
              : 'text-[#92c9a4] hover:bg-[#23482f] hover:text-white'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;