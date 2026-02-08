import React, { useState, useEffect, useContext } from 'react';
import ExploreNavbar from '../../components/explore/ExploreNavbar';
import SkillCard from '../../components/explore/SkillCard';
import api from '../../services/api';
import { requestService } from '../../services/requestService';
import { blockService } from '../../services/blockService';
import { SocketContext } from '../../context/SocketContext';
import Toast from '../../components/common/Toast';

const Explore = () => {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [filters, setFilters] = useState({ experience: '', skills: [] }); // Filter state
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

      // Get blocked users list
      let blockedUserIds = [];
      try {
        const blockedRes = await blockService.getBlockedUsers();
        if (blockedRes.blockedUsers) {
          blockedUserIds = blockedRes.blockedUsers.map(u => u._id || u);
        }
      } catch (err) {
        console.log('Could not fetch blocked users list');
      }

      const mentorsWithStatus = allMentors
        .filter(mentor => mentor._id !== currentUserId && !blockedUserIds.includes(mentor._id))
        .map(mentor => {
          const foundRequest = myRequests.find(req => 
            (req.receiver?._id === mentor._id || req.requester?._id === mentor._id) &&
            req.status !== 'cancelled'
          );
          // If request is rejected, treat it as 'none' so user can send request again
          const status = foundRequest ? foundRequest.status : 'none';

          return {
            ...mentor,
            requestId: foundRequest?._id || null,
            connectionStatus: status === 'rejected' ? 'none' : status
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

  // Listen for real-time request updates to sync UI across mentor cards
  const socketCtx = useContext(SocketContext);

  useEffect(() => {
    if (!socketCtx || !socketCtx.on) return;

    const handleRequestUpdated = (updatedRequest) => {
      try {
        const r = typeof updatedRequest.toObject === 'function' ? updatedRequest.toObject() : updatedRequest;
        const receiverId = r.receiver?._id || r.receiver;
        const requesterId = r.requester?._id || r.requester;

        setMentors(prev => prev.map(mentor => {
          const isInvolved = (mentor._id === receiverId || mentor._id === requesterId);
          if (isInvolved) {
            const newStatus = r.status === 'rejected' ? 'none' : r.status === 'cancelled' ? 'none' : r.status;
            return { ...mentor, connectionStatus: newStatus };
          }
          return mentor;
        }));
      } catch (err) {
        console.error('Error handling requestUpdated socket event in Explore', err);
      }
    };

    const handleUserUnblocked = (data) => {
      // When user is unblocked, refresh the mentor list
      fetchData();
    };

    socketCtx.on('requestUpdated', handleRequestUpdated);
    socketCtx.on('userUnblocked', handleUserUnblocked);

    return () => {
      socketCtx.off('requestUpdated', handleRequestUpdated);
      socketCtx.off('userUnblocked', handleUserUnblocked);
    };
  }, [socketCtx]);

  // --- FILTERING LOGIC ---
  const filteredMentors = mentors.filter((mentor) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search filter
    const matchesName = mentor.name?.toLowerCase().includes(searchLower);
    const matchesOffered = mentor.offeredSkills?.some(skill => 
      skill.name?.toLowerCase().includes(searchLower)
    );
    const matchesWanted = mentor.wantedSkills?.some(skill => 
      (typeof skill === 'string' ? skill : skill.name)?.toLowerCase().includes(searchLower)
    );
    const matchesSearch = !searchTerm || matchesName || matchesOffered || matchesWanted;

    // Experience filter - only apply to selected skills if skills are selected
   const matchesExperience =
  !filters.experience ||
  mentor.offeredSkills?.some((skill) => {

    // 🟢 Step 1: agar skills select hain, to pehle skill match karo
    if (filters.skills.length > 0) {
      const skillMatched = filters.skills.some(
        (s) => skill.name?.toLowerCase() === s.toLowerCase()
      );
      if (!skillMatched) return false;
    }

    // 🟢 Step 2: experience number nikalo
    const exp = Number(skill.experience || 0);

    switch (filters.experience) {
      case '0-1':
        return exp >= 0 && exp <= 1;
      case '1-3':
        return exp > 1 && exp <= 3;
      case '3-5':
        return exp > 3 && exp <= 5;
      case '5+':
        return exp > 5;
      default:
        return true;
    }
  });


    // Skills filter
    const matchesSkills = filters.skills.length === 0 || 
      filters.skills.some(filterSkill => 
        mentor.offeredSkills?.some(skill => 
          skill.name?.toLowerCase().includes(filterSkill.toLowerCase())
        ) ||
        mentor.wantedSkills?.some(skill => 
          (typeof skill === 'string' ? skill : skill.name)?.toLowerCase().includes(filterSkill.toLowerCase())
        )
      );

    return matchesSearch && matchesExperience && matchesSkills;
  });

  const handleConnect = async (mentorId) => {
    try {
      const response = await requestService.sendRequest({ receiver: mentorId });
      setMentors(prev => prev.map(m => 
        m._id === mentorId ? { ...m, connectionStatus: 'pending', requestId: response.data?.request?._id } : m
      ));
      showToast('Request sent! Waiting for acceptance...', 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.message || "";
      showToast(errorMsg || "Failed to send request", 'error');
    }
  };

  const handleDisconnect = async (mentorId) => {
    try {
      // Find the mentor and their request ID
      const mentor = mentors.find(m => m._id === mentorId);
      if (!mentor || !mentor.requestId) {
        showToast('Connection not found', 'error');
        return;
      }

      // Call unfriend API immediately
      await requestService.unfriendUser(mentor.requestId);

      // Update local state immediately
      setMentors(prev => prev.map(m => 
        m._id === mentorId ? { ...m, connectionStatus: 'none', requestId: null } : m
      ));
      showToast('Unfollowed successfully!', 'success');
    } catch (err) {
      console.error('Disconnect error:', err);
      showToast(err.message || 'Failed to unfollow', 'error');
    }
  };
 

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto scrollbar-hide bg-[#f6f8f6] dark:bg-[#102216] font-['Lexend']">
      {/* Navbar ko setSearchTerm aur setFilters bhej rahe hain */}
      <ExploreNavbar 
        onSearch={(value) => setSearchTerm(value)} 
        onFilter={(filterData) => setFilters(filterData)}
      />
      
      <div className="p-4 sm:p-8 max-w-[1200px] mx-auto w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor) => (
                <SkillCard 
                  key={mentor._id || mentor.name} 
                  {...mentor} 
                  requestId={mentor.requestId}
                  onConnect={() => handleConnect(mentor._id)}
                  onDisconnect={() => handleDisconnect(mentor._id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 px-4">
                <p className="text-slate-500 dark:text-[#92c9a4] text-base sm:text-lg font-bold">
                  {searchTerm || filters.experience || filters.skills.length > 0 
                    ? `No mentors found matching your criteria` 
                    : "No mentors available"
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Section */}
        {!loading && filteredMentors.length > 0 && (
          <div className="mt-8 sm:mt-12 flex flex-col items-center gap-4">
            <button className="px-6 sm:px-8 py-3 rounded-xl border border-slate-200 dark:border-[#326744] text-slate-900 dark:text-white font-bold hover:bg-white dark:hover:bg-[#112217] shadow-sm transition-all active:scale-95">
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