import React from 'react';
import { Trash2, X } from 'lucide-react';

const DeleteSkillModal = ({ isOpen, onClose, onConfirm, skillName = 'skill' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop with Heavy Blur */}
      <div 
        className="absolute inset-0 bg-[#050a06]/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card - Dark Theme with Red Glow */}
      <div className="relative bg-[#102216] w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-red-500/10 animate-in zoom-in-95 duration-300">
        
        {/* Top Glow Accent (Red) */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

        <div className="p-10 flex flex-col items-center text-center">
          {/* Icon Container */}
          <div className="size-24 rounded-[2rem] bg-red-500/5 flex items-center justify-center mb-8 relative group">
            {/* Pulsing Outer Glow */}
            <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-full animate-pulse" />
            
            <div className="relative z-10 size-16 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <Trash2 size={32} className="text-red-500" />
            </div>
          </div>

          {/* Text Content */}
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-3">
            Delete Skill?
          </h2>
          <p className="text-[#92c9a4] text-[10px] font-black leading-relaxed max-w-[280px] uppercase tracking-[0.2em] opacity-60">
            Are you sure you want to delete "{skillName}"? This action cannot be undone.
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full mt-12">
            <button 
              onClick={onClose}
              className="px-6 py-4 rounded-2xl border border-[#23482f] text-[#92c9a4] font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
            >
              Cancel
            </button>
            
            <button 
              onClick={onConfirm}
              className="px-6 py-4 rounded-2xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 border border-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSkillModal;
