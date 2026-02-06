import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { skillService } from '../../services/skillService';
import { requestService } from '../../services/requestService';
import { blockService } from '../../services/blockService';
import { SocketContext } from '../../context/SocketContext';
import { Instagram, Facebook, Github, Ghost, ArrowLeft, ShieldAlert } from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';
import { getSkillIcon } from '../../utils/skillIcons';

const ExploreProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
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
  const profileData = location.state;

  const [offeredSkillsState, setOfferedSkillsState] = useState(profileData?.offeredSkills || []);
  const [wantedSkillsState, setWantedSkillsState] = useState(profileData?.wantedSkills || []);
  const [requestStatus, setRequestStatus] = useState('none'); 
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });
  
  // State for the Block Confirmation Modal
  const [showBlockModal, setShowBlockModal] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const socketCtx = useContext(SocketContext);

  useEffect(() => {
    const fetchIfNeeded = async () => {
      try {
        if ((offeredSkillsState.length === 0 && wantedSkillsState.length === 0) && profileData?.id) {
          const res = await skillService.getUserSkills(profileData.id);
          const offered = res?.offered || res?.skills || res?.offeredSkills || [];
          const wanted = res?.wanted || res?.wantedSkills || [];
          setOfferedSkillsState(offered);
          setWantedSkillsState(wanted);
        }

        if (currentUserId && profileData?.id && currentUserId !== profileData.id) {
          try {
            const requestRes = await requestService.getMyRequests();
            const myRequests = requestRes.requests || [];
            const foundRequest = myRequests.find(req => 
              (req.receiver?._id === profileData.id || req.requester?._id === profileData.id) &&
              req.status !== 'cancelled'
            );
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
      if (data.blockedBy === profileData?.id) {
        showToast('Oh no — this user blocked you 💔', 'error');
        setTimeout(() => navigate('/explore'), 900);
      }
    };

    const handleUserUnblockedMe = (data) => {
      if (data.unblockedBy === profileData?.id) {
        showToast('Nice — this user unblocked you 😊', 'success');
      }
    };

    socketCtx.on('requestUpdated', handleRequestUpdated);
    socketCtx.on('userBlockedMe', handleUserBlockedMe);
    socketCtx.on('userUnblockedMe', handleUserUnblockedMe);

    return () => {
      socketCtx.off('requestUpdated', handleRequestUpdated);
      socketCtx.off('userBlockedMe', handleUserBlockedMe);
      socketCtx.off('userUnblockedMe', handleUserUnblockedMe);
    };
  }, [socketCtx, profileData?.id, currentUserId]);

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

  const { 
    name = "Sarah Jenkins", 
    img = null, 
    bio = "No bio available",
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
      window.history.replaceState({ ...location.state, requestStatus: 'pending' }, '');
    } catch (error) {
      showToast('Failed to send request', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setActionLoading(true);
    try {
      const requestRes = await requestService.getMyRequests();
      const myRequests = requestRes.requests || [];
      const foundRequest = myRequests.find(req => 
        (req.receiver?._id === profileData.id || req.requester?._id === profileData.id) &&
        req.status !== 'cancelled'
      );
      
      if (!foundRequest) {
        setRequestStatus('none');
        return;
      }

      if (foundRequest.status === 'pending') {
        await requestService.withdrawRequest(foundRequest._id);
      } else if (foundRequest.status === 'accepted') {
        await requestService.unfriendUser(foundRequest._id);
      }
      
      setRequestStatus('none');
      window.history.replaceState({ ...location.state, requestStatus: 'none' }, '');
    } catch (error) {
      showToast('Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockConfirm = async () => {
    setActionLoading(true);
    setShowBlockModal(false);
    try {
      await blockService.blockUser(profileData.id);
      showToast('User blocked successfully 🔒', 'success');
      setTimeout(() => navigate('/explore'), 800);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to block user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#112217] text-white p-4 md:p-8 font-['Lexend'] flex flex-col items-center relative">

      {/* Block Confirmation Modal Overlay */}
      {showBlockModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a1a11] border-2 border-red-500/20 w-full max-w-xs p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Block User?</h3>
            <p className="text-slate-400 text-sm font-medium mb-6">You won't see their profile or skills anymore.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowBlockModal(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleBlockConfirm}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-black uppercase transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button - Fixed Position */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-80 z-50 text-[#13ec5b] hover:brightness-125 flex items-center gap-2 transition-all font-black text-sm uppercase tracking-widest bg-[#0a1a11]/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#13ec5b]/20"
      >
        <ArrowLeft size={18} /> Back
      </button>

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

              <div className="bg-gradient-to-br from-white/[0.05] to-transparent p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#13ec5b]"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-[#13ec5b]">Mentor Bio</h3>
                <p className="text-slate-200 leading-snug text-lg font-medium italic">
                  {bio || "No bio available"}
                </p>
              </div>

              <div className="space-y-8">
                <div className="group">
                  <div className="inline-flex items-center gap-2 mb-4 bg-[#13ec5b] px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(19,236,91,0.3)]">
                    <span className="material-symbols-outlined text-[18px] text-[#05160e] font-black">school</span>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-[#05160e]">I Can Teach</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {offeredSkillsState.length > 0 ? offeredSkillsState.map((skill, index) => (
                      <div key={index} className="px-4 py-2 bg-white/5 border border-[#13ec5b]/30 rounded-xl flex items-center gap-3">
                        <span className="text-lg">{getSkillIcon(skill.name || skill.skillName || skill.title)}</span>
                        <span className="font-bold text-white text-md">{skill.name || skill.skillName || skill.title}</span>
                        <span className="text-[9px] font-black bg-[#13ec5b] text-[#05160e] px-1.5 py-0.5 rounded uppercase">
                          {skill.level || skill.leval || skill.levelName}
                        </span>
                      </div>
                    )) : <div className="p-3 bg-[#13ec5b]/10 border-2 border-[#13ec5b]/30 rounded-xl"><p className="text-[#13ec5b] text-sm font-bold uppercase tracking-wide">Not Added Yet</p></div>}
                  </div>
                </div>

                <div className="group">
                  <div className="inline-flex items-center gap-2 mb-4 bg-amber-500 px-4 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-[18px] text-[#05160e] font-black">bolt</span>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-[#05160e]">I Want To Learn</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {wantedSkillsState.length > 0 ? wantedSkillsState.map((skill, index) => (
                      <div key={index} className="px-4 py-2 bg-white/5 border border-amber-500/30 rounded-xl flex items-center gap-3">
                        <span className="text-lg">{getSkillIcon(typeof skill === 'string' ? skill : (skill.name || skill.skillName || skill.title))}</span>
                        <span className="text-amber-400 font-bold text-md">{typeof skill === 'string' ? skill : (skill.name || skill.skillName || skill.title)}</span>
                      </div>
                    )) : <div className="p-3 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl"><p className="text-amber-400 text-sm font-bold uppercase tracking-wide">Not Added Yet</p></div>}
                  </div>
                </div>
              </div>
            </div>

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
                      className="w-full py-4 border-2 border-white/20 text-slate-400 font-black text-md rounded-2xl cursor-not-allowed uppercase tracking-widest bg-white/5"
                    >
                      PENDING
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
                        onClick={() => setShowBlockModal(true)}
                        disabled={actionLoading}
                        className="w-full py-4 bg-red-600 text-white font-black text-md rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_10px_25px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        BLOCK
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
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default ExploreProfile;