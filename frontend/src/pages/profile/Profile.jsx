import React, { useState } from 'react';
import {
    Search, School, BookOpen, Verified, Users, History,
    Edit, Trash2, Share2, Settings, HelpCircle, ShieldCheck, Plus, LogOut,
    X, Camera, ChevronRight, Rocket, Star
} from 'lucide-react';

// --- 1. MODAL COMPONENT ---
const AddExpertiseModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [proficiency, setProficiency] = useState('Intermediate');

    if (!isOpen) return null;

    const steps = [
        { id: 1, label: "Skill Basics" },
        { id: 2, label: "Proficiency" },
        { id: 3, label: "Description" }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#102210]/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-[#102210] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] flex flex-col relative shadow-2xl text-white font-['Lexend']">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors z-50"
                >
                    <X size={20} className="text-white/60" />
                </button>

                <div className="p-8 md:p-12 overflow-y-auto">
                    {/* Stepper Visual */}
                    <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>
                        <div 
                            className="absolute top-1/2 left-0 h-0.5 bg-[#13ec5b] -translate-y-1/2 z-0 transition-all duration-500"
                            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>
                        {steps.map((s) => (
                            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`size-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                                    step >= s.id ? 'bg-[#13ec5b] text-[#102210] shadow-[0_0_15px_rgba(19,236,91,0.4)]' : 'bg-white/10 text-white/40 border-2 border-white/10'
                                }`}>
                                    {s.id}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-[#13ec5b]' : 'text-white/40'}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mb-10 text-center">
                        <h2 className="text-white text-3xl font-bold mb-2 tracking-tight">Add New Expertise</h2>
                        <p className="text-white/50">Define the core details of what you want to teach.</p>
                    </div>

                    {/* Step 1 Content */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-8 text-left">
                                <div className="flex flex-col gap-3">
                                    <label className="text-white/80 text-xs font-bold uppercase tracking-widest ml-1">Skill Name</label>
                                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] outline-none transition-all placeholder:text-white/20" placeholder="e.g. React Development" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-white/80 text-xs font-bold uppercase tracking-widest ml-1">Category</label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-1 focus:ring-[#13ec5b]">
                                        <option className="bg-[#102210]">Development</option>
                                        <option className="bg-[#102210]">Design</option>
                                        <option className="bg-[#102210]">Business</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 text-left">
                                <label className="text-white/80 text-xs font-bold uppercase tracking-widest ml-1">Thumbnail</label>
                                <div className="flex-1 min-h-[180px] border-2 border-dashed border-[#13ec5b]/20 rounded-2xl bg-white/5 hover:bg-[#13ec5b]/5 flex flex-col items-center justify-center cursor-pointer transition-all group">
                                    <Camera size={48} className="text-[#13ec5b]/40 group-hover:text-[#13ec5b] mb-3 transition-colors" />
                                    <p className="text-sm font-medium">Upload Cover Image</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2 Content */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <ProficiencyCard 
                                    level="Beginner" desc="Foundations" 
                                    active={proficiency === 'Beginner'} 
                                    onClick={() => setProficiency('Beginner')} 
                                />
                                <ProficiencyCard 
                                    level="Intermediate" desc="Practical Use" 
                                    active={proficiency === 'Intermediate'} 
                                    onClick={() => setProficiency('Intermediate')} 
                                />
                                <ProficiencyCard 
                                    level="Expert" desc="Mastery" 
                                    active={proficiency === 'Expert'} 
                                    onClick={() => setProficiency('Expert')} 
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3 Content */}
                    {step === 3 && (
                        <div className="space-y-4 text-left animate-in slide-in-from-right-4 duration-300">
                             <label className="text-white/80 text-xs font-bold uppercase tracking-widest ml-1">Description</label>
                             <textarea 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[200px] outline-none focus:border-[#13ec5b] transition-all"
                                placeholder="Describe what you will teach..."
                             />
                        </div>
                    )}

                    {/* Footer Actions */}
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
                                <button className="bg-[#13ec5b] px-10 py-4 rounded-xl text-[#102216] font-black tracking-widest shadow-[0_0_20px_rgba(19,236,91,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                    PUBLISH <Rocket size={20} />
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
    <button onClick={onClick} className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${
        active ? 'border-[#13ec5b] bg-[#13ec5b]/10 shadow-[0_0_15px_rgba(19,236,91,0.2)]' : 'border-white/10 bg-white/5 hover:border-white/20'
    }`}>
        <div className={`size-10 rounded-lg flex items-center justify-center ${active ? 'bg-[#13ec5b] text-[#102216]' : 'bg-white/10'}`}>
            <Star size={20} fill={active ? "currentColor" : "none"} />
        </div>
        <div>
            <p className="font-bold">{level}</p>
            <p className="text-[10px] uppercase text-white/40 font-bold">{desc}</p>
        </div>
    </button>
);

// --- 2. MAIN PROFILE COMPONENT ---
const Profile = () => {
    const [activeTab, setActiveTab] = useState('teaching');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const skills = [
        {
            id: 1,
            title: "React Development",
            level: "Expert",
            info: "Certified Mentor",
            icon: <Verified size={18} />,
            img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600"
        },
        {
            id: 2,
            title: "UX Design",
            level: "Advanced",
            info: "12 Active Students",
            icon: <Users size={18} />,
            img: "https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg?semt=ais_hybrid&w=740&q=80"
        },
        {
            id: 3,
            title: "Python Scripting",
            level: "Intermediate",
            info: "Recently Updated",
            icon: <History size={18} />,
            img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#102216] text-slate-900 dark:text-white font-['Lexend']">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-3 text-[#13ec5b]">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#13ec5b]/10 rounded-lg">
                            <Users size={24} />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">Profile</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-[#13ec5b]/20">
                            <LogOut size={16} /> Log Out
                        </button>
                        <div className="w-10 h-10 rounded-full border-2 border-[#13ec5b]/50 overflow-hidden bg-slate-200">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="sticky top-24 flex flex-col gap-6">
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="w-24 h-24 rounded-full border-4 border-[#13ec5b]/20 shadow-xl overflow-hidden bg-slate-200">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="profile" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">Alex Rivera</h1>
                                        <p className="text-[#13ec5b] font-medium tracking-wide">Fullstack Developer</p>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        Passionate builder of web experiences. I love sharing React patterns and learning design.
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-8">
                                    <StatBox label="Rating" value="5.0" />
                                    <StatBox label="Swaps" value="24" />
                                    <StatBox label="Skills" value="12" />
                                </div>
                                <div className="mt-8 flex flex-col gap-3">
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#13ec5b]/10 text-[#13ec5b] border border-[#13ec5b]/20 hover:bg-[#13ec5b] hover:text-[#102216] transition-all font-bold text-sm">
                                        <Share2 size={18} /> Share Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Content Section */}
                    <section className="flex-1">
                        <div className="mb-8 border-b border-slate-200 dark:border-white/10">
                            <div className="flex gap-10">
                                <TabButton active={activeTab === 'teaching'} onClick={() => setActiveTab('teaching')} icon={<School size={20} />} label="Teaching" />
                                <TabButton active={activeTab === 'learning'} onClick={() => setActiveTab('learning')} icon={<BookOpen size={20} />} label="Learning" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {skills.map(skill => (
                                <SkillCard key={skill.id} skill={skill} />
                            ))}

                            {/* Trigger Modal on Click */}
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="group flex flex-col items-center justify-center gap-4 p-8 min-h-[260px] border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-[#13ec5b]/50 hover:bg-[#13ec5b]/5 rounded-2xl transition-all"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#13ec5b]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(19,236,91,0.2)]">
                                    <Plus className="text-[#13ec5b]" size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-lg group-hover:text-[#13ec5b] transition-colors">Add Expertise</p>
                                    <p className="text-slate-500 text-sm mt-1">Share a new skill</p>
                                </div>
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* Modal Integrated */}
            <AddExpertiseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

// ... SidebarLink, StatBox, TabButton, SkillCard helper components (keeping same logic) ...
const StatBox = ({ label, value }) => (
    <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
        <span className="text-xl font-bold dark:text-white">{value}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</span>
    </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className={`relative pb-4 flex items-center gap-2 font-bold transition-all ${active ? 'text-[#13ec5b]' : 'text-slate-500 hover:text-slate-300'}`}>
        {icon} {label}
        {active && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#13ec5b] rounded-t-full shadow-[0_-2px_10px_rgba(19,236,91,0.5)]"></div>}
    </button>
);

const SkillCard = ({ skill }) => (
    <div className="group relative bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-[#13ec5b]/50 transition-all">
        <div className="h-44 w-full overflow-hidden bg-slate-200">
            <img src={skill.img} alt={skill.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="p-5">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg leading-tight">{skill.title}</h3>
                <span className="px-2 py-1 bg-[#13ec5b]/10 text-[#13ec5b] text-[10px] font-black uppercase tracking-widest rounded-md">{skill.level}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <span className="text-[#13ec5b]">{skill.icon}</span> {skill.info}
            </div>
        </div>
    </div>
);

export default Profile;