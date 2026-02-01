
import React, { useEffect, useState } from 'react';
import { skillService } from '../../services/skillService';
import Toast from '../common/Toast';

const EditWantedSkillModal = ({ isOpen, onClose, skillData, onSkillUpdated }) => {
  const [formData, setFormData] = useState({
    skillName: '',
    level: '',
    description: ''
  });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  useEffect(() => {
    if (skillData) {
      setFormData({
        skillName: skillData.skillName || skillData.skillName || '',
        level: skillData.level || '',
        description: skillData.description || ''
      });
    }
  }, [skillData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      await skillService.editWantedSkill(skillData._id, formData);
      onSkillUpdated();
      onClose();
      showToast('Wanted skill updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating wanted skill:', err);
      showToast('Failed to update wanted skill', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-[#112217cc] backdrop-blur-xl border border-[#23482f]/50 w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden font-['Lexend']">
        
        {/* Header */}
        <div className="p-6 border-b border-[#23482f]/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#13ec5b]/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#13ec5b]">psychology</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Edit Wanted Skill</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form className="p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* Skill Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#92c9a4]">Skill Name</label>
            <input 
              name="skillName" 
              value={formData.skillName} 
              onChange={handleChange}
              className="w-full bg-[#112217] border border-[#23482f] text-white rounded-xl focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder-slate-600 px-4 py-3 outline-none transition-all"
              placeholder="e.g. Machine Learning"
              type="text"
            />
          </div>

          {/* Proficiency Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#92c9a4]">Target Proficiency Level</label>
            <div className="relative">
              <select 
                name="level" 
                value={formData.level} 
                onChange={handleChange} 
                className="w-full bg-[#112217] border border-[#23482f] text-white rounded-xl focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] px-4 py-3 appearance-none outline-none cursor-pointer transition-all"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#92c9a4]">Learning Goals / Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              className="w-full bg-[#112217] border border-[#23482f] text-white rounded-xl focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder-slate-600 px-4 py-3 outline-none transition-all"
              rows="4"
              placeholder="Why do you want to learn this skill?"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[#23482f] text-white font-semibold rounded-xl hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-br from-[#13ec5b] to-[#0db344] text-[#102216] font-bold rounded-xl shadow-[0_0_15px_rgba(19,236,91,0.3)] hover:shadow-[0_0_25px_rgba(19,236,91,0.5)] transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default EditWantedSkillModal;
