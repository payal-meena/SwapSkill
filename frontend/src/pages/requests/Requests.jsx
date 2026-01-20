import React from 'react';
import UserNavbar from '../../components/common/UserNavbar';
import RequestCard from '../../components/requests/RequestCard';

const Requests = () => {
  const incomingRequests = [
    {
      name: "Liam Wilson",
      location: "Paris, France",
      rating: "4.8",
      time: "2 hours ago",
      wants: "React.js",
      offers: "French Language",
      message: "Hey! I saw you're looking for French lessons. I'm a native speaker and I've been looking to level up my React skills for a project. Let's swap!",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
      online: true
    },
    {
      name: "Elena Rossi",
      location: "Milan, Italy",
      rating: "4.9",
      time: "Yesterday",
      wants: "Sketching",
      offers: "Photography",
      message: "I'm a photographer looking to get into digital illustration. I can help you with lighting techniques and composition in return for some basic sketching lessons!",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
    }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <UserNavbar userName="Alex" />
      
      <div className="p-8 max-w-[1000px] mx-auto w-full">
        <div className="flex border-b border-slate-200 dark:border-[#23482f] mb-8">
          <button className="px-6 py-3 border-b-2 border-primary text-primary text-sm font-bold flex items-center gap-2 cursor-pointer">
            Incoming
            <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full">2</span>
          </button>
          <button className="px-6 py-3 border-b-2 border-transparent text-slate-500 dark:text-[#92c9a4] hover:text-slate-700 dark:hover:text-white text-sm font-medium transition-colors cursor-pointer">
            Outgoing
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {incomingRequests.map((req, index) => (
            <RequestCard key={index} {...req} />
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-[#23482f]">
          <h4 className="text-slate-900 dark:text-white font-bold mb-4">Request Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary">security</span>
              <p className="text-xs text-slate-500 dark:text-[#92c9a4]">Requests expire after 7 days if not accepted or declined.</p>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary">forum</span>
              <p className="text-xs text-slate-500 dark:text-[#92c9a4]">Accepting a request will automatically create a message thread.</p>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <p className="text-xs text-slate-500 dark:text-[#92c9a4]">ID verified profiles are recommended for safer learning.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;