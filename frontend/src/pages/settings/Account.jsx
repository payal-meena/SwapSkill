import React, { useState } from 'react';
import { UserCog, Trash2, Mail, Lock, ShieldCheck, Camera, Github, Globe } from 'lucide-react';

const Account = () => {
  // Form States
  const [email, setEmail] = useState('alex.johnson@example.com');
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [profileVisible, setProfileVisible] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Password Validation Logic
  const canSavePassword = 
    passwords.next.length >= 8 && 
    passwords.next === passwords.confirm && 
    passwords.current.length > 0;

  const handleUpdateEmail = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      alert("Email verification sent to: " + email);
    }, 1000);
  };

  const handleSavePassword = () => {
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Password Updated!');
      setPasswords({ current: '', next: '', confirm: '' });
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1500);
  };

  const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
      checked ? 'bg-primary' : 'bg-slate-300 dark:bg-[#23482f]'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

  return (
   
    <div className="w-full max-w-none px-4 md:px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-['Lexend'] mx-0">
      
      {/* 1. PROFILE PICTURE SECTION */}
      <section className="bg-white dark:bg-[#112217] rounded-2xl border border-slate-200 dark:border-[#23482f] p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full border-4 border-[#13ec5b] overflow-hidden bg-slate-100">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-[#13ec5b] p-2 rounded-full text-[#102216] hover:scale-110 transition-transform shadow-lg">
              <Camera size={16} />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold dark:text-white">Profile Photo</h4>
            <p className="text-sm text-slate-500 dark:text-[#92c9a4] mb-3">Update your photo to be recognized by the community.</p>
            <div className="flex gap-2 justify-center md:justify-start">
              <button className="text-xs font-bold px-4 py-2 bg-[#13ec5b]/10 text-[#13ec5b] rounded-lg hover:bg-[#13ec5b] hover:text-[#102216] transition-all">Upload New</button>
              <button className="text-xs font-bold px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all">Remove</button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACCOUNT SETTINGS SECTION */}
      <section className="bg-white dark:bg-[#112217] rounded-2xl border border-slate-200 dark:border-[#23482f] p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <UserCog className="text-[#13ec5b]" size={24} />
          <span className="dark:text-white text-slate-900">General Settings</span>
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-medium text-slate-500 dark:text-[#92c9a4]" htmlFor="email">Email Address</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border-none bg-slate-100 dark:bg-[#23482f] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#13ec5b]/50 outline-none transition-all"
              />
              <button 
                onClick={handleUpdateEmail}
                disabled={isUpdating}
                className="px-6 py-2 bg-[#13ec5b] text-[#102216] text-xs font-bold rounded-xl hover:bg-[#13ec5b]/90 transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Sending...' : 'Update Email'}
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-[#23482f] flex items-center justify-between">
            <div>
              <p className="text-sm font-bold dark:text-white text-slate-900">Profile Visibility</p>
              <p className="text-xs text-slate-500 dark:text-[#92c9a4]">Allow others to find you in search results</p>
            </div>
            <Toggle checked={profileVisible} onChange={() => setProfileVisible(!profileVisible)} />
          </div>
        </div>
      </section>

      {/* 3. PASSWORD SECTION */}
      <section className="bg-white dark:bg-[#112217] rounded-2xl border border-slate-200 dark:border-[#23482f] p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Lock className="text-[#13ec5b]" size={22} />
          <span className="dark:text-white text-slate-900">Security</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-2">
            <label className="text-xs font-medium text-slate-500 dark:text-[#92c9a4]">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.current}
              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border-none bg-slate-100 dark:bg-[#23482f] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#13ec5b]/50 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-2">
              <label className="text-xs font-medium text-slate-500 dark:text-[#92c9a4]">New Password</label>
              <input
                type="password"
                placeholder="Min 8 characters"
                value={passwords.next}
                onChange={(e) => setPasswords({...passwords, next: e.target.value})}
                className={`w-full px-4 py-2.5 rounded-xl border-none bg-slate-100 dark:bg-[#23482f] text-slate-900 dark:text-white text-sm focus:ring-2 outline-none ${passwords.next.length > 0 && passwords.next.length < 8 ? 'ring-2 ring-red-500' : 'focus:ring-[#13ec5b]/50'}`}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label className="text-xs font-medium text-slate-500 dark:text-[#92c9a4]">Confirm New Password</label>
              <input
                type="password"
                placeholder="Repeat password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className={`w-full px-4 py-2.5 rounded-xl border-none bg-slate-100 dark:bg-[#23482f] text-slate-900 dark:text-white text-sm focus:ring-2 outline-none ${passwords.confirm && passwords.next !== passwords.confirm ? 'ring-2 ring-red-500' : 'focus:ring-[#13ec5b]/50'}`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-slate-400">Passwords must match and be at least 8 characters.</p>
            <button 
              disabled={!canSavePassword || saveStatus !== ''}
              onClick={handleSavePassword}
              className="px-6 py-2.5 bg-[#13ec5b] text-[#102216] text-sm font-bold rounded-xl hover:bg-[#13ec5b]/90 transition-all disabled:opacity-30 active:scale-95"
            >
              {saveStatus || 'Save Password'}
            </button>
          </div>
        </div>
      </section>

      {/* 4. LINKED ACCOUNTS */}
      <section className="bg-white dark:bg-[#112217] rounded-2xl border border-slate-200 dark:border-[#23482f] p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <ShieldCheck className="text-[#13ec5b]" size={22} />
          <span className="dark:text-white text-slate-900">Connections</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#23482f]/30 border border-slate-100 dark:border-[#23482f]">
            <div className="flex items-center gap-3">
              <Github size={20} className="dark:text-white" />
              <div>
                <p className="text-sm font-bold dark:text-white">GitHub</p>
                <p className="text-xs text-slate-400">Not connected</p>
              </div>
            </div>
            <button className="text-xs font-bold text-[#13ec5b] hover:underline">Connect</button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#23482f]/30 border border-slate-100 dark:border-[#23482f]">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-blue-500" />
              <div>
                <p className="text-sm font-bold dark:text-white">Google Account</p>
                <p className="text-xs text-[#13ec5b]">Connected</p>
              </div>
            </div>
            <button className="text-xs font-bold text-red-500 hover:underline">Disconnect</button>
          </div>
        </div>
      </section>

      {/* 5. DANGER ZONE */}
      <div className="pt-4 flex flex-col items-start gap-4">
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all text-sm font-semibold group active:scale-95">
          <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
          Delete My Account
        </button>
      </div>
    </div>
  );
};

// Reusable Toggle Component
const Toggle = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in cursor-pointer"
  >
    <div
      className={`block w-12 h-6 rounded-full shadow-inner transition-colors duration-300 ${
        checked ? 'bg-[#13ec5b]' : 'bg-slate-300 dark:bg-[#23482f]'
      }`}
    ></div>
    <div
      className={`absolute block w-4 h-4 mt-1 ml-1 rounded-full bg-white shadow transform transition-transform duration-300 ${
        checked ? 'translate-x-6' : 'translate-x-0'
      }`}
    ></div>
  </div>
);

export default Account;