import React, { useState } from 'react';
import { skillService } from '../../services/skillService';

const AddSkillModal = ({ isOpen, onClose, onSkillAdded }) => {
  const [formData, setFormData] = useState({
    skillName: '',
    category: '',
    level: '',
    experience: '',
    type: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.skillName || !formData.category || !formData.level) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await skillService.addSkill(formData);
      
      // Reset form
      setFormData({
        skillName: '',
        category: '',
        level: '',
        experience: '',
        type: '',
        description: ''
      });
      
      onSkillAdded();
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Failed to add skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-['Lexend']">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="
        bg-[#112217]/95 backdrop-blur-xl border border-[#13ec5b4d] 
        w-full max-w-2xl 
        rounded-3xl 
        relative 
        flex flex-col
        max-h-[90dvh] /* Responsive height based on dynamic viewport */
        shadow-[0_0_50px_rgba(19,236,91,0.2)]
        animate-in fade-in zoom-in duration-200
      ">
        
        {/* Header - Fixed at Top */}
        <div className="p-6 md:p-8 pb-4 flex justify-between items-start z-10">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Share your expertise</h3>
            <p className="text-[#92c9a4] text-xs md:text-sm">Fill in the details below to list your skill.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 text-slate-400 hover:text-white transition-all cursor-pointer rounded-full hover:bg-white/10 flex items-center justify-center"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Form Body - Scrollbar Hidden */}
        <div className="
          flex-1 overflow-y-auto px-6 md:px-10 pb-6 
          scrollbar-hide 
          /* Support for hiding scrollbars across browsers */
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        ">
          <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Skill Category</label>
                <div className="relative">
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] appearance-none cursor-pointer outline-none transition-all"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Development & IT">Development & IT</option>
                    <option value="Business & Marketing">Business & Marketing</option>
                    <option value="Languages">Languages</option>
                    <option value="Music & Arts">Music & Arts</option>
                    <option value="Education">Education</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Skill Name</label>
                <input 
                  name="skillName"
                  value={formData.skillName}
                  onChange={handleInputChange}
                  className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder:text-slate-600 outline-none transition-all" 
                  placeholder="e.g. Figma Prototyping" 
                  type="text"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Proficiency Level</label>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <label key={level} className="relative cursor-pointer group">
                    <input 
                      className="peer sr-only" 
                      name="level" 
                      type="radio" 
                      value={level}
                      checked={formData.level === level}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="py-2.5 text-center border border-[#23482f] rounded-xl text-[10px] sm:text-xs md:text-sm font-medium text-slate-400 peer-checked:bg-[#13ec5b22] peer-checked:border-[#13ec5b] peer-checked:text-[#13ec5b] hover:border-[#13ec5b88] transition-all">
                      {level}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Years of Experience</label>
                <input 
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] outline-none transition-all" 
                  min="0" 
                  placeholder="0" 
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Skills to Exchange</label>
                <input 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder:text-slate-600 outline-none transition-all" 
                  placeholder="e.g. Python, Piano..." 
                  type="text"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder:text-slate-600 resize-none outline-none transition-all" 
                placeholder="Briefly describe what you can teach..." 
                rows="3"
              ></textarea>
            </div>

            {/* Footer Action - Inside scroll area but separated */}
            <div className="pt-4">
              <button 
                className="w-full py-4 bg-gradient-to-r from-[#13ec5b] to-[#0fbd48] text-[#102216] font-bold text-base md:text-lg rounded-2xl shadow-lg shadow-[#13ec5b33] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#102216]"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">rocket_launch</span>
                    Publish Skill
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default AddSkillModal;