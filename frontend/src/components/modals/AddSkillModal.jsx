import React from 'react';

const AddSkillModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Lexend']">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      <div className="bg-[#112217b3] backdrop-blur-xl border border-[#13ec5b4d] w-full max-w-2xl rounded-3xl p-8 lg:p-10 relative overflow-hidden shadow-[0_0_20px_rgba(19,236,91,0.1)]">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Share your expertise</h3>
            <p className="text-[#92c9a4] text-sm">Fill in the details below to list your skill on the platform.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#92c9a4] block">Skill Category</label>
              <select className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] appearance-none cursor-pointer outline-none">
                <option>Select a category</option>
                <option>Design & Creative</option>
                <option>Development & IT</option>
                <option>Business & Marketing</option>
                <option>Languages</option>
                <option>Music & Arts</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#92c9a4] block">Skill Name</label>
              <input 
                className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder:text-slate-600 outline-none" 
                placeholder="e.g. Figma Prototyping" 
                type="text"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-[#92c9a4] block">Proficiency Level</label>
            <div className="grid grid-cols-3 gap-4">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <label key={level} className="relative cursor-pointer group">
                  <input className="peer sr-only" name="proficiency" type="radio" value={level.toLowerCase()} />
                  <div className="p-3 text-center border border-[#23482f] rounded-xl text-sm font-medium text-slate-400 peer-checked:bg-[#13ec5b33] peer-checked:border-[#13ec5b] peer-checked:text-[#13ec5b] transition-all">
                    {level}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#92c9a4] block">Years of Experience</label>
            <input 
              className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] outline-none" 
              min="0" 
              placeholder="0" 
              type="number"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#92c9a4] block">Description</label>
            <textarea 
              className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder:text-slate-600 resize-none outline-none" 
              placeholder="Briefly describe what you can teach and your teaching style..." 
              rows="4"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-[#23482f]">
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-[#92c9a4] block">Skills to Exchange</label>
              <p className="text-xs text-slate-500 mb-2">What would you like to learn in return for teaching this skill?</p>
              <input 
                className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder:text-slate-600 outline-none" 
                placeholder="e.g. Python, Piano, Public Speaking..." 
                type="text"
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              className="w-full py-4 bg-gradient-to-r from-[#13ec5b] to-[#0fbd48] text-[#102216] font-bold text-lg rounded-2xl shadow-lg shadow-[#13ec5b33] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer" 
              type="submit"
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              Publish Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;