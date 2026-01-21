import React from 'react';
import StatCard from '../../components/admin/StatCard';

const AdminDashboard = () => {
  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full bg-background-light dark:bg-background-dark min-h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Overview</h2>
          <p className="text-slate-500 dark:text-[#92c9a4]">Monitoring platform performance and system health.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value="12,450" trend="+12.5%" progress={70} icon="groups" />
        <StatCard label="Active Exchanges" value="842" trend="+5.2%" progress={45} icon="swap_horiz" />
        <StatCard label="Pending Skills" value="37" status="Action Needed" icon="verified" />
        <StatCard label="Avg. Platform Rating" value="4.8" trend="+0.2" icon="star_rate" />
      </div>

      {/* Analytics & Activity */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#23482f] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Health</h3>
              <p className="text-sm text-slate-500 dark:text-[#92c9a4]">User Growth & Exchange Volume</p>
            </div>
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
              <button className="px-4 py-1.5 text-xs font-bold bg-[#13ec5b] text-white rounded-lg shadow-sm">30 Days</button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">90 Days</button>
            </div>
          </div>
          
          <div className="h-[250px] w-full mt-4">
             <svg className="w-full h-full" viewBox="0 0 800 300">
                <defs>
                  <linearGradient id="brandGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#13ec5b" stopOpacity="0.2"></stop>
                    <stop offset="100%" stopColor="#13ec5b" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,250 Q100,240 200,180 T400,150 T600,80 T800,40 L800,300 L0,300 Z" fill="url(#brandGradient)"></path>
                <path d="M0,250 Q100,240 200,180 T400,150 T600,80 T800,40" fill="none" stroke="#13ec5b" strokeWidth="3" strokeLinecap="round" />
             </svg>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#23482f] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">System Activity</h3>
          <div className="space-y-6">
            <ActivityItem icon="person_add" text="New user <span class='text-[#13ec5b] font-bold'>@sarah_codes</span> joined." time="2m ago" />
            <ActivityItem icon="report" text="Exchange reported: <span class='text-red-500 font-bold'>Policy Breach</span>." time="3h ago" type="danger" />
            <ActivityItem icon="settings" text="System backup <span class='text-slate-900 dark:text-white font-bold'>Completed</span>." time="5h ago" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ icon, text, time, type }) => (
  <div className="flex gap-4">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
      type === 'danger' ? 'bg-red-50 border-red-100 text-red-500 dark:bg-red-500/10 dark:border-red-500/20' : 'bg-slate-50 border-slate-100 text-[#13ec5b] dark:bg-[#13ec5b1a] dark:border-[#13ec5b33]'
    }`}>
      <span className="material-symbols-outlined !text-xl">{icon}</span>
    </div>
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-tight" dangerouslySetInnerHTML={{ __html: text }} />
      <p className="text-xs text-slate-400 mt-1">{time}</p>
    </div>
  </div>
);

export default AdminDashboard;