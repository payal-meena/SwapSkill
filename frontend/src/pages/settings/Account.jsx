import React, { useState } from 'react';
import { UserCog, Trash2, Mail } from 'lucide-react';

const Account = () => {
  const [profileVisible, setProfileVisible] = useState(true);

  return (
    <div className="flex-1 space-y-8 animate-in fade-in duration-500">
      {/* Account Settings Section */}
      <section className="bg-white dark:bg-[#112217] rounded-2xl border border-slate-200 dark:border-[#23482f] p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <UserCog className="text-[#13ec5b]" size={24} />
          <span className="dark:text-white text-slate-900">Account Settings</span>
        </h3>

        <div className="space-y-6">
          {/* Email Address Field */}
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-medium text-slate-500 dark:text-[#92c9a4]" htmlFor="email">
              Email Address
            </label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                defaultValue="alex.johnson@example.com"
                className="flex-1 px-4 py-2.5 rounded-xl border-none bg-slate-100 dark:bg-[#23482f] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#13ec5b]/50 outline-none"
              />
              <button className="px-4 py-2 bg-[#13ec5b] text-[#102216] text-xs font-bold rounded-xl hover:bg-[#13ec5b]/90 transition-colors">
                Update
              </button>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#23482f]">
            <p className="text-sm font-bold mb-4 dark:text-white text-slate-900">Change Password</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-xs font-medium text-slate-500 dark:text-[#92c9a4]" htmlFor="current-password">
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border-none bg-slate-100 dark:bg-[#23482f] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#13ec5b]/50 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-[#92c9a4]" htmlFor="new-password">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-2.5 rounded-xl border-none bg-slate-100 dark:bg-[#23482f] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#13ec5b]/50 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-[#92c9a4]" htmlFor="confirm-password">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Repeat password"
                    className="w-full px-4 py-2.5 rounded-xl border-none bg-slate-100 dark:bg-[#23482f] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#13ec5b]/50 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2.5 bg-[#13ec5b]/10 text-[#13ec5b] text-sm font-bold rounded-xl hover:bg-[#13ec5b] hover:text-[#102216] transition-all">
                  Save New Password
                </button>
              </div>
            </div>
          </div>

          {/* Profile Visibility Toggle */}
          <div className="pt-6 border-t border-slate-100 dark:border-[#23482f] flex items-center justify-between">
            <div>
              <p className="text-sm font-bold dark:text-white text-slate-900">Profile Visibility</p>
              <p className="text-xs text-slate-500 dark:text-[#92c9a4]">
                Make your profile discoverable to others looking for skills
              </p>
            </div>
            <Toggle checked={profileVisible} onChange={() => setProfileVisible(!profileVisible)} />
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <div className="pt-4 flex justify-center">
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all text-sm font-semibold group">
          <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
          Delete My Account
        </button>
      </div>
    </div>
  );
};

// Reusable Toggle Component based on your HTML styling
const Toggle = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    className={`relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in cursor-pointer`}
  >
    <div
      className={`block w-10 h-6 rounded-full shadow-inner transition-colors duration-300 ${
        checked ? 'bg-[#13ec5b]' : 'bg-slate-300 dark:bg-[#23482f]'
      }`}
    ></div>
    <div
      className={`absolute block w-4 h-4 mt-1 ml-1 rounded-full bg-white shadow transform transition-transform duration-300 ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`}
    ></div>
  </div>
);

export default Account;