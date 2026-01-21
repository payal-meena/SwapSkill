import React from 'react';
import ExploreNavbar from '../../components/explore/ExploreNavbar';
import SkillCard from '../../components/explore/SkillCard';

const Explore = () => {
  const mentors = [
    {
      name: "Sarah Jenkins",
      rating: "4.9",
      reviews: "128",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      offeredSkill: "Python Development",
      level: "Advanced",
      wantedSkill: "Digital Illustration"
    },
    {
      name: "Liam Wilson",
      rating: "4.7",
      reviews: "42",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
      offeredSkill: "French Language",
      level: "Native",
      wantedSkill: "React.js",
      statusColor: "bg-slate-400"
    }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#f6f8f6] dark:bg-[#102216] font-['Lexend']">
      <ExploreNavbar />
      
      <div className="p-8 max-w-[1200px] mx-auto w-full">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor, index) => (
            <SkillCard key={index} {...mentor} />
          ))}
        </div>

        {/* Footer/Load More */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <button className="px-8 py-3 rounded-xl border border-slate-200 dark:border-[#326744] text-slate-900 dark:text-white font-bold hover:bg-white dark:hover:bg-[#112217] transition-all">
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