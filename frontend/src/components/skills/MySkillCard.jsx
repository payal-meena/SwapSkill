import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Zap, Search } from 'lucide-react';
import { getSkillIcon } from '../../utils/skillIcons';

const MySkillCard = ({ title, level, icon, detail, status, isSearching, isOffer = true, onEdit, onViewCurriculum, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className={`group bg-white dark:bg-[#193322] border ${isOffer ? 'border-slate-200 dark:border-[#23482f]' : 'border-dashed border-slate-200 dark:border-[#23482f]'} rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#13ec5b]/10 transition-all font-['Lexend']`}>
      
      {/* Header with Icon */}
      <div className={`bg-gradient-to-r from-[#13ec5b]/10 to-[#13ec5b]/0 p-6 border-b border-slate-100 dark:border-[#23482f] flex justify-between items-start`}>
        <div className="flex items-center gap-4">
          <div className="bg-[#13ec5b]/15 p-3 rounded-xl group-hover:scale-110 transition-transform">
            <span className="text-3xl">{getSkillIcon(title)}</span>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-black text-lg leading-tight">{title}</h4>
            <p className="text-xs font-bold uppercase tracking-widest mt-1.5 text-[#13ec5b]">
              {isOffer ? 'Teaching' : 'Learning'}
            </p>
          </div>
        </div>
        
        {/* Action Buttons - Hidden by Default */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onEdit}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-[#112217] rounded-lg text-slate-600 dark:text-slate-400 hover:text-[#13ec5b] transition-colors"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-5">
        
        {/* Experience Highlight */}
        {detail && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 bg-[#13ec5b]/15 border-[#13ec5b]/40 text-[#13ec5b] font-bold">
            <Zap size={18} />
            <span className="text-sm font-bold">{detail}</span>
          </div>
        )}

        {/* Level Badge */}
        <div className="flex items-center gap-3">
          <span className="inline-flex px-3.5 py-1.5 rounded-full text-[12px] font-black uppercase tracking-wider bg-[#13ec5b]/20 text-[#13ec5b]">
            {level || 'Beginner'}
          </span>
          {isOffer && (
            <span className={`inline-flex px-3 py-1.5 rounded-full text-[11px] font-bold ${
              status === 'Active' 
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                : status === 'Paused'
                ? 'bg-slate-400/20 text-slate-700 dark:text-slate-400'
                : 'bg-slate-200/50 text-slate-600'
            }`}>
              {status === 'Active' && '🟢'} {status}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button 
          onClick={isOffer ? onViewCurriculum : () => navigate('/explore')}
          className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border bg-[#13ec5b]/15 text-[#13ec5b] border-[#13ec5b]/40 hover:bg-[#13ec5b]/25 hover:border-[#13ec5b]/60"
        >
          <Search size={16} />
          {isOffer ? 'View Curriculum' : 'Search for partners'}
        </button>
      </div>
    </div>
  );
};

export default MySkillCard;