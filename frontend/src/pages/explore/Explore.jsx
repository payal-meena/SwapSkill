// import React from 'react';
// import ExploreNavbar from '../../components/explore/ExploreNavbar';
// import SkillCard from '../../components/explore/SkillCard';

// const Explore = () => {
//   const mentors = [
//     {
//       name: "Sarah Jenkins",
//       rating: "4.9",
//       reviews: "128",
//       img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
//       offeredSkill: "Python Development",
//       level: "Advanced",
//       wantedSkill: "Digital Illustration"
//     },
//     {
//       name: "Liam Wilson",
//       rating: "4.7",
//       reviews: "42",
//       img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
//       offeredSkill: "French Language",
//       level: "Native",
//       wantedSkill: "React.js",
//       statusColor: "bg-slate-400"
//     }
//   ];

//   return (
//     <div className="flex-1 flex flex-col overflow-y-auto bg-[#f6f8f6] dark:bg-[#102216] font-['Lexend']">
//       <ExploreNavbar />
      
//       <div className="p-8 max-w-[1200px] mx-auto w-full">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {mentors.map((mentor, index) => (
//             <SkillCard key={index} {...mentor} />
//           ))}
//         </div>

//         <div className="mt-12 flex flex-col items-center gap-4">
//           <button className="px-8 py-3 rounded-xl border border-slate-200 dark:border-[#326744] text-slate-900 dark:text-white font-bold hover:bg-white dark:hover:bg-[#112217] transition-all">
//             Load More Results
//           </button>
//           <p className="text-slate-500 dark:text-[#92c9a4] text-xs">
//             Showing {mentors.length} of 1,248 available skill swaps
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Explore;
// import React, { useState, useEffect } from 'react';
// import ExploreNavbar from '../../components/explore/ExploreNavbar';
// import SkillCard from '../../components/explore/SkillCard';
// import axios from 'axios';

// const Explore = () => {
//   const [mentors, setMentors] = useState([]);
//   const [loading, setLoading] = useState(true); // initially true

//   useEffect(() => {
//     const fetchMentors = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/explore"); // backend route
//         setMentors(res.data);
//       } catch (err) {
//         console.error("Error fetching mentors:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMentors();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-10">Loading mentors...</p>; // simple loading
//   }

//   return (
//     <div className="flex-1 flex flex-col overflow-y-auto bg-[#f6f8f6] dark:bg-[#102216] font-['Lexend']">
//       <ExploreNavbar />
      
//       <div className="p-8 max-w-[1200px] mx-auto w-full">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {mentors.map((mentor) => (
//             <SkillCard key={mentor._id} {...mentor} />
//           ))}
//         </div>

//         <div className="mt-12 flex flex-col items-center gap-4">
//           <button className="px-8 py-3 rounded-xl border border-slate-200 dark:border-[#326744] text-slate-900 dark:text-white font-bold hover:bg-white dark:hover:bg-[#112217] transition-all">
//             Load More Results
//           </button>
//           <p className="text-slate-500 dark:text-[#92c9a4] text-xs">
//             Showing {mentors.length} of 1,248 available skill swaps
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Explore;

import React, { useState, useEffect } from 'react';
import ExploreNavbar from '../../components/explore/ExploreNavbar';
import SkillCard from '../../components/explore/SkillCard';
import axios from 'axios';

const Explore = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/explore");
        setMentors(res.data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#f6f8f6] dark:bg-[#102216] font-['Lexend']">
      <ExploreNavbar />
      
      <div className="p-8 max-w-[1200px] mx-auto w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <SkillCard key={mentor._id || mentor.name} {...mentor} />
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-4">
          <button className="px-8 py-3 rounded-xl border border-slate-200 dark:border-[#326744] text-slate-900 dark:text-white font-bold hover:bg-white dark:hover:bg-[#112217] shadow-sm transition-all active:scale-95">
            Load More Results
          </button>
          <p className="text-slate-500 dark:text-[#92c9a4] text-xs">
            Showing {mentors.length} of 1,248 available skill swaps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Explore;