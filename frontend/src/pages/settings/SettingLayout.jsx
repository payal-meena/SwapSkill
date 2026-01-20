import React, { useState } from 'react';
import Account from './Account';
import Security from './Security';
import Notifications from './Notifications';
import Privacy from './Privacy';
import UserSidebar from '../../components/common/UserSidebar';
import SettingsSidebar from './SettingsSidebar';

const SettingsLayout = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="flex h-screen bg-[#102216] text-white">
      {/* 1. Main Global Sidebar */}
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="px-8 py-6 border-b border-[#23482f]">
          <h2 className="text-2xl font-bold">Settings</h2>
        </header>

        <div className="p-8 w-full mx-auto">
          <div className="flex flex-col md:flex-row gap-10">
            
            {/* 2. Internal Settings Sidebar */}
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* 3. Dynamic Content Area */}
            <div className="flex-1">
              {activeTab === 'account' && <Account />}
              {activeTab === 'security' && <Security />}
              {activeTab === 'notifications' && <Notifications />}
              {activeTab === 'privacy' && <Privacy />}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;