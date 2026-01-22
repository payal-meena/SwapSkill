import React, { useState } from 'react';
import { Search, X, CheckCircle2, PlusCircle } from 'lucide-react'; // Icons for the modal
import UserNavbar from '../../components/common/UserNavbar'; 
import MySkillCard from '../../components/skills/MySkillCard'; 
import EditSkillModal from '../../components/modals/EditSkillModal'; 
import AddSkillModal from '../../components/modals/AddSkillModal'; 
import CurriculumModal from '../../components/modals/CurriculumModal';
import EditCurriculumModal from '../../components/modals/EditCurriculumModal';

const MySkills = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  
  const [isEditCurriculumOpen, setIsEditCurriculumOpen] = useState(false);
  const [activeSkillTitle, setActiveSkillTitle] = useState("");
  const [isWantedModalOpen, setIsWantedModalOpen] = useState(false); // New state for Wanted Skill Modal
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [targetProficiency, setTargetProficiency] = useState('beginner');

  const offeredSkills = [
    { title: "UI/UX Design", level: "Advanced", icon: "brush", detail: "12 students taught", status: "Active", description: "Specialized in design systems and user research." },
    { title: "React Development", level: "Intermediate", icon: "code", detail: "5 students taught", status: "Active", description: "Experienced in building scalable front-end applications." },
    { title: "Spanish Language", level: "Advanced", icon: "translate", detail: "Native Speaker", status: "Paused", description: "Native speaker from Madrid." },
  ];

  const wantedSkills = [
    { title: "Python Programming", level: "Beginner", icon: "data_object", detail: "3 active matches", status: "Searching for partners" },
    { title: "Piano", level: "Beginner", icon: "piano", detail: "0 matches", status: "Pending verification" },
  ];

  const handleEditClick = (skill) => {
    setSelectedSkill(skill);
    setIsEditModalOpen(true);
  };

  const handleViewCurriculum = (title) => {
    setActiveSkillTitle(title);
    setIsCurriculumOpen(true);
  };

  const handleOpenEditCurriculum = () => {
    setIsCurriculumOpen(false); // Pehle purana band karo
    setIsEditCurriculumOpen(true); // Naya kholo
  };

  return (
    <div className="flex h-screen overflow-hidden font-['Lexend'] relative">
      <main className={`flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark transition-all duration-300 ${isWantedModalOpen ? 'blur-sm opacity-50' : ''}`}>
        <UserNavbar userName="Alex" />

        <div className="p-8 max-w-[1200px] mx-auto w-full">
          {/* Section: Skills I Offer */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold">Skills I Offer</h3>
                  <p className="text-slate-500 dark:text-[#92c9a4] text-sm">Skills you are teaching to others</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 cursor-pointer"
              >
                <span className="material-symbols-outlined">add</span>
                Add New Skill
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offeredSkills.map((skill, index) => (
                <MySkillCard 
                  key={index} 
                  {...skill} 
                  isOffer={true} 
                  onEdit={() => handleEditClick(skill)}
                  onViewCurriculum={() => handleViewCurriculum(skill.title)}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">auto_stories</span>
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold">Skills I Want to Learn</h3>
                  <p className="text-slate-500 dark:text-[#92c9a4] text-sm">Skills you're looking for partners</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wantedSkills.map((skill, index) => (
                <MySkillCard 
                  key={index} 
                  {...skill} 
                  isOffer={false} 
                  onEdit={() => handleEditClick(skill)}
                />
              ))}
              
              {/* Trigger Wanted Skill Modal */}
              <button 
                className="border-2 border-dashed border-slate-200 dark:border-[#23482f] rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary hover:text-primary transition-all group cursor-pointer"
                onClick={() => setIsWantedModalOpen(true)}
              >
                <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">add_circle</span>
                <span className="font-bold">Add Wanted Skill</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Existing Modals */}
      <EditSkillModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        skillData={selectedSkill}
      />

      <AddSkillModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <CurriculumModal 
        isOpen={isCurriculumOpen} 
        onClose={() => setIsCurriculumOpen(false)} 
        skillTitle={activeSkillTitle}
        onEditRequest={() => {
          setIsCurriculumOpen(false); 
          setIsEditCurriculumOpen(true); 
        }} 
      />

      <EditCurriculumModal
        isOpen={isEditCurriculumOpen} 
        onClose={() => setIsEditCurriculumOpen(false)} 
        skillTitle={activeSkillTitle}
      />
      {/* --- ADD WANTED SKILL MODAL (Integrated from your code) --- */}
      {isWantedModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#102216]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#102216]/85 backdrop-blur-xl w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#13ec5b]/20">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-[#23482f]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#13ec5b]/10 flex items-center justify-center">
                  <PlusCircle className="text-[#13ec5b]" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Add Wanted Skill</h2>
              </div>
              <button onClick={() => setIsWantedModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#92c9a4]">What do you want to learn?</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    className="w-full bg-[#193322]/50 border border-[#23482f] focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all" 
                    placeholder="Find a skill you want to learn" 
                    type="text"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-slate-500 font-medium py-1">Suggested:</span>
                  {['Python', 'Photography', 'Data Science', 'Guitar'].map(skill => (
                    <button key={skill} className="px-3 py-1 rounded-full bg-[#23482f] text-[#92c9a4] text-xs font-medium hover:bg-[#13ec5b]/20 hover:text-[#13ec5b] transition-all">
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#92c9a4]">Target Proficiency</label>
                <div className="grid grid-cols-3 gap-3">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <label key={level} className="cursor-pointer group">
                      <input 
                        className="peer hidden" 
                        name="proficiency" 
                        type="radio" 
                        checked={targetProficiency === level}
                        onChange={() => setTargetProficiency(level)}
                      />
                      <div className="text-center py-3 rounded-xl border border-[#23482f] bg-[#193322]/30 text-slate-400 peer-checked:bg-[#13ec5b]/10 peer-checked:border-[#13ec5b] peer-checked:text-[#13ec5b] transition-all font-medium text-sm capitalize">
                        {level}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#92c9a4]">Add a note to potential mentors</label>
                <textarea 
                  className="w-full bg-[#193322]/50 border border-[#23482f] focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] rounded-xl py-3 px-4 text-white placeholder-slate-500 outline-none transition-all resize-none" 
                  placeholder="Explain what you're hoping to achieve..." 
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 pt-0 flex gap-4">
              <button 
                onClick={() => setIsWantedModalOpen(false)}
                className="flex-1 px-6 py-4 rounded-xl border border-[#23482f] text-slate-400 font-bold hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button className="flex-[2] px-6 py-4 rounded-xl bg-[#13ec5b] text-[#102216] font-bold hover:shadow-lg hover:shadow-[#13ec5b]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <CheckCircle2 size={20} />
                Add to My List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySkills;