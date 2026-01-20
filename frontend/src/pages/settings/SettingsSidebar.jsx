import React from 'react';
import { User, Shield, Bell, Lock } from 'lucide-react';

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Lock size={18} /> },
  ];

  return (
    <aside className="w-full md:w-60 shrink-0">
      <nav className="flex flex-col gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-left ${
              activeTab === tab.id 
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