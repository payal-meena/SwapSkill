import React from 'react';

const ExploreProfile = () => {
  const profileData = {
    name: "Sarah Jenkins",
    rating: 4.9,
    reviews: 128,
    location: "London, UK",
    bio: "Senior Software Engineer with 5+ years of experience in Backend Development. Passionate about teaching Python and learning creative arts.",
    offeredSkills: [
      { name: "Python Development", level: "Advanced" },
      { name: "Django", level: "Intermediate" },
      { name: "PostgreSQL", level: "Advanced" }
    ],
    wantedSkills: ["Digital Illustration", "UI/UX Design"],
    activeMentors: 1248
  };

  return (
    <div className="min-h-screen bg-[#020a06] text-white p-4 md:p-8 font-sans flex flex-col items-center">
      
      {/* Back Button Container */}
      <div className="w-full max-w-3xl mb-4">
        <button 
          onClick={() => window.history.back()} 
          className="text-[#22c55e] hover:brightness-125 flex items-center gap-2 transition-all font-black text-sm uppercase tracking-widest"
        >
          <span className="text-xl">←</span> Back
        </button>
      </div>

      {/* Main Profile Card - Width reduced for a more compact feel */}
      <div className="w-full max-w-3xl bg-[#0a1a11] rounded-[2rem] border-2 border-white/5 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Banner Section - More vibrant gradient */}
        <div className="relative h-40 bg-gradient-to-r from-[#052e16] via-[#22c55e] to-[#064e3b]">
          <div className="absolute -bottom-14 left-8 md:left-12 p-1 bg-[#0a1a11] rounded-full shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200" 
              alt="Profile" 
              className="w-28 h-28 rounded-full border-2 border-[#22c55e] object-cover"
            />
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#22c55e] border-4 border-[#0a1a11] rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 md:px-10 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Side: Info & Skills */}
            <div className="md:col-span-7 space-y-8">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-1 text-white">{profileData.name}</h1>
                <div className="flex items-center gap-3 text-gray-400 font-bold text-sm">
                  <span className="text-amber-400 flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded-md">
                    ★ {profileData.rating}
                  </span>
                  <span>•</span>
                  <span>{profileData.location}</span>
                </div>
              </div>

              {/* BIO BOX - More Highlighted */}
              <div className="bg-gradient-to-br from-white/[0.07] to-transparent p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#22c55e]"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-[#22c55e]">Profile Bio</h3>
                <p className="text-gray-200 leading-snug text-lg font-medium">
                  "{profileData.bio}"
                </p>
              </div>

              {/* SKILLS SECTION - HIGH CONTRAST */}
              <div className="space-y-8">
                {/* Teaching Skills */}
                <div className="group">
                  <div className="inline-flex items-center gap-2 mb-4 bg-[#22c55e] px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <span className="material-symbols-outlined text-[18px] text-[#05160e] font-black">school</span>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-[#05160e]">I Can Teach</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.offeredSkills.map((skill, index) => (
                      <div key={index} className="px-4 py-2 bg-white/5 border border-[#22c55e]/30 rounded-xl flex items-center gap-3 hover:bg-[#22c55e]/10 transition-colors">
                        <span className="font-bold text-white text-md">{skill.name}</span>
                        <span className="text-[9px] font-black bg-[#22c55e] text-[#05160e] px-1.5 py-0.5 rounded uppercase">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Skills */}
                <div className="group">
                  <div className="inline-flex items-center gap-2 mb-4 bg-amber-500 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <span className="material-symbols-outlined text-[18px] text-[#05160e] font-black">bolt</span>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-[#05160e]">I Want To Learn</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.wantedSkills.map((skill, index) => (
                      <div key={index} className="px-4 py-2 bg-white/5 border border-amber-500/30 rounded-xl text-amber-400 font-bold text-md hover:bg-amber-500/10 transition-colors">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Action Cards */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-3xl font-black text-[#22c55e]">100%</p>
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">Response</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-3xl font-black text-white">1.2k</p>
                  <p className="text-[9px] text-gray-500 uppercase font-black tracking-tighter">Swaps</p>
                </div>
              </div>

              {/* ACTION AREA */}
              <div className="bg-gradient-to-b from-white/10 to-transparent p-5 rounded-[2rem] border border-white/10">
                <button className="w-full py-3.5 bg-[#22c55e] text-[#05160e] font-black text-md rounded-xl hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_10px_20px_rgba(34,197,94,0.2)]">
                  CONNECT NOW
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping"></span>
                  Active Now
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-4 bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-2xl flex items-center gap-3">
                <span className="material-symbols-outlined text-[#22c55e]">verified</span>
                <p className="text-[11px] font-bold text-gray-300">Verified Skills & Top Response Rate</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreProfile;