import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from "../../components/common/UserSidebar";
import ExchangeCard from '../../components/exchange/ExchangeCard';
import UserNavbar from '../../components/common/UserNavbar';
import PendingRequests from '../../components/requests/PendingRequests';

const StatCard = ({ label, value, trend, icon }) => {
  const isPositive = trend.includes('+');
  
  return (
    <div className="group relative flex flex-col gap-2 rounded-[2rem] p-8 bg-[#1a2e1f]/40 dark:bg-[#102216] border border-[#13ec5b]/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#13ec5b]/40 transition-all duration-500 overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#13ec5b]/5 blur-3xl group-hover:bg-[#13ec5b]/10 transition-all" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="p-3 bg-[#13ec5b]/10 rounded-2xl text-[#13ec5b]">
          <span className="material-symbols-outlined !text-3xl">{icon}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPositive ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : 'bg-white/5 text-slate-400'}`}>
          {trend}
        </div>
      </div>

      <div className="mt-6 relative z-10">
        <p className="text-slate-500 dark:text-[#92c9a4] text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">
          {label}
        </p>
        <p className="text-slate-900 dark:text-white text-4xl font-black tracking-tighter">
          {value}
        </p>
      </div>
      
      {/* Hover Line Effect */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#13ec5b] group-hover:w-full transition-all duration-700" />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#050a06] font-['Lexend'] text-white">

      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {/* Navbar */}
        <UserNavbar userName="Alex" />

        <div className="p-8 lg:p-12 max-w-[1400px] mx-auto w-full">
          
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
              User <span className="text-[#13ec5b]">Dashboard</span>
            </h1>
            <p className="text-slate-500 dark:text-[#92c9a4] text-xs font-bold uppercase tracking-[0.3em] mt-2 opacity-60">
              Overview of your learning journey
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <StatCard label="Skills Offered" value="04" trend="+1 This Month" icon="school" />
            <StatCard label="Skills Learning" value="03" trend="On Track" icon="auto_stories" />
            <StatCard label="Karma Rating" value="4.9" trend="+0.2 Recent" icon="verified" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Content - Current Exchanges */}
            <div className="lg:col-span-2 flex flex-col gap-8">
               <div className="flex justify-between items-end border-b border-[#13ec5b]/10 pb-4">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Current Exchanges</h2>
                    <p className="text-[10px] text-[#13ec5b] font-bold uppercase tracking-widest mt-1">Active learning sessions</p>
                  </div>
                  <button className="px-4 py-2 bg-white/5 hover:bg-[#13ec5b]/10 text-[#13ec5b] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-[#13ec5b]/10">
                    View all
                  </button>
               </div>

               <div className="grid gap-6">
                 {/* Styled Wrapper for ExchangeCard if needed, but the card itself should be premium */}
                 <ExchangeCard 
                    title="Learning Python with Sarah" 
                    status="In Progress" 
                    meta="Next session: Tomorrow, 4 PM" 
                    progress={65} 
                    image="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400" 
                    personImg="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" 
                    actionLabel="Open Chat" 
                    actionIcon="chat" 
                  />
               </div>
            </div>

            {/* Right Content - Requests */}
            <div className="flex flex-col gap-8">
              <div className="bg-[#102216] border border-[#13ec5b]/10 rounded-[2.5rem] p-2 shadow-2xl">
                <PendingRequests />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;