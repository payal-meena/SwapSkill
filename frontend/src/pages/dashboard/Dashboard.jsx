import React from 'react'
import UserSidebar from "../../components/common/UserSidebar";
import ExchangeCard from '../../components/exchange/ExchangeCard';
import UserNavbar from '../../components/common/UserNavbar';
import PendingRequests from '../../components/requests/PendingRequests';

const StatCard = ({ label, value, trend, icon }) => {
  const isPositive = trend.includes('+');
  
  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-transparent border border-slate-200 dark:border-[#326744] shadow-sm hover:border-[#13ec5b] transition-colors">
      <div className="flex justify-between items-start">
        <p className="text-slate-500 dark:text-[#92c9a4] text-sm font-medium">{label}</p>
        <span className="material-symbols-outlined text-[#13ec5b]">{icon}</span>
      </div>
      <div className="flex items-end gap-3 mt-1">
        <p className="text-slate-900 dark:text-white text-3xl font-bold">{value}</p>
        <p className={`${isPositive ? 'text-[#13ec5b]' : 'text-slate-400 dark:text-[#92c9a4]'} text-sm font-medium pb-1`}>
          {trend}
        </p>
      </div>
    </div>
  );
};


const Dashboard = () => {
 return (
    <div className="flex h-screen overflow-hidden">

      <main className="flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark">
        
        <UserNavbar userName="Alex" />

        <div className="p-8 max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard label="Skills Offered" value="4" trend="+1 this month" icon="school" />
            <StatCard label="Skills Learning" value="3" trend="On track" icon="auto_stories" trendColor="text-slate-400" />
            <StatCard label="Karma Rating" value="4.9" trend="+0.2 recent" icon="verified" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-6">
               <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Current Exchanges</h2>
                  <button className="text-primary text-sm font-semibold hover:underline">View all</button>
               </div>
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

            <div className="flex flex-col gap-8">
              <PendingRequests />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard