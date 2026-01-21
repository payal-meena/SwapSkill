import React, { useState } from 'react';
import {
    Search, School, BookOpen, Verified, Users, History,
    Edit, Trash2, Share2, Settings, HelpCircle, ShieldCheck, Plus, LogOut
} from 'lucide-react';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('teaching');

    // Reliable Unsplash URLs with format parameters
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

            {/* --- HEADER --- */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-8 flex-1">
                        <div className="flex items-center gap-3 text-[#13ec5b]">
                            <div className="w-10 h-10 flex items-center justify-center bg-[#13ec5b]/10 rounded-lg">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">Profile</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-5 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[#13ec5b]/20">
                            <LogOut size={16} /> Log Out
                        </button>
                        <div className="w-10 h-10 rounded-full border-2 border-[#13ec5b]/50 overflow-hidden shadow-inner">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR --- */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="sticky top-24 flex flex-col gap-6">
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="w-24 h-24 rounded-full border-4 border-[#13ec5b]/20 shadow-xl overflow-hidden bg-slate-200">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">Alex Rivera</h1>
                                        <p className="text-[#13ec5b] font-medium tracking-wide">Fullstack Developer</p>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        Passionate builder of web experiences. I love sharing React patterns and learning about creative design.
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
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-white/10 transition-all font-bold text-sm">
                                        <Settings size={18} /> Edit Bio
                                    </button>
                                </div>
                            </div>

                            <div className="px-2 flex flex-col gap-2">
                                <SidebarLink icon={<HelpCircle size={20} />} label="Support Center" />
                                <SidebarLink icon={<ShieldCheck size={20} />} label="Privacy Settings" />
                            </div>
                        </div>
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <section className="flex-1">
                        {/* Tabs */}
                        <div className="mb-8 border-b border-slate-200 dark:border-white/10">
                            <div className="flex gap-10">
                                <TabButton
                                    active={activeTab === 'teaching'}
                                    onClick={() => setActiveTab('teaching')}
                                    icon={<School size={20} />}
                                    label="Teaching"
                                />
                                <TabButton
                                    active={activeTab === 'learning'}
                                    onClick={() => setActiveTab('learning')}
                                    icon={<BookOpen size={20} />}
                                    label="Learning"
                                />
                            </div>
                        </div>

                        {/* Skill Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {skills.map(skill => (
                                <SkillCard key={skill.id} skill={skill} />
                            ))}

                            {/* Add Skill Button */}
                            <button className="group flex flex-col items-center justify-center gap-4 p-8 min-h-[260px] border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-[#13ec5b]/50 hover:bg-[#13ec5b]/5 rounded-2xl transition-all">
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
        </div>
    );
};

// Helper Components
const StatBox = ({ label, value }) => (
    <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
        <span className="text-xl font-bold dark:text-white">{value}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</span>
    </div>
);

const SidebarLink = ({ icon, label }) => (
    <div className="flex items-center gap-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer group">
        <span className="group-hover:text-[#13ec5b]">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
    </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`relative pb-4 flex items-center gap-2 font-bold transition-all ${active ? 'text-[#13ec5b]' : 'text-slate-500 hover:text-slate-300'}`}
    >
        {icon} {label}
        {active && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#13ec5b] rounded-t-full shadow-[0_-2px_10px_rgba(19,236,91,0.5)]"></div>}
    </button>
);

const SkillCard = ({ skill }) => (
    <div className="group relative bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-[#13ec5b]/50 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
        {/* Fixed Image Logic */}
        <div className="h-44 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
            <img 
                src={skill.img} 
                alt={skill.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => { e.target.src = "https://via.placeholder.com/400x250?text=Skill+Image" }}
            />
        </div>

        <div className="p-5">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg leading-tight">{skill.title}</h3>
                <span className="px-2 py-1 bg-[#13ec5b]/10 text-[#13ec5b] text-[10px] font-black uppercase tracking-widest rounded-md">
                    {skill.level}
                </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <span className="text-[#13ec5b]">{skill.icon}</span> 
                {skill.info}
            </div>
        </div>

        {/* Hover Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0">
            <button className="w-9 h-9 rounded-xl bg-white/90 dark:bg-black/70 backdrop-blur-md text-slate-800 dark:text-white hover:text-[#13ec5b] shadow-lg flex items-center justify-center transition-colors">
                <Edit size={18} />
            </button>
            <button className="w-9 h-9 rounded-xl bg-white/90 dark:bg-black/70 backdrop-blur-md text-slate-800 dark:text-white hover:text-red-500 shadow-lg flex items-center justify-center transition-colors">
                <Trash2 size={18} />
            </button>
        </div>
    </div>
);

export default Profile;