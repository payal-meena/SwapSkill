import React, { useState } from 'react';
import { BellRing, Info, Save } from 'lucide-react';

const Notifications = () => {
  // Notification States
  const [prefs, setPrefs] = useState({
    match: { email: true, push: true, inapp: true },
    request: { email: true, push: true, inapp: true },
    message: { email: false, push: true, inapp: true },
    news: { email: true, push: false, inapp: true },
  });

  // Toggle Function
  const handleToggle = (category, type) => {
    setPrefs((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
  };

  const categories = [
    { id: 'match', title: 'New Skill Matches', desc: "When someone joins with a skill you're looking for" },
    { id: 'request', title: 'Request Updates', desc: 'Status changes on your swap requests' },
    { id: 'message', title: 'Message Alerts', desc: 'Real-time chat and communication' },
    { id: 'news', title: 'Community News', desc: 'Platform updates and learning resources' },
  ];

  return (
    <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      
      {/* Table Section */}
      <section className="bg-white dark:bg-[#112217] rounded-2xl border border-slate-200 dark:border-[#23482f] p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <BellRing className="text-[#13ec5b]" size={24} />
            <span className="dark:text-white text-slate-900">Notification Preferences</span>
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#13ec5b]/10 text-[#13ec5b] text-xs font-bold rounded-lg hover:bg-[#13ec5b] hover:text-[#102216] transition-all">
            <Save size={16} />
            Save Changes
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#23482f]">
                <th className="text-left pb-4 text-sm font-medium text-slate-400 dark:text-[#92c9a4]">Category</th>
                <th className="text-center pb-4 text-sm font-medium text-slate-400 dark:text-[#92c9a4]">Email</th>
                <th className="text-center pb-4 text-sm font-medium text-slate-400 dark:text-[#92c9a4]">Push</th>
                <th className="text-center pb-4 text-sm font-medium text-slate-400 dark:text-[#92c9a4]">In-app</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-[#23482f]/50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-[#23482f]/10 transition-colors">
                  <td className="py-6 pr-4">
                    <p className="text-sm font-bold dark:text-white text-slate-900">{cat.title}</p>
                    <p className="text-xs text-slate-500 dark:text-[#92c9a4]">{cat.desc}</p>
                  </td>
                  <td className="py-6 text-center">
                    <Toggle checked={prefs[cat.id].email} onChange={() => handleToggle(cat.id, 'email')} />
                  </td>
                  <td className="py-6 text-center">
                    <Toggle checked={prefs[cat.id].push} onChange={() => handleToggle(cat.id, 'push')} />
                  </td>
                  <td className="py-6 text-center">
                    <Toggle checked={prefs[cat.id].inapp} onChange={() => handleToggle(cat.id, 'inapp')} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Info Card */}
      <div className="p-6 bg-[#13ec5b]/5 rounded-2xl border border-[#13ec5b]/20 flex items-start gap-4">
        <Info className="text-[#13ec5b] shrink-0" size={20} />
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Push Notification Settings</p>
          <p className="text-xs text-slate-500 dark:text-[#92c9a4] mt-1 italic">
            To receive Push notifications, ensure they are enabled in your browser settings for app.swapskill.com.
          </p>
        </div>
      </div>
    </div>
  );
};

// Reusable Custom Toggle Component (Matches your HTML design)
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

export default Notifications;