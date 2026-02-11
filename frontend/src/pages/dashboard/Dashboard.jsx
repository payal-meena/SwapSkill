
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
    /* Card Background updated to match rgb(17, 34, 23) style */
    <button onClick={onClick} className="group relative flex flex-col gap-2 rounded-[2rem] p-4 sm:p-8 bg-[#1a2e21] border border-[#13ec5b]/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#13ec5b]/40 transition-all duration-500 overflow-hidden text-left">
      {/* Background Accent Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#13ec5b]/5 blur-3xl group-hover:bg-[#13ec5b]/10 transition-all" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="p-2 sm:p-3 bg-[#13ec5b]/10 rounded-2xl text-[#13ec5b]">
          <span className="material-symbols-outlined !text-2xl sm:!text-3xl">{icon}</span>
        </div>
        <div className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${isPositive ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : 'bg-white/5 text-slate-400'}`}>
          {trend}
        </div>
      </div>

      <div className="mt-4 sm:mt-6 relative z-10">
        <p className="text-[#92c9a4] text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">
          {label}
        </p>
        <p className="text-white text-2xl sm:text-4xl font-black tracking-tighter">
          {value}
        </p>
      </div>
      
      {/* Hover Line Effect */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#13ec5b] group-hover:w-full transition-all duration-700" />
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

          // Build connections list (other user in each accepted request)
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

          // Fetch each user's skills from API to populate offered/wanted lists
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

        // Fetch last chat
        try {
          const chatsRes = await chatService.getMyChats();
          if (chatsRes?.chats && chatsRes.chats.length > 0) {
            const sortedChats = chatsRes.chats.sort((a, b) => 
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

  return (
    /* Main Background updated to #112217 (rgb 17,34,23) */
    <div className="flex h-screen overflow-hidden bg-[#112217] font-['Lexend'] text-white">

      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {/* Navbar */}
       
        <div className="p-4 sm:p-8 lg:p-12 max-w-[1400px] mx-auto w-full">
          
          {/* Header Section */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">
              User <span className="text-[#13ec5b]">Dashboard</span>
            </h1>
            <p className="text-[#92c9a4] text-xs font-bold uppercase tracking-[0.3em] mt-2 opacity-60">
              Overview of your learning journey
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
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

        

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12">
            
            {/* Left Content - Current Exchanges */}
            <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-8">
               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0 border-b border-[#13ec5b]/10 pb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">Current Exchanges</h2>
                    <p className="text-[10px] text-[#13ec5b] font-bold uppercase tracking-widest mt-1">Active learning sessions</p>
                  </div>
                  <button className="px-4 py-2 bg-white/5 hover:bg-[#13ec5b]/10 text-[#13ec5b] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-[#13ec5b]/10 whitespace-nowrap">
                    View all
                  </button>
               </div>

               <div className="grid gap-4 sm:gap-6">
                 {lastChat ? (
                   <div className="bg-[#1a2e21] border border-[#13ec5b]/10 rounded-[2rem] p-6 hover:border-[#13ec5b]/40 transition-all">
                     <div className="flex items-center gap-4 mb-4">
                       <Avatar 
                         src={lastChat.otherUser?.profileImage} 
                         name={lastChat.otherUser?.name || 'User'} 
                         size="w-16 h-16" 
                         textSize="text-xl"
                         className="border-2 border-[#13ec5b]"
                       />
                       <div className="flex-1">
                         <h3 className="text-lg font-black text-white">{lastChat.otherUser?.name || 'Unknown User'}</h3>
                         <p className="text-slate-400 text-sm truncate">{lastChat.lastMessage?.text || 'No messages yet'}</p>
                       </div>
                     </div>
                     <button 
                       onClick={() => navigate(`/messages/${lastChat.otherUser?._id}`)}
                       className="w-full py-3 bg-[#13ec5b] text-[#05160e] font-black rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                     >
                       <span className="material-symbols-outlined">chat</span>
                       Start Chat
                     </button>
                   </div>
                 ) : (
                   <div className="bg-[#1a2e21] border border-[#13ec5b]/10 rounded-[2rem] p-12 text-center">
                     <p className="text-slate-400 text-sm">No recent discussions</p>
                   </div>
                 )}
               </div>
            </div>

            {/* Right Content - Requests */}
            <div className="flex flex-col gap-6 sm:gap-8">
              {/* Box background changed to #1a2e21 for slight contrast against #112217 */}
              <div className="bg-[#1a2e21] border border-[#13ec5b]/10 rounded-[2.5rem] p-2 shadow-2xl">
                <PendingRequests />
              </div>
            </div>

          </div>
        </div>
      </main>
      {/* Connections Modal */}
      {showConnectionsModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-2xl bg-[#0b2316] rounded-2xl p-6 shadow-2xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white">Your Connections</h3>
              <button onClick={() => setShowConnectionsModal(false)} className="text-slate-400 hover:text-white">Close</button>
            </div>

            {connections.length === 0 ? (
              <div className="py-12 text-center text-slate-400">No connections yet.</div>
            ) : (
              <div className="space-y-3">
                {connections.map((u) => (
                  <div key={u.id} className="flex items-center justify-between bg-[#071711] p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-4">
                      {u.img ? (
                        <img src={u.img} alt={u.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#13ec5b]" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#13ec5b] border-2 border-[#13ec5b] flex items-center justify-center text-[#05160e] font-black text-xl uppercase">
                          {u.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-sm text-slate-400">{u.offeredSkills?.length || 0} offered · {u.wantedSkills?.length || 0} learning</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
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
                        className="px-4 py-2 bg-[#13ec5b] text-[#05160e] font-bold rounded-lg"
                      >
                        View Profile
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