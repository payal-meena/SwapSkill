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
import React from 'react';
import UserNavbar from '../common/UserNavbar';

const ExploreNavbar = ({ onSearch }) => {
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
            <button className="flex items-center justify-center p-3.5 bg-[#112217] border border-[#23482f] rounded-2xl text-[#13ec5b] hover:bg-[#13ec5b]/10 hover:border-[#13ec5b]/50 transition-all duration-300 group">
              <span className="material-symbols-outlined text-[22px]">tune</span>
              <span className="hidden lg:inline ml-2 text-[12px] font-bold uppercase tracking-widest">Filters</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExploreNavbar;