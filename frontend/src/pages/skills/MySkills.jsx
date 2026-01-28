import React, { useState, useEffect } from 'react';
import { Search, X, CheckCircle2, PlusCircle } from 'lucide-react'; 
import UserNavbar from '../../components/common/UserNavbar'; 
import MySkillCard from '../../components/skills/MySkillCard'; 
import EditSkillModal from '../../components/modals/EditSkillModal'; 
import AddSkillModal from '../../components/modals/AddSkillModal'; 
import CurriculumModal from '../../components/modals/CurriculumModal';
import EditCurriculumModal from '../../components/modals/EditCurriculumModal';
import { skillService } from '../../services/skillService';

const MySkills = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState('offered'); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [isEditCurriculumOpen, setIsEditCurriculumOpen] = useState(false);
  const [activeSkillTitle, setActiveSkillTitle] = useState("");
  const [isWantedModalOpen, setIsWantedModalOpen] = useState(false); 
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [targetProficiency, setTargetProficiency] = useState('beginner');
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySkills();
    fetchMyWantedSkills();
  }, []);

  const fetchMyWantedSkills = async () => {
    try {
      const response = await skillService.getMyWantedSkills();
      if (response.success) {
        const formattedSkills = response.skills.map(skill => ({
          id: skill._id,
          title: skill.skillName,
          level: skill.leval || skill.level,
          icon: "auto_stories",
          detail: "Looking for mentor",
          status: "Searching for partners",
          description: skill.description
        }));
        setWantedSkills(formattedSkills);
      }
    } catch (error) {
      console.error('Error fetching wanted skills:', error);
    }
  };

  const handleAddWantedSkill = async () => {
    if (!skillName.trim()) return;
    try {
      const skillData = {
        skillName: skillName.trim(),
        level: targetProficiency.charAt(0).toUpperCase() + targetProficiency.slice(1),
        description: description.trim()
      };
      await skillService.addWantedSkill(skillData);
      fetchMyWantedSkills();
      setIsWantedModalOpen(false);
      setSkillName('');
      setDescription('');
      setTargetProficiency('beginner');
    } catch (error) {
      console.error('Error adding wanted skill:', error);
    }
  };

  const fetchMySkills = async () => {
    try {
      setLoading(true);
      const response = await skillService.getMySkills();
      if (response.success) {
        const formattedSkills = response.skills.map(skill => ({
          id: skill._id,
          title: skill.skillName,
          level: skill.level,
          icon: getIconForCategory(skill.catogory),
          detail: `${skill.experience} years experience`,
          status: skill.isActive ? "Active" : "Paused",
          description: skill.description,
          category: skill.catogory,
          type: skill.type
        }));
        setOfferedSkills(formattedSkills);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (category) => {
    const iconMap = {
      'Design & Creative': 'brush',
      'Development & IT': 'code',
      'Languages': 'translate',
      'Business & Marketing': 'business',
      'Music & Arts': 'music_note',
      'Education': 'school'
    };
    return iconMap[category] || 'star';
  };

  const handleSkillAdded = () => {
    fetchMySkills();
    setIsAddModalOpen(false);
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await skillService.deleteSkill(skillId);
      fetchMySkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleDeleteWantedSkill = async (skillId) => {
    try {
      await skillService.deleteWantedSkill(skillId);
      fetchMyWantedSkills();
    } catch (error) {
      console.error('Error deleting wanted skill:', error);
    }
  };

  const handleEditClick = (skill) => {
    setSelectedSkill(skill);
    setIsEditModalOpen(true);
  };

  const handleViewCurriculum = (title) => {
    setActiveSkillTitle(title);
    setIsCurriculumOpen(true);
  };

  const handleOpenEditCurriculum = () => {
    setIsCurriculumOpen(false); 
    setIsEditCurriculumOpen(true); 
  };

  return (
    <div className="flex h-screen overflow-hidden font-['Lexend'] relative">
      <main className={`flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-[#0a0f0b] transition-all duration-300 ${isWantedModalOpen ? 'blur-sm opacity-50' : ''}`}>
        <UserNavbar userName="Alex" />

        <div className="max-w-7xl mx-auto w-full px-6 py-10">
          
          {/* --- HIGH-DEFINITION CENTERED NAVIGATION TABS --- */}
          <div className="flex justify-center mb-16">
            <div className="relative bg-[#102216] p-1.5 rounded-[2rem] flex items-center w-full max-w-lg border border-white/5 shadow-2xl">
              {/* Sliding Background Indicator */}
              <div 
                className={`absolute h-[calc(100%-12px)] top-[6px] transition-all duration-500 ease-out rounded-[1.6rem] bg-[#13ec5b] shadow-[0_0_20px_rgba(19,236,91,0.4)]
                ${activeTab === 'offered' ? 'left-[6px] w-[calc(50%-6px)]' : 'left-[50%] w-[calc(50%-6px)]'}`}
              />

              <button 
                onClick={() => setActiveTab('offered')}
                className={`relative z-10 flex-1 flex items-center justify-center gap-3 py-4 text-[15px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'offered' ? 'text-[#0a0f0b] scale-105' : 'text-[#92c9a4]/50 hover:text-[#92c9a4]'}`}
              >
                <span className="material-symbols-outlined text-xl">school</span>
                Skills I Offer
              </button>

              <button 
                onClick={() => setActiveTab('wanted')}
                className={`relative z-10 flex-1 flex items-center justify-center gap-3 py-4 text-[15px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'wanted' ? 'text-[#0a0f0b] scale-105' : 'text-[#92c9a4]/50 hover:text-[#92c9a4]'}`}
              >
                <span className="material-symbols-outlined text-xl">auto_stories</span>
                Skills I Want
              </button>
            </div>
          </div>

          <div className="flex justify-center w-full">
            {activeTab === 'offered' ? (
              /* --- OFFERED SKILLS SECTION --- */
              <section className="w-full animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                  <div className="text-center md:text-left">
                    <h3 className="text-slate-900 dark:text-white text-3xl font-black uppercase tracking-tight">Skills I Offer</h3>
                    <div className="h-1 w-12 bg-[#13ec5b] mt-2 mb-2 hidden md:block rounded-full"></div>
                    <p className="text-[#13ec5b] text-[10px] font-black tracking-[0.2em]">SHARE YOUR EXPERTISE WITH THE WORLD</p>
                  </div>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-[#13ec5b] text-[#102216] font-black rounded-2xl hover:shadow-[0_0_25px_rgba(19,236,91,0.4)] hover:scale-105 transition-all cursor-pointer text-[13px] uppercase tracking-widest"
                  >
                    <PlusCircle size={18} />
                    Add New Skill
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {loading ? (
                    <div className="col-span-full text-center py-20 flex flex-col items-center">
                      <div className="size-12 border-4 border-[#13ec5b]/20 border-t-[#13ec5b] rounded-full animate-spin mb-4" />
                      <div className="text-[#13ec5b] font-black text-xs tracking-widest uppercase">Syncing Skillset...</div>
                    </div>
                  ) : offeredSkills.length > 0 ? (
                    offeredSkills.map((skill) => (
                      <MySkillCard 
                        key={skill.id} 
                        {...skill} 
                        isOffer={true} 
                        onEdit={() => handleEditClick(skill)}
                        onViewCurriculum={() => handleViewCurriculum(skill.title)}
                        onDelete={() => handleDeleteSkill(skill.id)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-24 border-2 border-dashed border-[#23482f] rounded-[3rem] bg-[#102216]/20">
                      <div className="text-slate-500 dark:text-[#92c9a4]/40 mb-6 font-black uppercase text-xs tracking-[0.3em]">No skills being offered yet</div>
                      <button onClick={() => setIsAddModalOpen(true)} className="text-[#13ec5b] hover:text-white transition-colors font-black text-xs uppercase underline tracking-widest">Launch Your First Course</button>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              /* --- WANTED SKILLS SECTION --- */
              <section className="w-full animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="text-center md:text-left mb-10">
                  <h3 className="text-slate-900 dark:text-white text-3xl font-black uppercase tracking-tight">Skills I Want to Learn</h3>
                  <div className="h-1 w-12 bg-[#13ec5b] mt-2 mb-2 hidden md:block rounded-full"></div>
                  <p className="text-[#13ec5b] text-[10px] font-black tracking-[0.2em]">YOUR PERSONAL GROWTH ROADMAP</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {wantedSkills.map((skill, index) => (
                    <MySkillCard 
                      key={skill.id || index} 
                      {...skill} 
                      isOffer={false} 
                      onEdit={() => handleEditClick(skill)}
                      onDelete={() => handleDeleteWantedSkill(skill.id)}
                    />
                  ))}
                  
                  {/* Neon Styled "Add New" Button */}
                  <button 
                    className="border-2 border-dashed border-slate-200 dark:border-[#23482f] rounded-[2.5rem] flex flex-col items-center justify-center p-14 text-slate-400 hover:border-[#13ec5b] hover:bg-[#13ec5b]/5 hover:text-[#13ec5b] transition-all group cursor-pointer shadow-2xl shadow-black/10 min-h-[300px]"
                    onClick={() => setIsWantedModalOpen(true)}
                  >
                    <PlusCircle className="mb-5 group-hover:scale-110 transition-transform text-[#13ec5b]/40 group-hover:text-[#13ec5b]" size={56} />
                    <span className="font-black uppercase tracking-[0.2em] text-[10px]">Identify New Target</span>
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* --- Modals Section --- */}
      <EditSkillModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} skillData={selectedSkill} />
      <AddSkillModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSkillAdded={handleSkillAdded} />
      <CurriculumModal isOpen={isCurriculumOpen} onClose={() => setIsCurriculumOpen(false)} skillTitle={activeSkillTitle} onEditRequest={handleOpenEditCurriculum} />
      <EditCurriculumModal isOpen={isEditCurriculumOpen} onClose={() => setIsEditCurriculumOpen(false)} skillTitle={activeSkillTitle} />

      {/* Modern Neon Styled Wanted Skill Modal */}
      {isWantedModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050a06]/80 backdrop-blur-md">
          <div className="bg-[#102216] w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center px-10 py-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-[#13ec5b]/10 flex items-center justify-center shadow-inner">
                  <PlusCircle className="text-[#13ec5b]" size={24} />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight uppercase">New Learning Goal</h2>
              </div>
              <button onClick={() => setIsWantedModalOpen(false)} className="text-white/20 hover:text-white transition-colors"><X size={28} /></button>
            </div>

            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-[#92c9a4] uppercase tracking-widest ml-1">Skill Identification</label>
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#13ec5b] transition-colors" size={20} />
                  <input className="w-full bg-white/5 border border-white/10 focus:border-[#13ec5b] rounded-[1.2rem] py-4 pl-14 pr-6 text-white outline-none transition-all placeholder:text-white/10" placeholder="e.g. Creative Direction" type="text" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-[#92c9a4] uppercase tracking-widest ml-1">Proficiency Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <label key={level} className="cursor-pointer">
                      <input className="peer hidden" name="proficiency" type="radio" checked={targetProficiency === level} onChange={() => setTargetProficiency(level)} />
                      <div className="text-center py-4 rounded-[1.2rem] border border-white/5 bg-white/5 text-white/30 peer-checked:bg-[#13ec5b]/10 peer-checked:border-[#13ec5b] peer-checked:text-[#13ec5b] transition-all font-black text-[9px] uppercase tracking-tighter">{level}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-[#92c9a4] uppercase tracking-widest ml-1">Learning Motivation</label>
                <textarea className="w-full bg-white/5 border border-white/10 focus:border-[#13ec5b] rounded-[1.2rem] py-4 px-6 text-white outline-none resize-none transition-all placeholder:text-white/10" placeholder="Briefly describe your objectives..." rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
            </div>

            <div className="p-10 pt-0 flex gap-5">
              <button onClick={() => setIsWantedModalOpen(false)} className="flex-1 px-6 py-5 rounded-[1.2rem] border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={handleAddWantedSkill} className="flex-[2] px-6 py-5 rounded-[1.2rem] bg-[#13ec5b] text-[#102216] font-black text-[10px] uppercase tracking-widest hover:shadow-[0_0_30px_rgba(19,236,91,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"><CheckCircle2 size={18} /> Confirm Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySkills;