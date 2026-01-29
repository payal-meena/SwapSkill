import React, { useState, useRef } from 'react';
import { X, Camera, ChevronRight, Rocket, Star, ShieldCheck } from 'lucide-react';
import { skillService } from '../../services/skillService';

const ExpertisePage = ({ isOpen, onClose, onSkillAdded }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [proficiency, setProficiency] = useState('Intermediate');
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [skillData, setSkillData] = useState({
    skillName: '',
    category: '',
    description: '',
    experience: ''
  });

  const steps = [
    { id: 1, label: "Skill Basics" },
    { id: 2, label: "Proficiency" },
    { id: 3, label: "Description" }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkillData(prev => ({ ...prev, [name]: value }));
  };

  const getIconForCategory = (category) => {
    const iconMap = {
      'Development': <Rocket size={18} />,
      'Design': <Star size={18} />,
      'Business': <ShieldCheck size={18} />
    };
    return iconMap[category] || <Rocket size={18} />;
  };

  const handlePublish = async () => {
    if (isSubmitting) return; 

    try {
      setIsSubmitting(true); 

      console.log("🟡 RAW STATE CHECK");
      console.log("skillData:", skillData);
      console.log("proficiency:", proficiency);
      console.log("selectedImage:", selectedImage);

      const formData = new FormData();

      formData.append("skillName", skillData.skillName);
      formData.append("category", skillData.category);
      formData.append("description", skillData.description);
      formData.append("experience", skillData.experience);
      formData.append("level", proficiency);
      formData.append("type", "offer");

      if (selectedImage) {
        formData.append("thumbnail", selectedImage);
      }

      // 🔍 debug
      console.log("🟢 FORM DATA CONTENTS");
      for (let pair of formData.entries()) {
        console.log(pair[0], "=>", pair[1]);
      }

      const response = await skillService.addSkill(formData);
      console.log("✅ RESPONSE:", response);

      if (response.success) {
        // 🧹 reset form
        setSkillData({
          skillName: '',
          category: '',
          description: '',
          experience: ''
        });
        setProficiency('Intermediate');
        setSelectedImage(null);
        setPreview(null);
        setStep(1);

       
        onClose();
      }

    } catch (err) {
      console.error("❌ ADD SKILL ERROR:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false); 
    }
  };




  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#102210]/60 backdrop-blur-xl">
      <div className="bg-[#102210] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] flex flex-col relative shadow-2xl text-white font-['Lexend']">

        <button
          onClick={onClose}
          className="absolute top-8 right-8 size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors z-50"
        >
          <X size={20} className="text-white/60" />
        </button>

        {/* Progress Steps */}
        <div className="p-8 md:p-12 overflow-y-auto">
          <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#13ec5b] -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            {steps.map(s => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`size-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s.id ? 'bg-[#13ec5b] text-[#102210] shadow-[0_0_15px_rgba(19,236,91,0.4)]' : 'bg-white/10 text-white/40 border-2 border-white/10'
                  }`}>{s.id}</div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-[#13ec5b]' : 'text-white/40'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Modal Title */}
          <div className="mb-10 text-center">
            <h2 className="text-white text-3xl font-bold mb-2 tracking-tight">Add New Expertise</h2>
            <p className="text-white/50">Define the core details of what you want to teach.</p>
          </div>

          {/* Step 1: Skill Basics */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <input
                  name="skillName"
                  value={skillData.skillName}
                  onChange={handleChange}
                  placeholder="Skill Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none placeholder:text-white/40"
                />
                <select
                  name="category"
                  value={skillData.category}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
                >

                  <option className="bg-[#102210]" value="">Select a category</option>
                  <option className="bg-[#102210]" value="Design & Creative">Design & Creative</option>
                  <option className="bg-[#102210]" value="Development & IT">Development & IT</option>
                  <option className="bg-[#102210]" value="Business & Marketing">Business & Marketing</option>
                  <option className="bg-[#102210]" value="Languages">Languages</option>
                  <option className="bg-[#102210]" value="Music & Arts">Music & Arts</option>
                  <option className="bg-[#102210]" value="Education">Education</option>
                </select>
                <div>
                  <label className="block mb-2 text-xs font-bold uppercase tracking-widest text-white/50">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    min="0"
                    value={skillData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none placeholder:text-white/40 focus:border-[#13ec5b] transition-all"
                  />
                </div>
              </div>

              {/* Thumbnail */}
              <div className="flex flex-col gap-3">
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="flex-1 min-h-[180px] border-2 border-dashed border-[#13ec5b]/20 rounded-2xl bg-white/5 hover:bg-[#13ec5b]/5 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden"
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs font-bold">CHANGE IMAGE</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera size={48} className="text-[#13ec5b]/40 group-hover:text-[#13ec5b] mb-3 transition-colors" />
                      <p className="text-sm font-medium">Upload Cover Image</p>
                      <p className="text-[10px] text-white/30 mt-1 uppercase">Click to browse PC</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Proficiency */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Beginner', 'Intermediate', 'Expert'].map(level => (
                <ProficiencyCard
                  key={level}
                  level={level}
                  desc={level === 'Beginner' ? 'Foundations' : level === 'Intermediate' ? 'Practical Use' : 'Mastery'}
                  active={proficiency === level}
                  onClick={() => setProficiency(level)}
                />
              ))}
            </div>
          )}

          {/* Step 3: Description */}
          {step === 3 && (
            <textarea
              name="description"
              value={skillData.description}
              onChange={handleChange}
              placeholder="Describe what you will teach..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[200px] outline-none focus:border-[#13ec5b] transition-all"
            />
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-10 mt-10 border-t border-white/5">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              className={`px-8 py-4 font-bold rounded-xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-white/60 hover:text-white'}`}
            >
              Back
            </button>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="bg-white/5 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="bg-[#13ec5b] px-10 py-4 rounded-xl text-[#102216] font-black tracking-widest shadow-[0_0_20px_rgba(19,236,91,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  CONTINUE <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className={`bg-[#13ec5b] px-10 py-4 rounded-xl text-[#102210] font-black tracking-widest 
    shadow-[0_0_20px_rgba(19,236,91,0.4)]
    transition-all flex items-center gap-2
    ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}
  `}
                >
                  {isSubmitting ? "PUBLISHING..." : <>PUBLISH <Rocket size={20} /></>}
                </button>

              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const ProficiencyCard = ({ level, desc, active, onClick }) => (
  <button
    onClick={onClick}
    className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${active ? 'border-[#13ec5b] bg-[#13ec5b]/10 shadow-[0_0_15px_rgba(19,236,91,0.2)]' : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
  >
    <div className={`size-10 rounded-lg flex items-center justify-center ${active ? 'bg-[#13ec5b] text-[#102216]' : 'bg-white/10'}`}>
      <Star size={20} fill={active ? "currentColor" : "none"} />
    </div>
    <div>
      <p className="font-bold">{level}</p>
      <p className="text-[10px] uppercase text-white/40 font-bold">{desc}</p>
    </div>
  </button>
);

export default ExpertisePage;
