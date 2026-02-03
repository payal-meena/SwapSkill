import React, { useState, useEffect } from 'react';
import ExploreNavbar from '../../components/explore/ExploreNavbar';
import SkillCard from '../../components/explore/SkillCard';
import api from '../../services/api';
import { requestService } from '../../services/requestService';
import Toast from '../../components/common/Toast';

const Explore = () => {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const mentorRes = await api.get("/explore");
      const allMentors = mentorRes.data;

      const requestRes = await requestService.getMyRequests();
      const myRequests = requestRes.requests || [];
      const currentUserId = requestRes.currentUser;

      const mentorsWithStatus = allMentors
        .filter(mentor => mentor._id !== currentUserId)
        .map(mentor => {
          const foundRequest = myRequests.find(req => 
            (req.receiver?._id === mentor._id || req.requester?._id === mentor._id) &&
            req.status !== 'cancelled'
          );

          return {
            ...mentor,
            connectionStatus: foundRequest ? foundRequest.status : 'none'
          };
        })
        .sort((a, b) => {
          const contentA = (a.offeredSkills?.length || 0) + (a.wantedSkills?.length || 0);
          const contentB = (b.offeredSkills?.length || 0) + (b.wantedSkills?.length || 0);
          return contentA - contentB;
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

  // --- FILTERING LOGIC ---
  const filteredMentors = mentors.filter((mentor) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Check name
    const matchesName = mentor.name?.toLowerCase().includes(searchLower);
    
    // Check offered skills
    const matchesOffered = mentor.offeredSkills?.some(skill => 
      skill.name?.toLowerCase().includes(searchLower)
    );

    // Check wanted skills
    const matchesWanted = mentor.wantedSkills?.some(skill => 
      (typeof skill === 'string' ? skill : skill.name)?.toLowerCase().includes(searchLower)
    );

    return matchesName || matchesOffered || matchesWanted;
  });

  const handleConnect = async (mentorId) => {
    try {
      await requestService.sendRequest({ receiver: mentorId });
      setMentors(prev => prev.map(m => 
        m._id === mentorId ? { ...m, connectionStatus: 'pending' } : m
      ));
      showToast('Connection request sent successfully!', 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.message || "";
      if (errorMsg.includes("already sent")) {
        setMentors(prev => prev.map(m => 
          m._id === mentorId ? { ...m, connectionStatus: 'pending' } : m
        ));
        showToast('Request already sent', 'info');
      } else {
        showToast(errorMsg || "Failed to connect", 'error');
      }
    }
  };
 

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto scrollbar-hide bg-[#f6f8f6] dark:bg-[#102216] font-['Lexend']">
      {/* Navbar ko setSearchTerm bhej rahe hain */}
      <ExploreNavbar onSearch={(value) => setSearchTerm(value)} />
      
      <div className="p-8 max-w-[1200px] mx-auto w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor) => (
                <SkillCard 
                  key={mentor._id || mentor.name} 
                  {...mentor} 
                  onConnect={() => handleConnect(mentor._id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-500 dark:text-[#92c9a4] text-lg font-bold">
                  No mentors found for "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Section */}
        {!loading && filteredMentors.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <button className="px-8 py-3 rounded-xl border border-slate-200 dark:border-[#326744] text-slate-900 dark:text-white font-bold hover:bg-white dark:hover:bg-[#112217] shadow-sm transition-all active:scale-95">
              Load More Results
            </button>
            <p className="text-slate-500 dark:text-[#92c9a4] text-xs">
              Showing {filteredMentors.length} results
            </p>
          </div>
        )}
      </div>
      
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default Explore;