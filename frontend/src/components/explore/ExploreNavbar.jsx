// import React from 'react';
// import UserNavbar from '../common/UserNavbar';
// const ExploreNavbar = ({ onSearch }) => {
//   return (
//     <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#23482f] px-8 py-6">
//         <UserNavbar />
//       <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">Discover Skills</h2>
         
//         </div>

//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="relative flex-1 group">
//             <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#92c9a4] group-focus-within:text-[#13ec5b] transition-colors">search</span>
//             <input 
//               onChange={(e) => onSearch(e.target.value)} // Search trigger on change
//               className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none bg-slate-100 dark:bg-[#112217] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#92c9a4] text-base focus:ring-2 focus:ring-[#13ec5b]/50 transition-all shadow-inner outline-none" 
//               placeholder="Search for skills, users, or topics..." 
//               type="text" 
//             />
//           </div>
//           <button className="md:hidden flex items-center justify-center p-3.5 bg-slate-100 dark:bg-[#112217] rounded-2xl text-slate-600 dark:text-white">
//             <span className="material-symbols-outlined">tune</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExploreNavbar;
import React, { useState } from 'react';
import UserNavbar from '../common/UserNavbar';

const ExploreNavbar = ({ onSearch, onFilter }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    experience: '',
    skills: []
  });

  const experienceLevels = [
    { value: '0-1', label: '0-1 years' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5+', label: '5+ years' }
  ];

  const skillOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++',
    'HTML/CSS', 'MongoDB', 'SQL', 'Git', 'Docker', 'AWS'
  ];

  const handleSkillToggle = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const applyFilters = () => {
    onFilter && onFilter(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ experience: '', skills: [] });
    onFilter && onFilter({ experience: '', skills: [] });
  };
  return (
    <div className="sticky top-0 z-20 w-full bg-[#102216]/95 backdrop-blur-xl border-b border-[#23482f]/50 shadow-2xl">
      {/* Main App Navbar */}
      

      {/* Sub-Header Section */}
      <div className="max-w-[1300px] mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* LEFT: Title (Discover Skills) */}
          <div className="shrink-0">
            <h2 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight">
              Discover <span className="text-[#13ec5b]">Skills</span>
            </h2>
            <p className="text-[#92c9a4] text-[12px] font-medium hidden md:block">
              Find mentors or learning partners.
            </p>
          </div>

          {/* RIGHT: Search Bar & Filters (Side by Side) */}
          <div className="flex flex-1 items-center gap-3 max-w-[800px]">
            <div className="relative flex-1 group">
              {/* Search Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <span className="material-symbols-outlined text-[#92c9a4] group-focus-within:text-[#13ec5b] transition-colors duration-300">
                  search
                </span>
              </div>

              {/* Input Field */}
              <input 
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-[#112217] text-white placeholder:text-[#92c9a4]/40 text-sm border border-[#23482f] focus:border-[#13ec5b]/50 focus:ring-4 focus:ring-[#13ec5b]/5 transition-all duration-300 outline-none shadow-lg" 
                placeholder="Search for skills, users, or topics..." 
                type="text" 
              />
            </div>

            {/* Filter Button */}
            <button 
              onClick={() => setShowFilters(true)}
              className="flex items-center justify-center p-3.5 bg-[#112217] border border-[#23482f] rounded-2xl text-[#13ec5b] hover:bg-[#13ec5b]/10 hover:border-[#13ec5b]/50 transition-all duration-300 group"
            >
              <span className="material-symbols-outlined text-[22px]">tune</span>
              <span className="hidden lg:inline ml-2 text-[12px] font-bold uppercase tracking-widest">Filters</span>
            </button>
          </div>

        </div>
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4 pt-20">
          <div className="bg-[#112217] border border-[#23482f] rounded-2xl p-6 w-full max-w-sm mr-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-bold">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-[#92c9a4] hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Experience Filter */}
            <div className="mb-6">
              <label className="block text-[#13ec5b] text-sm font-bold mb-3">Experience Level</label>
              <div className="space-y-2">
                {experienceLevels.map((level) => (
                  <label key={level.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="experience"
                      value={level.value}
                      checked={filters.experience === level.value}
                      onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                      className="mr-3 accent-[#13ec5b]"
                    />
                    <span className="text-white text-sm">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills Filter */}
            <div className="mb-6">
              <label className="block text-[#13ec5b] text-sm font-bold mb-3">Skills</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {skillOptions.map((skill) => (
                  <label key={skill} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.skills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="mr-2 accent-[#13ec5b]"
                    />
                    <span className="text-white text-xs">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-2 px-4 bg-[#23482f] text-[#92c9a4] rounded-lg hover:bg-[#2a5436] transition-colors"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-2 px-4 bg-[#13ec5b] text-black rounded-lg hover:bg-[#11d951] transition-colors font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreNavbar;