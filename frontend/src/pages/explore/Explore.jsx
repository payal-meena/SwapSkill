
import React, { useState, useEffect } from 'react';
import ExploreNavbar from '../../components/explore/ExploreNavbar';
import SkillCard from '../../components/explore/SkillCard';
import api from '../../services/api';
import axios from 'axios';
import { requestService } from '../../services/requestService';

const Explore = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Mentors fetch karo
      const mentorRes = await api.get("/explore");
      const allMentors = mentorRes.data;


      // 2. User ki requests fetch karo
      const requestRes = await requestService.getMyRequests();
      const myRequests = requestRes.requests || [];
      const currentUserId = requestRes.currentUser;

      // 3. Status merge karo
      const mentorsWithStatus = allMentors.filter(mentor => mentor._id !== currentUserId)
      .map(mentor => {
        const foundRequest = myRequests.find(req => 
          (req.receiver._id === mentor._id || req.requester._id === mentor._id) &&
          req.status !== 'cancelled'
        );

        return {
          ...mentor,
          connectionStatus: foundRequest ? foundRequest.status : 'none'
        };
      });

      setMentors(mentorsWithStatus);
    } catch (err) {
      console.error("Error fetching mentors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConnect = async (mentorId) => {
    try {
      const res = await requestService.sendRequest({ receiver: mentorId });
      // UI update bina refresh ke
      setMentors(prev => prev.map(m => 
        m._id === mentorId ? { ...m, connectionStatus: 'pending' } : m
      ));
    } catch (err) {
      const errorMsg = err.response?.data?.message || "";
      if (errorMsg.includes("already sent")) {
        // Agar DB mein hai par UI mein nahi dikha raha tha, toh ab update kar do
        setMentors(prev => prev.map(m => 
          m._id === mentorId ? { ...m, connectionStatus: 'pending' } : m
        ));
      } else {
        alert(errorMsg || "Failed to connect");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#f6f8f6] dark:bg-[#102216] font-['Lexend']">
      <ExploreNavbar />
      
      <div className="p-8 max-w-[1200px] mx-auto w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <SkillCard 
                key={mentor._id || mentor.name} 
                {...mentor} 
                onConnect={() => handleConnect(mentor._id)}
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-4">
          <button className="px-8 py-3 rounded-xl border border-slate-200 dark:border-[#326744] text-slate-900 dark:text-white font-bold hover:bg-white dark:hover:bg-[#112217] shadow-sm transition-all active:scale-95">
            Load More Results
          </button>
          <p className="text-slate-500 dark:text-[#92c9a4] text-xs">
            Showing {mentors.length} of 1,248 available skill swaps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Explore;