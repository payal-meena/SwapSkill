import React, { useState } from 'react';
import { Lock, Eye, Database, Download, Trash2, Info } from 'lucide-react';
const Privacy = () => {
  const [showRating, setShowRating] = useState(true);
  const [allowIndexing, setAllowIndexing] = useState(false);

  const blockedUsers = [
    { id: 1, name: 'Jordan Doe', initials: 'JD' },
    { id: 2, name: 'Sarah Miller', initials: 'SM' },
  ];

   const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This action will permanently delete your account."
    );
  
    if (!confirmDelete) return;
  
    try {
      await api.delete("/users/me");
  
      // logout
      localStorage.removeItem("token");
  
      alert("Your account has been deleted");
  
      // redirect to login
      window.location.href = "/login";
    } catch (error) {
      alert(
        "Account deletion failed: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <section className="bg-white dark:bg-[#112217] rounded-2xl border border-slate-200 dark:border-[#23482f] p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Lock className="text-[#13ec5b]" size={22} />
          <span className="dark:text-white text-slate-900">Privacy Settings</span>
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold dark:text-white text-slate-900">Show my rating to public</p>
              <p className="text-xs text-slate-500 dark:text-[#92c9a4]">Display your skill rating on your public profile page</p>
            </div>
            <Toggle checked={showRating} onChange={() => setShowRating(!showRating)} />
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-[#23482f] flex items-center justify-between">
            <div>
              <p className="text-sm font-bold dark:text-white text-slate-900">Allow search engines to index my profile</p>
              <p className="text-xs text-slate-500 dark:text-[#92c9a4]">Makes your profile searchable on Google and other search engines</p>
            </div>
            <Toggle checked={allowIndexing} onChange={() => setAllowIndexing(!allowIndexing)} />
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-[#23482f]">
            <h4 className="text-sm font-bold mb-4 dark:text-white text-slate-900">Blocked Users</h4>
            <div className="space-y-3">
              {blockedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#23482f]/50 border border-slate-100 dark:border-[#23482f]">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-[#326744] flex items-center justify-center text-xs font-bold dark:text-white">
                      {user.initials}
                    </div>
                    <span className="text-sm font-medium dark:text-white text-slate-900">{user.name}</span>
                  </div>
                  <button className="text-xs font-bold text-[#13ec5b] hover:underline">Unblock</button>
                </div>
              ))}
              <p className="text-[10px] text-slate-400 dark:text-[#92c9a4]/50 mt-2 flex items-center gap-1">
                Blocked users cannot send you messages or requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#112217] rounded-2xl border border-slate-200 dark:border-[#23482f] p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Database className="text-[#13ec5b]" size={22} />
          <span className="dark:text-white text-slate-900">Data Export</span>
        </h3>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-md">
            <p className="text-sm font-medium mb-1 dark:text-white text-slate-900">Download my data</p>
            <p className="text-xs text-slate-500 dark:text-[#92c9a4]">
              Receive a copy of your personal data, including skill history, profile info, and active swaps in a JSON format.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#13ec5b]/10 text-[#13ec5b] text-sm font-bold rounded-xl hover:bg-[#13ec5b] hover:text-[#102216] transition-all whitespace-nowrap">
            <Download size={18} />
            Download Archive
          </button>
        </div>
      </section>

       <button
       onClick={handleDeleteAccount}
       className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all text-sm font-semibold group active:scale-95"
     >
       <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
       Delete My Account
     </button>
     
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <div 
    onClick={onChange}
    className="relative inline-block w-10 h-6 align-middle select-none cursor-pointer group"
  >
    <div className={`block h-6 rounded-full transition-colors duration-300 ${
      checked ? 'bg-[#13ec5b]' : 'bg-slate-300 dark:bg-[#23482f]'
    }`} />
    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${
      checked ? 'translate-x-4' : 'translate-x-0'
    }`} />
  </div>
);

export default Privacy;