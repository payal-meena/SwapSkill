
// export default MyConnection;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import { requestService } from '../../services/requestService';
import { skillService } from '../../services/skillService';
import Avatar from '../../components/common/Avatar';

const MyConnection = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      // 1. Dashboard ki tarah requests fetch karein
      const reqRes = await requestService.getMyRequests();
      
      if (reqRes && reqRes.requests) {
        // 2. Sirf 'accepted' status wali requests filter karein
        const acceptedRequests = reqRes.requests.filter(
          (r) => r.status === 'accepted' || r.status === 'completed'
        );

        const currentUserId = reqRes.currentUser;
        const otherMap = {};

        // 3. Request se doosre user ka data extract karein
        acceptedRequests.forEach((r) => {
          const other = (r.requester && (r.requester._id || r.requester) === currentUserId) 
            ? r.receiver 
            : r.requester;

          const id = other?._id || other?.id;
          if (id && !otherMap[id]) {
            otherMap[id] = {
              id,
              name: other?.name || 'Unknown User',
              profileImage: other?.profileImage || `https://ui-avatars.com/api/?name=${other?.name || 'U'}&bg=13ec5b&color=000`,
              profession: other?.profession || 'Skill Exchanger',
              bio: other?.bio || 'No bio available',
              rating: other?.rating || 0
            };
          }
        });

        // Object ko array mein convert karke state set karein
        setConnections(Object.values(otherMap));
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#112217] font-['Lexend'] text-white">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        
        {/* Navbar Call (Notifications ke liye) */}
        {/* <UserNavbar /> */}

        <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-10">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-white">
              My <span className="text-[#13ec5b]">Connections</span>
            </h1>
            <p className="text-[#92c9a4] text-[9px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1 sm:mt-2 opacity-60">
              Manage your skill exchange network
            </p>
          </div>

          {loading ? (
            /* Loading State */
            <div className="flex flex-col justify-center items-center py-16 sm:py-20 lg:py-24">
              <div className="size-10 sm:size-12 lg:size-14 border-4 border-[#13ec5b]/10 border-t-[#13ec5b] rounded-full animate-spin mb-3 sm:mb-4" />
              <p className="text-[#92c9a4] text-[10px] sm:text-xs font-bold animate-pulse">LOADING NETWORK...</p>
            </div>
          ) : connections.length > 0 ? (
            /* Connections Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-8">
              {connections.map((user) => (
                <div
                  key={user.id}
                  className="group relative bg-[#1a2e21] border border-[#13ec5b]/10 rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 lg:p-6 hover:border-[#13ec5b]/40 transition-all duration-500 overflow-hidden"
                >
                  {/* Background Glow */}
                  <div className="absolute -right-3 -top-3 sm:-right-4 sm:-top-4 w-16 h-16 sm:w-20 sm:h-20 bg-[#13ec5b]/5 blur-3xl group-hover:bg-[#13ec5b]/10 transition-all" />

                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 relative z-10">
                    
                <Avatar 
              src={user.profileImage} 
              name={user.name} 
              size="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28" 
              textSize="text-base sm:text-lg lg:text-2xl"
              className="border-2 border-[#13ec5b] flex-shrink-0"
            />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg lg:text-xl font-black text-white group-hover:text-[#13ec5b] transition-colors truncate">
                        {user.name}
                      </h3>
                      <p className="text-[#92c9a4] text-[8px] sm:text-[9px] lg:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest opacity-70 truncate">
                        {user.profession}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-[11px] sm:text-xs lg:text-sm mt-3 sm:mt-4 lg:mt-6 mb-3 sm:mb-4 lg:mb-8 line-clamp-2 min-h-[32px] sm:min-h-[40px] italic">
                    "{user.bio}"
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-2.5 lg:gap-3 relative z-10">
                    <button 
                      onClick={() => navigate(`/messages/${user.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 lg:py-3 bg-[#13ec5b]/10 hover:bg-[#13ec5b] text-[#13ec5b] hover:text-[#0a1a10] rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest transition-all duration-300 whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined !text-sm sm:!text-base lg:!text-lg">chat</span>
                      <span className="hidden xs:inline">Message</span>
                    </button>
                    <button 
                      onClick={() => navigate('/explore-profile', { state: user })}
                      className="px-2.5 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg sm:rounded-xl transition-all flex-shrink-0"
                    >
                      <span className="material-symbols-outlined !text-base sm:!text-lg">visibility</span>
                    </button>
                  </div>

                  {/* Hover Line */}
                  <div className="absolute bottom-0 left-0 h-[2px] sm:h-[3px] w-0 bg-[#13ec5b] group-hover:w-full transition-all duration-700" />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 sm:py-24 lg:py-32 bg-[#1a2e21]/30 border-2 border-dashed border-[#13ec5b]/10 rounded-2xl sm:rounded-[3rem] px-4">
              <span className="material-symbols-outlined text-[#13ec5b]/20 text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6">group_off</span>
              <p className="text-white text-base sm:text-lg lg:text-xl font-black uppercase tracking-tighter">No connections found</p>
              <p className="text-[#92c9a4] text-[10px] sm:text-xs mt-1 sm:mt-2 uppercase tracking-wider sm:tracking-widest opacity-60">Start exploring to build your network</p>
              <button 
                onClick={() => navigate('/explore')}
                className="mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#13ec5b] text-[#0a1a10] font-black uppercase text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] rounded-full hover:scale-105 transition-all"
              >
                Find Mentors
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyConnection;