import React from 'react';

const FilterBar = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: 'all', label: 'All Skills', icon: 'grid_view' },
    { id: 'dev', label: 'Development', icon: 'code' },
    { id: 'design', label: 'Design', icon: 'brush' },
    { id: 'lang', label: 'Languages', icon: 'translate' },
    { id: 'music', label: 'Music', icon: 'music_note' },
    { id: 'business', label: 'Business', icon: 'trending_up' },
  ];

  return (
    <div className="w-full flex flex-col gap-6 mb-10">
      {/* Search and Main Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13ec5b] transition-colors">
            search
          </span>
          <input 
            type="text"
            placeholder="Search skills, users, or keywords..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#23482f] text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] transition-all outline-none"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#23482f] text-sm font-bold text-slate-600 dark:text-[#92c9a4] hover:border-[#13ec5b] hover:text-[#13ec5b] transition-all cursor-pointer">
            <span className="material-symbols-outlined text-lg">tune</span>
            Advanced
          </button>
          <button className="flex-1 md:flex-none bg-[#13ec5b] text-[#102216] px-8 py-3 rounded-2xl font-bold text-sm hover:shadow-[0_0_15px_rgba(19,236,91,0.4)] transition-all cursor-pointer">
            Search
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#13ec5b] border-[#13ec5b] text-[#102216] shadow-[0_0_10px_rgba(19,236,91,0.2)]'
                : 'bg-white dark:bg-[#112217] border-slate-200 dark:border-[#23482f] text-slate-500 dark:text-[#92c9a4] hover:border-[#13ec5b] hover:text-[#13ec5b]'
            }`}
          >
            <span className="material-symbols-outlined text-base">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;