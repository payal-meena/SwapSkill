import React from 'react';
import { useLocation } from 'react-router-dom';
import { Instagram, Facebook, Github, Ghost } from 'lucide-react';

const ExploreProfile = () => {
  const location = useLocation();
  
  // Destructuring data from SkillCard state
  const { 
    name = "Sarah Jenkins", 
    img = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200", 
    rating = 4.9, 
    reviews = 128, 
    offeredSkills = [], 
    wantedSkills = [],
    // Agar card se socials aa rahe hain toh use karein, nahi toh defaults
    socials = {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      github: "https://github.com",
      snapchat: "https://snapchat.com"
    }
  } = location.state || {};

  const openSocial = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020a06] flex items-center justify-center text-[#22c55e] font-black italic">
      LOADING PROFILE...
    </div>
  );

  if (!profileData) return (
    <div className="min-h-screen bg-[#020a06] flex items-center justify-center text-red-500 font-black">
      USER NOT FOUND!
    </div>
  );

  return (
    <div className="min-h-screen bg-[#112217] text-white p-4 md:p-8 font-['Lexend'] flex flex-col items-center">

      {/* Back Button Container */}
      <div className="w-full max-w-3xl mb-4">
        <button
          onClick={() => window.history.back()}
          className="text-[#13ec5b] hover:brightness-125 flex items-center gap-2 transition-all font-black text-sm uppercase tracking-widest"
        >
          <span className="text-xl">←</span> Back
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="w-full max-w-3xl bg-[#0a1a11] rounded-[2rem] border-2 border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

        {/* Banner Section */}
        <div className="relative h-40 bg-gradient-to-r from-[#052e16] via-[#13ec5b]/60 to-[#064e3b]">
          <div className="absolute -bottom-14 left-8 md:left-12 p-1 bg-[#0a1a11] rounded-full shadow-2xl">
            <img
              src={img}
              alt={name}
              className="w-28 h-28 rounded-full border-2 border-[#13ec5b] object-cover"
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
                    {offeredSkills.length > 0 ? offeredSkills.map((skill, index) => (
                      <div key={index} className="px-4 py-2 bg-white/5 border border-[#13ec5b]/30 rounded-xl flex items-center gap-3">
                        <span className="font-bold text-white text-md">{skill.name}</span>
                        <span className="text-[9px] font-black bg-[#13ec5b] text-[#05160e] px-1.5 py-0.5 rounded uppercase">
                          {skill.level || skill.leval}
                        </span>
                      </div>
                    )) : <p className="text-slate-500 text-sm">No skills listed</p>}
                  </div>
                </div>

                <div className="group">
                  <div className="inline-flex items-center gap-2 mb-4 bg-amber-500 px-4 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-[18px] text-[#05160e] font-black">bolt</span>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-[#05160e]">I Want To Learn</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {wantedSkills.length > 0 ? wantedSkills.map((skill, index) => (
                      <div key={index} className="px-4 py-2 bg-white/5 border border-amber-500/30 rounded-xl text-amber-400 font-bold text-md">
                        {skill.name || skill}
                      </div>
                    )) : <p className="text-slate-500 text-sm">No skills listed</p>}
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
                  <button className="w-full py-4 bg-[#13ec5b] text-[#05160e] font-black text-md rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_10px_25px_rgba(19,236,91,0.3)]">
                    CONNECT NOW
                  </button>
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

                {/* Updated Dynamic Socials */}
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