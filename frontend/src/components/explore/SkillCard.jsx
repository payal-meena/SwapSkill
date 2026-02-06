import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";
import { chatService } from "../../services/chatService";
import Toast from "../common/Toast";
import { getSkillIcon } from "../../utils/skillIcons";

const SkillCard = ({
  _id,
  name,
  rating,
  reviews,
  img,
  bio,
  requestId,
  offeredSkills = [],
  wantedSkills = [],
  statusColor = "bg-[#13ec5b]",
  connectionStatus = "none",
  onConnect,
  onDisconnect
}) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });
  const [showAllOffered, setShowAllOffered] = useState(false);
  const [showAllWanted, setShowAllWanted] = useState(false);

  const maxSkills = 3;

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  // Function to navigate and pass the data to ExploreProfile
  const handleViewProfile = () => {
    navigate("/explore-profile", {
      state: {
        name,
        img,
        bio,
        rating,
        reviews,
        offeredSkills,
        wantedSkills,
        id: _id
      }
    });
  };

const handleMessage = async () => {
  try {
    if (!requestId) {
      showToast("Pehle connection accept hona chahiye", "error");
      return;
    }

    // Backend se chat ID lekar aao
    const chatData = await chatService.createOrGetChat({
      otherUserId: _id,
      requestId: requestId
    });

    if (chatData && chatData._id) {
      // ✅ Yahan hum redirect kar rahe hain
      navigate("/messages", { 
        state: { activeChatId: chatData._id } 
      });
    }
  } catch (error) {
    console.error("Chat Error:", error);
    showToast("Chat shuru nahi ho saki", "error");
  }
};

  const renderActionButton = () => {
    // Pending - waiting for other user to accept
    if (connectionStatus === "pending") {
      return (
        <button disabled className="py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 text-sm font-bold opacity-70 cursor-not-allowed">
          Pending
        </button>
      );
    }

    // Accepted - show unfollow button
    if (connectionStatus === "accepted") {
      return (
        <button 
          onClick={onDisconnect}
          className="py-2.5 rounded-xl border-2 border-red-600 text-red-600 text-sm font-bold hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          Unfollow
        </button>
      );
    }

    // Not connected - show connect button
    return (
      <button onClick={onConnect} className="py-2.5 rounded-xl bg-[#13ec5b] text-[#112217] text-sm font-bold hover:bg-[#13ec5b]/90 hover:shadow-lg hover:shadow-[#13ec5b]/20 transition-all">
        Connect
      </button>
    );
  };

  return (
    <>
    <div className="group bg-white dark:bg-[#193322] border border-slate-200 dark:border-[#23482f] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#13ec5b]/5 transition-all duration-300 flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col justify-between">
        {/* Profile Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar 
                src={img} 
                name={name} 
                size="w-16 h-16" 
                textSize="text-xl"
                className="border-2 border-[#13ec5b]/20 rounded-2xl" // SkillCard ki styling ke liye rounded-2xl rakha hai
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColor} border-2 border-[#193322] rounded-full`}></span>
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg">{name}</h3>
              <div className="flex items-center text-amber-400 gap-1 mt-0.5">
                <span className="material-symbols-outlined text-sm fill-icon">star</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{rating}</span>
                <span className="text-[10px] text-slate-400">({reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Offered Skills */}
        <div className="mb-5 pb-5 border-b border-slate-100 dark:border-[#23482f]">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#13ec5b] text-lg">school</span>
            <p className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-[#92c9a4] font-bold">Can Teach</p>
          </div>
          {offeredSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {offeredSkills.map((skill, idx) => (
                <div key={idx} className="inline-flex items-center gap-2 bg-[#13ec5b]/5 dark:bg-[#13ec5b]/10 px-3 py-2 rounded-lg border border-[#13ec5b]/30 hover:border-[#13ec5b]/60 transition-all">
                  <span className="text-lg">{getSkillIcon(skill.name)}</span>
                  <span className="text-slate-900 dark:text-white font-semibold text-sm">{skill.name}</span>
                  <span className="bg-[#13ec5b]/40 text-[#13ec5b] dark:text-[#13ec5b] text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">{skill.level || skill.leval}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-[#13ec5b]/5 border border-[#13ec5b]/20 rounded-lg text-center">
              <p className="text-[#13ec5b] text-xs font-bold uppercase tracking-wide">Not Added</p>
            </div>
          )}
        </div>

        {/* Wanted Skills */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#60a5fa] text-lg">lightbulb</span>
            <p className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-blue-300 font-bold">Wants to Learn</p>
          </div>
          {wantedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {wantedSkills.map((skill, idx) => (
                <div key={idx} className="inline-flex items-center gap-2 bg-blue-500/5 dark:bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-300/30 hover:border-blue-300/60 transition-all">
                  <span className="text-lg">{getSkillIcon(typeof skill === 'string' ? skill : skill.name)}</span>
                  <span className="font-medium text-slate-900 dark:text-white text-sm">{typeof skill === 'string' ? skill : skill.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-blue-500/5 border border-blue-300/20 rounded-lg text-center">
              <p className="text-blue-500 text-xs font-bold uppercase tracking-wide">Not Added</p>
            </div>
          )}
        </div>

        {/* Action Buttons - Dono Buttons Green style mein */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={handleViewProfile}
            className="py-2.5 rounded-xl bg-[#13ec5b] text-[#112217] text-sm font-bold hover:bg-[#13ec5b]/90 hover:shadow-lg hover:shadow-[#13ec5b]/20 transition-all text-center"
          >
            View Profile
          </button>
          {renderActionButton()}
        </div>
      </div>
    </div>
    
    {/* Toast Notification */}
    <Toast 
      message={toast.message}
      type={toast.type}
      isVisible={toast.isVisible}
      onClose={hideToast}
    />
    </>
  );
};

export default SkillCard;