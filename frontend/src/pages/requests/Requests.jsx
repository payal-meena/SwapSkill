import React, { useState } from 'react';
import UserNavbar from '../../components/common/UserNavbar';
import IncomingRequestCard from '../../components/requests/IncomingRequestCard';
import SentRequestStatus from '../../components/requests/SentRequestStatus';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('received');

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark font-['Lexend']">
      <UserNavbar userName="Alex" />
      
      <main className="p-8 max-w-[1200px] mx-auto w-full">
        <header className="mb-8">
          <h2 className="text-white text-xl font-bold tracking-tight">Requests Center</h2>
          <p className="text-[#92c9a4] text-xs">Manage your incoming and outgoing skill swaps</p>
        </header>

        {/* Tab Switcher */}
        <div className="flex items-center gap-8 border-b border-[#23482f] mb-8">
          <button 
            onClick={() => setActiveTab('received')}
            className={`pb-4 px-2 font-bold flex items-center gap-2 transition-all ${activeTab === 'received' ? 'text-[#13ec5b] border-b-2 border-[#13ec5b]' : 'text-[#92c9a4]'}`}
          >
            Received Requests <span className="bg-[#13ec5b1a] text-[#13ec5b] text-[10px] px-1.5 py-0.5 rounded-full">3</span>
          </button>
          <button 
            onClick={() => setActiveTab('sent')}
            className={`pb-4 px-2 font-bold flex items-center gap-2 transition-all ${activeTab === 'sent' ? 'text-[#13ec5b] border-b-2 border-[#13ec5b]' : 'text-[#92c9a4]'}`}
          >
            Sent Requests <span className="bg-[#23482f] text-[#92c9a4] text-[10px] px-1.5 py-0.5 rounded-full">2</span>
          </button>
        </div>

        {/* Conditional Content Rendering */}
        {activeTab === 'received' ? (
          <div className="grid grid-cols-1 gap-6">
            <IncomingRequestCard 
              name="Liam Wilson" 
              role="Full-Stack Developer" 
              rating="4.8" 
              img="https://api.dicebear.com/7.x/avataaars/svg?seed=Liam"
              offers="Native French Lessons"
              wants="React Architecture"
              message="Hey Alex! I've been looking for someone with your React expertise to help me refactor a project..."
            />
            {/* Add more IncomingRequestCards here */}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <SentRequestStatus 
              title="Python Advanced with Sarah" 
              status="In Progress" 
              img="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" 
              progressStep={2} 
            />
            <SentRequestStatus 
              title="Machine Learning with James" 
              status="Awaiting Response" 
              img="https://api.dicebear.com/7.x/avataaars/svg?seed=James" 
              progressStep={0} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Requests;