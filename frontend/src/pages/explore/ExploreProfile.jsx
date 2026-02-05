import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { skillService } from '../../services/skillService';
import { requestService } from '../../services/requestService';
import { blockService } from '../../services/blockService';
import { SocketContext } from '../../context/SocketContext';
import { Instagram, Facebook, Github, Ghost, ArrowLeft } from 'lucide-react';
import Avatar from '../../components/common/Avatar';

const ExploreProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current user ID from token
  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return JSON.parse(window.atob(token.split('.')[1])).id;
    } catch (err) {
      console.error('Error parsing token:', err);
      return null;
    }
  };

  const currentUserId = getCurrentUserId();
  
  // 1. Pehle profileData ko location.state se nikaalein
  const profileData = location.state;

  const [offeredSkillsState, setOfferedSkillsState] = useState(profileData?.offeredSkills || []);
  const [wantedSkillsState, setWantedSkillsState] = useState(profileData?.wantedSkills || []);
  const [requestStatus, setRequestStatus] = useState('none'); // none, pending, accepted, rejected
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const socketCtx = useContext(SocketContext);

  useEffect(() => {
    // If state exists and already has skills, keep them. Otherwise fetch by id if available.
    const fetchIfNeeded = async () => {
      try {
        if ((offeredSkillsState.length === 0 && wantedSkillsState.length === 0) && profileData?.id) {
          const res = await skillService.getUserSkills(profileData.id);
          const offered = res?.offered || res?.skills || res?.offeredSkills || [];
          const wanted = res?.wanted || res?.wantedSkills || [];
          setOfferedSkillsState(offered);
          setWantedSkillsState(wanted);
        }

        // Check request status only if user is logged in
        if (currentUserId && profileData?.id && currentUserId !== profileData.id) {
          try {
            const requestRes = await requestService.getMyRequests();
            const myRequests = requestRes.requests || [];
            const foundRequest = myRequests.find(req => 
              (req.receiver?._id === profileData.id || req.requester?._id === profileData.id) &&
              req.status !== 'cancelled'
            );
            // If request is rejected, treat it as 'none' so user can send request again
            const status = foundRequest ? foundRequest.status : 'none';
            setRequestStatus(status === 'rejected' ? 'none' : status);
          } catch (err) {
            console.error('Error checking request status:', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user skills or request status', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIfNeeded();
  }, [profileData, currentUserId]);

  // Listen for real-time request updates
  useEffect(() => {
    if (!socketCtx || !socketCtx.on || !profileData?.id) return;

    const handleRequestUpdated = (updatedRequest) => {
      try {
        const r = typeof updatedRequest.toObject === 'function' ? updatedRequest.toObject() : updatedRequest;
        const isRelevant = (r.receiver?._id === profileData.id && r.requester?._id === currentUserId) ||
                           (r.requester?._id === profileData.id && r.receiver?._id === currentUserId);

        if (!isRelevant) return;

        const newStatus = r.status === 'rejected' ? 'none' : r.status === 'cancelled' ? 'none' : r.status;
        setRequestStatus(newStatus);
      } catch (err) {
        console.error('Error handling requestUpdated socket event in ExploreProfile', err);
      }
    };

    const handleUserBlockedMe = (data) => {
      // If current user is blocked, navigate back to explore
      if (data.blockedBy === profileData?.id) {
        alert('You have been blocked by this user');
        navigate('/explore');
      }
    };

    socketCtx.on('requestUpdated', handleRequestUpdated);
    socketCtx.on('userBlockedMe', handleUserBlockedMe);

    return () => {
      socketCtx.off('requestUpdated', handleRequestUpdated);
      socketCtx.off('userBlockedMe', handleUserBlockedMe);
    };
  }, [socketCtx, profileData?.id, currentUserId]);

  // 2. Agar profileData nahi hai (matlab direct URL access), toh error handling
  if (!profileData) {
    return (
      <div className="min-h-screen bg-[#020a06] flex flex-col items-center justify-center text-white font-['Lexend'] p-4">
        <h1 className="text-red-500 font-black text-3xl mb-4 uppercase tracking-tighter">User Not Found!</h1>
        <p className="text-slate-400 mb-6 text-center">Please go back to the explore page to view a profile.</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-8 py-3 bg-[#13ec5b] text-[#05160e] font-black rounded-xl hover:scale-105 transition-all shadow-[0_10px_20px_rgba(19,236,91,0.2)]"
        >
          BACK TO EXPLORE
        </button>
      </div>
    );
  }

  // 3. Destructure values from profileData with defaults
  const { 
    name = "Sarah Jenkins", 
    img = null, 
    rating = 4.9, 
    reviews = 128,
    socials = {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      github: "https://github.com",
      snapchat: "https://snapchat.com"
    }
  } = profileData || {};

  const openSocial = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFollow = async () => {
    setActionLoading(true);
    try {
      await requestService.sendRequest({ receiver: profileData.id });
      setRequestStatus('pending');
      // Update the location state so it reflects on going back
      window.history.replaceState(
        { ...location.state, requestStatus: 'pending' },
        ''
      );
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to send connection request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setActionLoading(true);
    try {
      // Find and withdraw/unfriend the request
      const requestRes = await requestService.getMyRequests();
      const myRequests = requestRes.requests || [];
      const foundRequest = myRequests.find(req => 
        (req.receiver?._id === profileData.id || req.requester?._id === profileData.id) &&
        req.status !== 'cancelled'
      );
      
      if (!foundRequest) {
        console.warn('No request found to withdraw');
        setRequestStatus('none');
        return;
      }

      console.log('Withdrawing/Unfriending request:', foundRequest._id, 'Status:', foundRequest.status);
      
      // For pending requests, withdraw them
      if (foundRequest.status === 'pending') {
        await requestService.withdrawRequest(foundRequest._id);
      } 
      // For accepted requests, unfriend
      else if (foundRequest.status === 'accepted') {
        await requestService.unfriendUser(foundRequest._id);
      }
      
      setRequestStatus('none');
      // Update the location state so it reflects on going back
      window.history.replaceState(
        { ...location.state, requestStatus: 'none' },
        ''
      );
    } catch (error) {
      console.error('Error unfollowing user:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to unfollow user. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlock = async () => {
    setActionLoading(true);
    try {
      await blockService.blockUser(profileData.id);
      alert('User blocked successfully');
      // Go back to explore page
      navigate('/explore');
    } catch (error) {
      console.error('Error blocking user:', error);
      alert(error.response?.data?.message || 'Failed to block user');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#112217] text-white p-4 md:p-8 font-['Lexend'] flex flex-col items-center">

      {/* Back Button Container */}
      <div className="w-full max-w-3xl mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-[#13ec5b] hover:brightness-125 flex items-center gap-2 transition-all font-black text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="w-full max-w-3xl bg-[#0a1a11] rounded-[2rem] border-2 border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

        {/* Banner Section */}
        <div className="relative h-40 bg-gradient-to-r from-[#052e16] via-[#13ec5b]/60 to-[#064e3b]">
          <div className="absolute -bottom-14 left-8 md:left-12 p-1 bg-[#0a1a11] rounded-full shadow-2xl">
            <Avatar 
              src={img} 
              name={name} 
              size="w-28 h-28" 
              textSize="text-2xl"
              className="border-2 border-[#13ec5b]"
            />
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#13ec5b] border-4 border-[#0a1a11] rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 md:px-10 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Left Side: Info & Dynamic Skills */}
            <div className="md:col-span-7 space-y-8">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-1 text-white uppercase">{name}</h1>
                <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                  <span className="text-[#13ec5b] flex items-center gap-1 bg-[#13ec5b]/10 px-2 py-0.5 rounded-md">
                    ★ {rating}
                  </span>
                  <span>•</span>
                  <span>{reviews} Reviews</span>
                </div>
              </div>

              {/* BIO BOX */}
              <div className="bg-gradient-to-br from-white/[0.05] to-transparent p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#13ec5b]"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-[#13ec5b]">Mentor Bio</h3>
                <p className="text-slate-200 leading-snug text-lg font-medium italic">
                  "Senior professional with extensive experience in the field, passionate about sharing knowledge and skill-swapping with the community."
                </p>
              </div>

              {/* DYNAMIC SKILLS SECTION */}
              <div className="space-y-8">
                <div className="group">
                  <div className="inline-flex items-center gap-2 mb-4 bg-[#13ec5b] px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(19,236,91,0.3)]">
                    <span className="material-symbols-outlined text-[18px] text-[#05160e] font-black">school</span>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-[#05160e]">I Can Teach</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {offeredSkillsState.length > 0 ? offeredSkillsState.map((skill, index) => (
                      <div key={index} className="px-4 py-2 bg-white/5 border border-[#13ec5b]/30 rounded-xl flex items-center gap-3">
                        <span className="font-bold text-white text-md">{skill.name || skill.skillName || skill.title}</span>
                        <span className="text-[9px] font-black bg-[#13ec5b] text-[#05160e] px-1.5 py-0.5 rounded uppercase">
                          {skill.level || skill.leval || skill.levelName}
                        </span>
                      </div>
                    )) : <p className="text-slate-500 text-sm italic">No teaching skills listed</p>}
                  </div>
                </div>

                <div className="group">
                  <div className="inline-flex items-center gap-2 mb-4 bg-amber-500 px-4 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-[18px] text-[#05160e] font-black">bolt</span>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-[#05160e]">I Want To Learn</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {wantedSkillsState.length > 0 ? wantedSkillsState.map((skill, index) => (
                      <div key={index} className="px-4 py-2 bg-white/5 border border-amber-500/30 rounded-xl text-amber-400 font-bold text-md">
                        {typeof skill === 'string' ? skill : (skill.name || skill.skillName || skill.title)}
                      </div>
                    )) : <p className="text-slate-500 text-sm italic">No learning goals listed</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Action Cards */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-3xl font-black text-[#13ec5b]">100%</p>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Response</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-3xl font-black text-white">1.2k</p>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Swaps</p>
                </div>
              </div>

              {/* ACTION AREA */}
              <div className="bg-[#1a2e21] p-5 rounded-[2.5rem] border border-white/10 shadow-xl">
                <div className="mb-6">
                  {requestStatus === 'none' && (
                    <button 
                      onClick={handleFollow}
                      disabled={actionLoading}
                      className="w-full py-4 bg-[#13ec5b] text-[#05160e] font-black text-md rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_10px_25px_rgba(19,236,91,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'SENDING...' : 'CONNECT NOW'}
                    </button>
                  )}
                  
                  {requestStatus === 'pending' && (
                    <button 
                      disabled
                      className="w-full py-4 bg-slate-400 text-white font-black text-md rounded-2xl opacity-70 cursor-not-allowed shadow-[0_10px_25px_rgba(148,163,184,0.3)]"
                    >
                      PENDING - WAITING FOR RESPONSE
                    </button>
                  )}
                  
                  {requestStatus === 'accepted' && (
                    <div className="space-y-3">
                      <button 
                        onClick={handleUnfollow}
                        disabled={actionLoading}
                        className="w-full py-4 bg-amber-500 text-white font-black text-md rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_10px_25px_rgba(217,119,6,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading ? 'PROCESSING...' : 'UNFOLLOW'}
                      </button>
                      <button 
                        onClick={handleBlock}
                        disabled={actionLoading}
                        className="w-full py-4 bg-red-600 text-white font-black text-md rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_10px_25px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading ? 'PROCESSING...' : 'BLOCK'}
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-[#13ec5b] animate-pulse"></span>
                    Active Now
                  </div>
                </div>

                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.3em] bg-gradient-to-r from-[#13ec5b] to-emerald-400 bg-clip-text text-transparent">
                    Connect Socials
                  </span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <div className="flex justify-center gap-3 mt-4">
                  {[
                    { icon: <Instagram size={18}/>, link: socials.instagram, label: "Instagram" },
                    { icon: <Facebook size={18}/>, link: socials.facebook, label: "Facebook" },
                    { icon: <Ghost size={18}/>, link: socials.snapchat, label: "Snapchat" },
                    { icon: <Github size={18}/>, link: socials.github, label: "Github" }
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => openSocial(item.link)}
                      title={item.label}
                      className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-[#13ec5b] hover:border-[#13ec5b]/50 transition-all duration-300"
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#13ec5b]/5 border border-[#13ec5b]/20 rounded-2xl flex items-center gap-3">
                <span className="material-symbols-outlined text-[#13ec5b]">verified</span>
                <p className="text-[11px] font-bold text-slate-300">Verified Skills & Top Mentor Badge</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreProfile;