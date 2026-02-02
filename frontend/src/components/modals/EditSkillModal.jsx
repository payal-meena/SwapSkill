import React, { useEffect } from 'react';
import { skillService } from '../../services/skillService';
import Toast from '../common/Toast';

const EditSkillModal = ({ isOpen, onClose, skillData, onSkillUpdated }) => {

  const [formData, setFormData] = React.useState({
    skillName: '',
    level: '',
    description: '',
    category: '',
    experience: ''
  });
  const [toast, setToast] = React.useState({ isVisible: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };
  useEffect(() => {
    console.log('Editing skillData:', skillData);

    if (skillData) {
      setFormData({
        skillName: skillData.skillName || '',
        level: skillData.level || '',
        description: skillData.description || '',
        category: skillData.category || '',
        experience: skillData.experience || ''
      })
    }
  }, [skillData]
  )
  if (!isOpen) return null;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSaveChanges = async () => {
    console.log('Submitting formData:', formData, 'for skill id:', skillData._id);

    try {
      await skillService.editOfferedSkill(skillData._id, formData);
      onSkillUpdated();
      onClose();
      showToast('Skill updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating skill:', error);
      showToast('Failed to update skill. Please try again.', 'error');
    }
  }






  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-[#112217cc] backdrop-blur-xl border border-[#23482f]/50 w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden font-['Lexend']">
        <div className="p-6 border-b border-[#23482f]/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#13ec5b]/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#13ec5b]">edit_note</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Edit Skill</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#92c9a4]">Skill Name</label>
            <input name="skillName" value={formData.skillName} onChange={handleInputChange}

              className="w-full bg-[#112217] border-[#23482f] text-white rounded-xl focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder-slate-600 px-4 py-3 outline-none"
              placeholder="e.g. Python Programming"
              type="text"

            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#92c9a4]">Proficiency Level</label>
            <select name="level" value={formData.level} onChange={handleInputChange} className="w-full bg-[#112217] border-[#23482f] text-white rounded-xl focus:ring-[#13ec5b] focus:border-[#13ec5b] px-4 py-3 appearance-none outline-none">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
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
            <label className="text-sm font-medium text-[#92c9a4]">Experience (years)</label>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              type="text"
              placeholder="e.g. 3"
              className="w-full bg-[#112217] border-[#23482f] text-white rounded-xl focus:ring-[#13ec5b] focus:border-[#13ec5b] px-4 py-3 outline-none"
            />
          </div>



          <div className="space-y-2">
            <label className="text-sm font-medium text-[#92c9a4]">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange}
              className="w-full bg-[#112217] border-[#23482f] text-white rounded-xl focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder-slate-600 px-4 py-3 outline-none"
              rows="4"
              placeholder="Briefly describe your skill..."
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[#23482f] text-white font-semibold rounded-xl hover:bg-white/5 transition-all cursor-pointer"
              type="button"
            >
              Cancel
            </button>
            <button onClick={handleSaveChanges}
              className="flex-1 px-6 py-3 bg-gradient-to-br from-[#13ec5b] to-[#0db344] text-[#102216] font-bold rounded-xl shadow-[0_0_15px_rgba(19,236,91,0.3)] hover:shadow-[0_0_25px_rgba(19,236,91,0.5)] transition-all cursor-pointer"
              type="submit"
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

export default EditSkillModal;