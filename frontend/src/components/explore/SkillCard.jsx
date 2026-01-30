import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SkillCard = ({
  _id,
  name,
  rating,
  reviews,
  img,
  offeredSkills = [],
  wantedSkills = [],
  statusColor = "bg-[#13ec5b]",
  connectionStatus = "none", // Explore page se aa raha hai
  onConnect // Parent ka function
}) => {
  const navigate = useNavigate();
  const [showAllOffered, setShowAllOffered] = useState(false);
  const [showAllWanted, setShowAllWanted] = useState(false);

  const maxSkills = 3;

  const renderActionButton = () => {
    if (connectionStatus === "pending") {
      return (
        <button disabled className="py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 text-sm font-bold opacity-70 cursor-not-allowed">
          Pending
        </button>
      );
    }
    
    if (connectionStatus === "accepted") {
      return (
      <button 
          onClick={() => navigate("/messages/:userId", {state: { 
            userName: name,
            userImage: img 
          }})}  

          className="py-2.5 rounded-xl border-2 border-[#13ec5b] text-[#13ec5b] dark:text-[#13ec5b] text-sm font-bold hover:bg-[#13ec5b] hover:text-[#112217] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">chat_bubble</span>
          Message
        </button>
      );
    }

    return (
      <button onClick={onConnect} className="py-2.5 rounded-xl bg-[#13ec5b] text-[#112217] text-sm font-bold hover:bg-[#13ec5b]/90 hover:shadow-lg hover:shadow-[#13ec5b]/20 transition-all">
        Connect
      </button>
    );
  };

  return (
    /* h-full ko h-fit se replace kiya hai taaki extra space na le */
    <div className="group bg-white dark:bg-[#193322] border border-slate-200 dark:border-[#23482f] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#13ec5b]/5 transition-all duration-300 flex flex-col h-fit">
      <div className="p-6 flex-1 flex flex-col">
        {/* Profile Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                alt={name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#13ec5b]/20"
                src={img}
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColor} border-2 border-[#193322] rounded-full`}
              ></span>
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
          <button className="text-slate-400 hover:text-[#13ec5b] transition-colors">
            <span className="material-symbols-outlined">bookmark</span>
          </button>
        </div>

        {/* Offered Skills */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#92c9a4] font-bold mb-2">
            Can Teach
          </p>
          <div className={`flex flex-wrap gap-2 transition-all ${showAllOffered ? "" : "max-h-[90px] overflow-hidden"}`}>
            {offeredSkills.map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-[#102216]/50 p-2 rounded-xl border border-slate-100 dark:border-[#23482f]">
                <span className="text-slate-900 dark:text-white font-semibold mr-2">{skill.name}</span>
                <span className="bg-[#13ec5b]/20 text-[#13ec5b] text-[10px] font-bold px-2 py-1 rounded">
                  {skill.level || skill.leval}
                </span>
              </div>
            ))}
          </div>
          {offeredSkills.length > maxSkills && (
            <button onClick={() => setShowAllOffered(!showAllOffered)} className="text-xs text-[#13ec5b] mt-1 hover:underline">
              {showAllOffered ? "See Less" : "See More"}
            </button>
          )}
        </div>

        {/* Wanted Skills */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#92c9a4] font-bold mb-2">
            Wants to Learn
          </p>
          <div className={`flex flex-wrap gap-2 transition-all ${showAllWanted ? "" : "max-h-[90px] overflow-hidden"}`}>
            {wantedSkills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-xl border border-blue-100/50 dark:border-blue-900/30">
                <span className="material-symbols-outlined text-[#13ec5b] text-lg">search</span>
                <span className="font-medium text-slate-900 dark:text-white text-sm">{skill.name} ({skill.level || skill.leval})</span>
              </div>
            ))}
          </div>
          {wantedSkills.length > maxSkills && (
            <button onClick={() => setShowAllWanted(!showAllWanted)} className="text-xs text-[#13ec5b] mt-1 hover:underline">
              {showAllWanted ? "See Less" : "See More"}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => navigate("/explore-profile")}
            className="py-2.5 rounded-xl bg-[#13ec5b] text-[#112217] text-sm font-bold hover:bg-[#13ec5b]/90 hover:shadow-lg hover:shadow-[#13ec5b]/20 transition-all text-center"
          >
            View Profile
          </button>
          {renderActionButton()}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;