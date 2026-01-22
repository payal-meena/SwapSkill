import React, { useState } from 'react';

const CurriculumSection = ({ number, title, items, isOpen, onToggle }) => (
  <div className={`border border-slate-200 dark:border-[#23482f] rounded-2xl bg-slate-50/50 dark:bg-transparent overflow-hidden transition-all ${isOpen ? 'border-primary/30' : ''}`}>
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-left group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className="text-primary font-bold text-sm">{number}.</span>
        <span className="font-bold text-slate-900 dark:text-white">{title}</span>
      </div>
      <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
        expand_more
      </span>
    </button>
    <div className={`px-11 pb-5 space-y-3 transition-all ${isOpen ? 'block' : 'hidden'}`}>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between group">
          <span className="text-sm text-slate-600 dark:text-slate-300">{item.name}</span>
          <span className={`material-symbols-outlined text-primary text-sm ${item.completed ? 'fill-icon' : ''}`}>
            {item.completed ? 'check_circle' : 'circle'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const CurriculumModal = ({ isOpen, onClose, skillTitle , onEditRequest}) => {
  const [openSection, setOpenSection] = useState(1);

  if (!isOpen) return null;

  const curriculumData = [
    {
      id: 1,
      title: "Design Foundations & Theory",
      items: [
        { name: "Color Theory and Accessibility", completed: true },
        { name: "Typography Systems & Hierarchy", completed: true },
        { name: "Grid Systems and Layout Principles", completed: true },
      ]
    },
    {
      id: 2,
      title: "User Research & Personas",
      items: [
        { name: "Conducting Stakeholder Interviews", completed: true },
        { name: "Building Empathy Maps", completed: true },
        { name: "Competitive Analysis & Auditing", completed: false },
      ]
    },
    {
      id: 3,
      title: "Wireframing & Prototyping",
      items: [
        { name: "Low-Fidelity Sketching", completed: false },
        { name: "Interaction Design in Figma", completed: false },
        { name: "Advanced Component Logic & Variants", completed: false },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm font-['Lexend']">
      <div className="bg-white dark:bg-[#112217] w-full max-w-2xl max-h-[90vh] rounded-3xl border border-slate-200 dark:border-[#23482f] shadow-2xl flex flex-col overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 dark:border-[#23482f] flex items-center justify-between bg-white dark:bg-[#193322]">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <span className="material-symbols-outlined text-primary text-2xl">school</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{skillTitle} Curriculum</h2>
              <p className="text-slate-500 dark:text-[#92c9a4] text-sm">Advanced Proficiency Syllabus</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#23482f] text-slate-400 hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-4">
            {curriculumData.map((section) => (
              <CurriculumSection 
                key={section.id}
                number={`0${section.id}`}
                title={section.title}
                items={section.items}
                isOpen={openSection === section.id}
                onToggle={() => setOpenSection(openSection === section.id ? null : section.id)}
              />
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-[#23482f] flex justify-end gap-3 bg-white dark:bg-[#193322]">
          <button className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-[#23482f] text-slate-600 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-[#23482f] transition-all cursor-pointer"
          onClick={onEditRequest}>
            Edit Curriculum
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-primary text-[#102216] font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 cursor-pointer">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurriculumModal;