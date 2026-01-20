import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Handshake, MessageSquare, 
  Settings, LogOut, User, Shield, 
  Bell, Lock, Laptop, Tablet, Smartphone, 
  Zap, ShieldCheck, History
} from 'lucide-react';

const Security = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="flex h-screen bg-[#102216] text-white font-sans overflow-hidden">
      
      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#102216]">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#23482f] bg-[#102216]/80 backdrop-blur-md px-8 py-4">
          <h2 className="text-white text-xl font-bold tracking-tight">Account and App Settings</h2>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-white">Alex Johnson</p>
              <p className="text-[10px] text-[#92c9a4]">Pro Member</p>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-[#13ec5b] overflow-hidden">
              <img alt="Profile" className="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
            </div>
          </div>
        </header>

        <div className="p-8  w-full mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            
           

            {/* Content Area */}
            <div className="flex-1 space-y-8">
              
              {/* Two-Factor Authentication Section */}
              <section className="bg-[#112217] rounded-2xl border border-[#23482f] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <ShieldCheck className="text-[#13ec5b]" size={22} />
                    Two-Factor Authentication
                  </h3>
                  <Toggle checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
                </div>
                <p className="text-sm text-[#92c9a4] mb-6">
                  Add an extra layer of security to your account. We'll ask for a code when you log in on a new device.
                </p>
                
                <div className="p-4 rounded-xl bg-[#0d1a11] border border-[#23482f] flex items-start gap-4">
                  <div className="p-2 bg-[#13ec5b]/10 rounded-lg text-[#13ec5b]">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Authenticator App</p>
                    <p className="text-xs text-[#92c9a4] mt-1">Configured using Google Authenticator</p>
                  </div>
                  <button className="ml-auto text-xs font-bold text-[#13ec5b] hover:underline transition-all">Change</button>
                </div>
              </section>

              {/* Login History Section */}
              <section className="bg-[#112217] rounded-2xl border border-[#23482f] p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <History className="text-[#13ec5b]" size={22} />
                  Login History
                </h3>
                
                <div className="space-y-4">
                  {/* Device 1 */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#23482f] hover:bg-[#162d1d] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#13ec5b]/10 flex items-center justify-center text-[#13ec5b]">
                        <Laptop size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">MacBook Pro - Chrome</p>
                        <p className="text-xs text-[#92c9a4]">London, UK • Current Session</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-[#13ec5b]/20 text-[#13ec5b] rounded-full">Active</span>
                  </div>

                  {/* Device 2 */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#23482f] hover:bg-[#162d1d] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#23482f] flex items-center justify-center text-[#92c9a4]">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">iPhone 14 Pro - App</p>
                        <p className="text-xs text-[#92c9a4]">London, UK • 2 hours ago</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-red-500/30 text-red-500 text-xs font-bold rounded-xl hover:bg-red-500/10 transition-colors">Sign Out</button>
                  </div>

                  {/* Device 3 */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#23482f] hover:bg-[#162d1d] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#23482f] flex items-center justify-center text-[#92c9a4]">
                        <Tablet size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Windows Desktop - Firefox</p>
                        <p className="text-xs text-[#92c9a4]">Manchester, UK • 3 days ago</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-red-500/30 text-red-500 text-xs font-bold rounded-xl hover:bg-red-500/10 transition-colors">Sign Out</button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#23482f]">
                  <button className="w-full py-3 text-sm font-bold text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/10">
                    Sign Out From All Devices
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Helper Components ---

const NavItem = ({ icon, label, active = false, color = "text-white" }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : `${color} hover:bg-[#23482f]`
  }`}>
    {icon}
    <p className="text-sm font-medium">{label}</p>
  </div>
);

const SettingsTab = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-left w-full ${
      active 
      ? 'bg-[#13ec5b] text-[#102216] font-bold shadow-lg shadow-[#13ec5b]/20' 
      : 'text-[#92c9a4] hover:bg-[#23482f] hover:text-white'
    }`}
  >
    {icon}
    {label}
  </button>
);

const Toggle = ({ checked, onChange }) => (
  <div 
    onClick={onChange}
    className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out flex items-center ${
      checked ? 'bg-[#13ec5b]' : 'bg-[#23482f]'
    }`}
  >
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
      checked ? 'translate-x-5' : 'translate-x-0'
    }`} />
  </div>
);

export default Security;