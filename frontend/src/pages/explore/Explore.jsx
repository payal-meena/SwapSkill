import React, { useState, useEffect, useContext, useMemo } from 'react';
import ExploreNavbar from '../../components/explore/ExploreNavbar';
import SkillCard from '../../components/explore/SkillCard';
import api from '../../services/api';
import { requestService } from '../../services/requestService';
import { blockService } from '../../services/blockService';
import { SocketContext } from '../../context/SocketContext';
import Toast from '../../components/common/Toast';

const Explore = () => {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filters, setFilters] = useState({ experience: '', skills: [] }); 
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });
  
  // 🟢 Configuration
  const INITIAL_VISIBLE_COUNT = 6;
  const LOAD_STEP = 6; // Har click pe kitne cards badhenge
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mentorRes, requestRes, blockedRes] = await Promise.all([
        api.get("/explore"),
        requestService.getMyRequests(),
        blockService.getBlockedUsers().catch(() => ({ blockedUsers: [] }))
      ]);

      const allMentors = mentorRes.data || [];
      const myRequests = requestRes?.requests || [];
      const currentUserId = requestRes?.currentUser;

      const blockedUserIds = new Set(
        (blockedRes?.blockedUsers || []).map(u => u._id || u)
      );

      const requestMap = new Map();
      myRequests.forEach(req => {
        if (req.status === "cancelled") return;
        const otherUserId = req.receiver?._id === currentUserId ? req.requester?._id : req.receiver?._id;
        if (otherUserId) requestMap.set(otherUserId, req);
      });

      const mentorsWithStatus = allMentors
        .filter(mentor => mentor._id !== currentUserId && !blockedUserIds.has(mentor._id))
        .map(mentor => {
          const foundRequest = requestMap.get(mentor._id);
          const status = foundRequest ? foundRequest.status : "none";
          return {
            ...mentor,
            requestId: foundRequest?._id || null,
            connectionStatus: status === "rejected" ? "none" : status
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
        console.error('Error handling requestUpdated socket event', err);
      }
    };

    const handleUserUnblocked = () => fetchData();

    socketCtx.on('requestUpdated', handleRequestUpdated);
    socketCtx.on('userUnblocked', handleUserUnblocked);

    return () => {
      socketCtx.off('requestUpdated', handleRequestUpdated);
      socketCtx.off('userUnblocked', handleUserUnblocked);
    };
  }, [socketCtx]);

  // --- FILTERING LOGIC ---
  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = mentor.name?.toLowerCase().includes(searchLower);
      const matchesOffered = mentor.offeredSkills?.some(skill => 
        skill.name?.toLowerCase().includes(searchLower)
      );
      const matchesWanted = mentor.wantedSkills?.some(skill => 
        (typeof skill === 'string' ? skill : skill.name)?.toLowerCase().includes(searchLower)
      );
      const matchesSearch = !searchTerm || matchesName || matchesOffered || matchesWanted;

      const matchesExperience = !filters.experience || mentor.offeredSkills?.some((skill) => {
        if (filters.skills.length > 0) {
          const skillMatched = filters.skills.some(s => skill.name?.toLowerCase() === s.toLowerCase());
          if (!skillMatched) return false;
        }
        const exp = Number(skill.experience || 0);
        switch (filters.experience) {
          case '0-1': return exp >= 0 && exp <= 1;
          case '1-3': return exp > 1 && exp <= 3;
          case '3-5': return exp > 3 && exp <= 5;
          case '5+': return exp > 5;
          default: return true;
        }
      });

      const matchesSkills = filters.skills.length === 0 || filters.skills.some(filterSkill => 
        mentor.offeredSkills?.some(skill => skill.name?.toLowerCase().includes(filterSkill.toLowerCase())) ||
        mentor.wantedSkills?.some(skill => (typeof skill === 'string' ? skill : skill.name)?.toLowerCase().includes(filterSkill.toLowerCase()))
      );

      return matchesSearch && matchesExperience && matchesSkills;
    });
  }, [mentors, searchTerm, filters]);

  // 🟢 Slice for pagination
  const displayedMentors = filteredMentors.slice(0, visibleCount);

  // 🟢 Load More / Show Less handlers
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + LOAD_STEP);
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    // Optional: Smooth scroll up to top when clicking show less
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConnect = async (mentorId) => {
    try {
      const response = await requestService.sendRequest({ receiver: mentorId });
      setMentors(prev => prev.map(m => 
        m._id === mentorId ? { ...m, connectionStatus: 'pending', requestId: response.data?.request?._id } : m
      ));
      showToast('Request sent!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send request", 'error');
    }
  };

  const handleDisconnect = async (mentorId) => {
    try {
      const mentor = mentors.find(m => m._id === mentorId);
      if (!mentor?.requestId) return showToast('Connection not found', 'error');

      await requestService.unfriendUser(mentor.requestId);
      setMentors(prev => prev.map(m => 
        m._id === mentorId ? { ...m, connectionStatus: 'none', requestId: null } : m
      ));
      showToast('Unfollowed successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to unfollow', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto scrollbar-hide bg-[#f6f8f6] dark:bg-[#102216] font-['Lexend']">
      <ExploreNavbar 
        onSearch={(value) => { setSearchTerm(value); setVisibleCount(INITIAL_VISIBLE_COUNT); }} 
        onFilter={(filterData) => { setFilters(filterData); setVisibleCount(INITIAL_VISIBLE_COUNT); }}
      />
      
      <div className="p-4 sm:p-8 max-w-[1200px] mx-auto w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
              {displayedMentors.length > 0 ? (
                displayedMentors.map((mentor) => (
                  <SkillCard 
                    key={mentor._id} 
                    {...mentor} 
                    onConnect={() => handleConnect(mentor._id)}
                    onDisconnect={() => handleDisconnect(mentor._id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 px-4">
                  <p className="text-slate-500 dark:text-[#92c9a4] text-base sm:text-lg font-bold">
                    No mentors found matching your criteria
                  </p>
                </div>
              )}
            </div>

            {/* 🟢 Action Section: Load More or Show Less */}
            {!loading && filteredMentors.length > INITIAL_VISIBLE_COUNT && (
              <div className="mt-8 sm:mt-12 flex flex-col items-center gap-4">
                {visibleCount < filteredMentors.length ? (
                  <button 
                    onClick={handleLoadMore}
                    className="px-6 sm:px-8 py-3 rounded-xl border border-slate-200 dark:border-[#326744] text-slate-900 dark:text-white font-bold hover:bg-white dark:hover:bg-[#112217] shadow-sm transition-all active:scale-95"
                  >
                    Load More Results
                  </button>
                ) : (
                  <button 
                    onClick={handleShowLess}
                    className="px-6 sm:px-8 py-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 transition-all active:scale-95"
                  >
                    Show Less
                  </button>
                )}
                
                <p className="text-slate-500 dark:text-[#92c9a4] text-xs">
                  Showing {displayedMentors.length} of {filteredMentors.length} results
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  );
};

export default Explore;