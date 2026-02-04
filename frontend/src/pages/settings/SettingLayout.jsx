import React, { useState } from 'react';
import Account from './Account';
import Security from './Security';
import Notifications from './Notifications';
import Privacy from './Privacy';
import UserSidebar from '../../components/common/UserSidebar';
import UserNavbar from '../../components/common/UserNavbar';
import SettingsSidebar from './SettingsSidebar';

const SettingsLayout = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="flex h-screen bg-[#102216] text-white overflow-hidden font-['Lexend']">
      {/* 1. Main Left Sidebar - Bilkul left mein fixed, no gap */}
      <div className="flex-shrink-0 z-20">
        <UserSidebar />
      </div>

      {/* 2. Main Body Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* 3. Top Navbar (Fixed) */}
        <UserNavbar />

        {/* 4. Settings Header (Fixed) */}
        <header className="px-10 py-6 flex-shrink-0 border-b border-[#23482f]/30 bg-[#102216]">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#13ec5b]">
            Settings
          </h2>
        </header>

        {/* 5. Settings Body Container */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Grid: Sub-Sidebar + Content */}
          <div className="flex flex-1 flex-col md:flex-row w-full overflow-hidden">
            
            {/* Settings Sub-Sidebar (Fixed Width) */}
            <div className="md:w-80 flex-shrink-0 p-8 border-r border-[#23482f]/20 bg-[#0a1a11]/20">
              <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Dynamic Content Area - Full Width & Scrollable (No Scrollbar) */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto no-scrollbar bg-gradient-to-br from-[#0a1a11]/40 to-transparent">
              
              {/* Width badhane ke liye yahan max-w-full use kiya hai */}
              <div className="w-full max-w-full mx-auto min-h-full">
                <div className="animate-fadeIn transition-all duration-500">
                  {activeTab === 'account' && <Account />}
                  {activeTab === 'security' && <Security />}
                  {activeTab === 'notifications' && <Notifications />}
                  {activeTab === 'privacy' && <Privacy />}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Global Scrollbar Hide Logic */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Optional fade-in animation for tab switching */
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SettingsLayout;