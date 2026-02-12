
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from "../../components/common/UserSidebar";
import ExchangeCard from '../../components/exchange/ExchangeCard';
import UserNavbar from '../../components/common/UserNavbar';
import PendingRequests from '../../components/requests/PendingRequests';
import TestNotification from '../../components/common/TestNotification';
import { skillService } from '../../services/skillService';
import { requestService } from '../../services/requestService';
import { chatService } from '../../services/chatService';
import Avatar from '../../components/common/Avatar';

const StatCard = ({ label, value, trend, icon, onClick }) => {
  const isPositive = trend.includes('+');
  
  return (
    <button onClick={onClick} className="group relative flex flex-col gap-1.5 sm:gap-2 rounded-xl sm:rounded-[2rem] p-3 sm:p-6 lg:p-8 bg-[#1a2e21] border border-[#13ec5b]/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#13ec5b]/40 transition-all duration-500 overflow-hidden text-left">
      <div className="absolute -right-3 -top-3 sm:-right-4 sm:-top-4 w-16 h-16 sm:w-24 sm:h-24 bg-[#13ec5b]/5 blur-3xl group-hover:bg-[#13ec5b]/10 transition-all" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="p-1.5 sm:p-2 lg:p-3 bg-[#13ec5b]/10 rounded-xl sm:rounded-2xl text-[#13ec5b]">
          <span className="material-symbols-outlined !text-xl sm:!text-2xl lg:!text-3xl">{icon}</span>
        </div>
        <div className={`px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full text-[7px] sm:text-[8px] lg:text-[10px] font-black uppercase tracking-wider sm:tracking-widest ${isPositive ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : 'bg-white/5 text-slate-400'}`}>
          {trend}
        </div>
      </div>

      <div className="mt-2 sm:mt-4 lg:mt-6 relative z-10">
        <p className="text-[#92c9a4] text-[7px] sm:text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-0.5 sm:mb-1 opacity-70">
          {label}
        </p>
        <p className="text-white text-xl sm:text-2xl lg:text-4xl font-black tracking-tighter">
          {value}
        </p>
      </div>
      
      <div className="absolute bottom-0 left-0 h-[1.5px] sm:h-[2px] w-0 bg-[#13ec5b] group-hover:w-full transition-all duration-700" />
    </button>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [offeredCount, setOfferedCount] = useState(0);
  const [wantedCount, setWantedCount] = useState(0);
  const [acceptedRequestsCount, setAcceptedRequestsCount] = useState(0);
  const [connections, setConnections] = useState([]);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [lastChat, setLastChat] = useState(null);

  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return JSON.parse(window.atob(token.split('.')[1])).id;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const skillsRes = await skillService.getMySkills();
        if (skillsRes?.success) setOfferedCount(skillsRes.skills?.length || 0);

        const wantedRes = await skillService.getMyWantedSkills();
        if (wantedRes?.success) setWantedCount(wantedRes.skills?.length || 0);

        const reqRes = await requestService.getMyRequests();
        if (reqRes) {
          const acceptedRequests = (reqRes.requests || []).filter(r => r.status === 'accepted' || r.status === 'completed');
          setAcceptedRequestsCount(acceptedRequests.length);

          const currentUserId = reqRes.currentUser;
          const otherMap = {};
          acceptedRequests.forEach(r => {
            const other = (r.requester && r.requester._id?.toString() === currentUserId?.toString()) ? r.receiver : r.requester;
            const id = other?._id || other?.id;
            if (!id) return;
            if (!otherMap[id]) {
              otherMap[id] = {
                id,
                name: other?.name || other?.username || 'Unknown',
                img: other?.profileImage || other?.avatar || null,
                rating: other?.rating || 0,
                reviews: other?.reviews || 0,
                socials: other?.socials || {}
              };
            }
          });

          const ids = Object.keys(otherMap);
          const usersWithSkills = await Promise.all(ids.map(async (uid) => {
            try {
              const skillsRes = await skillService.getUserSkills(uid);
              const offered = skillsRes?.offered || skillsRes?.skills || skillsRes?.offeredSkills || [];
              const wanted = skillsRes?.wanted || skillsRes?.wantedSkills || [];
              return {
                ...otherMap[uid],
                offeredSkills: offered,
                wantedSkills: wanted
              };
            } catch (err) {
              return { ...otherMap[uid], offeredSkills: [], wantedSkills: [] };
            }
          }));

          setConnections(usersWithSkills);
        }

        try {
          const chatsData = await chatService.getMyChats();
          if (chatsData && Array.isArray(chatsData) && chatsData.length > 0) {
            const sortedChats = chatsData.sort((a, b) => 
              new Date(b.lastMessage?.createdAt || b.updatedAt) - new Date(a.lastMessage?.createdAt || a.updatedAt)
            );
            setLastChat(sortedChats[0]);
          }
        } catch (err) {
          console.error('Error loading last chat', err);
        }
      } catch (err) {
        console.error('Error loading dashboard stats', err);
      }
    };

    loadStats();
  }, []);

  const myId = getCurrentUserId();
  const otherUser = lastChat?.participants?.find(p => (p._id || p) !== myId);

  return (
    <div className="flex h-screen overflow-hidden bg-[#112217] font-['Lexend'] text-white">
      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="p-3 sm:p-6 lg:p-12 max-w-[1400px] mx-auto w-full">
          
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-white">
              User <span className="text-[#13ec5b]">Dashboard</span>
            </h1>
            <p className="text-[#92c9a4] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1 sm:mt-2 opacity-60">
              Overview of your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
            <StatCard
              label="Skills Offered"
              value={offeredCount}
              trend="+1 This Month"
              icon="school"
              onClick={() => navigate('/my-skills')}
            />
            <StatCard
              label="Skills Learning"
              value={wantedCount}
              trend="On Track"
              icon="auto_stories"
              onClick={() => navigate('/my-skills?tab=wanted')}
            />
            <StatCard
              label="Connections"
              value={acceptedRequestsCount}
              trend="Recent Activity"
              icon="verified"
              onClick={() => setShowConnectionsModal(true)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12">
            
            <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6 lg:gap-8">
              <div className="border-b border-[#13ec5b]/10 pb-3 sm:pb-4">
                <h2 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-tight text-white">Last Discussion</h2>
                <p className="text-[9px] sm:text-[10px] text-[#13ec5b] font-bold uppercase tracking-wider sm:tracking-widest mt-0.5 sm:mt-1">Recent conversation</p>
              </div>

              <div className="grid gap-3 sm:gap-4 lg:gap-6">
                {lastChat ? (
                  <div className="bg-[#1a2e21] border border-[#13ec5b]/10 rounded-xl sm:rounded-2xl lg:rounded-[2rem] p-4 sm:p-5 lg:p-6 hover:border-[#13ec5b]/40 transition-all">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <Avatar 
                        src={otherUser?.profileImage} 
                        name={otherUser?.name || 'User'} 
                        size="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16" 
                        textSize="text-base sm:text-lg lg:text-xl"
                        className="border-2 border-[#13ec5b]"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base lg:text-lg font-black text-white truncate">{otherUser?.name || 'Unknown User'}</h3>
                        <p className="text-slate-400 text-xs sm:text-sm truncate">{lastChat.lastMessage?.text || 'No messages yet'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/messages/${otherUser?._id || otherUser}`)}
                      className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-[#13ec5b] text-[#05160e] font-black rounded-lg sm:rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg sm:text-xl">chat</span>
                      Start Chat
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#1a2e21] border border-[#13ec5b]/10 rounded-xl sm:rounded-2xl lg:rounded-[2rem] p-8 sm:p-10 lg:p-12 text-center">
                    <p className="text-slate-400 text-xs sm:text-sm">No recent discussions</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-[#1a2e21] border border-[#13ec5b]/10 rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] p-1.5 sm:p-2 shadow-2xl">
                <PendingRequests />
              </div>
            </div>

          </div>
        </div>
      </main>

      {showConnectionsModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/60">
          <div className="w-full max-w-2xl bg-[#0b2316] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-black text-white">Your Connections</h3>
              <button onClick={() => setShowConnectionsModal(false)} className="text-slate-400 hover:text-white text-sm sm:text-base">Close</button>
            </div>

            {connections.length === 0 ? (
              <div className="py-8 sm:py-12 text-center text-slate-400 text-sm">No connections yet.</div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {connections.map((u) => (
                  <div key={u.id} className="flex items-center justify-between bg-[#071711] p-2.5 sm:p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                      {u.img ? (
                        <img src={u.img} alt={u.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#13ec5b] flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#13ec5b] border-2 border-[#13ec5b] flex items-center justify-center text-[#05160e] font-black text-base sm:text-xl uppercase flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-white text-sm sm:text-base truncate">{u.name}</div>
                        <div className="text-xs sm:text-sm text-slate-400">{u.offeredSkills?.length || 0} offered · {u.wantedSkills?.length || 0} learning</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <button
                        onClick={() => {
                          const profileData = {
                            name: u.name,
                            img: u.img,
                            rating: u.rating,
                            reviews: u.reviews,
                            offeredSkills: u.offeredSkills,
                            wantedSkills: u.wantedSkills,
                            socials: u.socials
                          };
                          setShowConnectionsModal(false);
                          navigate('/explore-profile', { state: profileData });
                        }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#13ec5b] text-[#05160e] font-bold rounded-lg"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
