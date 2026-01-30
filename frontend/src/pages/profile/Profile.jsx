import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Redirect ke liye
import {
    School, BookOpen, Verified, Users, History,
    Trash2, Share2, Plus, LogOut as LogOutIcon, Rocket, Star, Camera, ShieldCheck
} from 'lucide-react';
import { skillService } from '../../services/skillService';
import ExpertisePage from './ExpertisePage';
import api from "../../services/api";

// Logout Modal Import
import LogOut from '../../components/modals/LogOut';
const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('teaching');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Modal State
    const [skills, setSkills] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/users/me");
                setUser(res.data);
            } catch (err) {
                console.error("Profile fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Fetch Skills
    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await skillService.getMySkills();
            if (response.success) {
                const formattedSkills = response.skills.map(skill => ({
                    id: skill._id,
                    title: skill.skillName,
                    level: skill.level,
                    icon: getIconForCategory(skill.category),
                    info: `${skill.experience || 0} years experience`,
                    description: skill.description,
                    type: skill.type,
                    img: skill.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600"
                }));
                setSkills(formattedSkills);
            }
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    // Logout Functionality
    const handleLogoutConfirm = () => {
        localStorage.removeItem('token'); // Token clear karo
        setIsLogoutModalOpen(false);
        navigate('/login'); // Redirect to login
    };

    const handleSkillAdded = (newSkill) => {
        const formatted = {
            id: newSkill._id,
            title: newSkill.skillName,
            level: newSkill.level,
            icon: getIconForCategory(newSkill.category),
            info: `${newSkill.experience || 0} years experience`,
            img: newSkill.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600"
        };
        setSkills(prev => [...prev, formatted]);
        setIsModalOpen(false);
    };

    const handleDeleteSkill = async (skillId) => {
        try {
            await skillService.deleteSkill(skillId);
            setSkills(prev => prev.filter(s => s.id !== skillId));
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
    };

    const getIconForCategory = (category) => {
        const iconMap = {
            'Design & Creative': <Star size={18} />,
            'Development & IT': <Rocket size={18} />,
            'Languages': <BookOpen size={18} />,
            'Business & Marketing': <ShieldCheck size={18} />,
            'Music & Arts': <Camera size={18} />,
            'Education': <School size={18} />
        };
        return iconMap[category] || <Verified size={18} />;
    };

    return (
        <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#102216] text-slate-900 dark:text-white font-['Lexend']">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-3 text-[#13ec5b]">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#13ec5b]/10 rounded-lg shadow-[0_0_15px_rgba(19,236,91,0.1)]">
                            <Users size={24} />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">Profile</h2>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {/* Logout Trigger Button */}
                        <button 
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wider shadow-lg shadow-[#13ec5b]/20 hover:bg-[#11d652] transition-all active:scale-95"
                        >
                            <LogOutIcon size={16} /> Log Out
                        </button>
                        <div className="w-10 h-10 rounded-full border-2 border-[#13ec5b]/50 overflow-hidden bg-slate-200 shadow-lg">
                            <img src={user?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"} alt="avatar" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="sticky top-24 flex flex-col gap-6">
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#13ec5b]/5 blur-3xl -z-10" />
                                
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="w-28 h-28 rounded-[2.5rem] border-4 border-[#13ec5b]/20 shadow-xl overflow-hidden bg-slate-800 p-1">
                                        <img
                                            src={user?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg"}
                                            className="w-full h-full object-cover rounded-[2.2rem]"
                                            alt="avatar"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-black uppercase tracking-tighter">{user?.name || "USER"}</h1>
                                        <p className="text-[#13ec5b] text-[10px] font-black uppercase tracking-[0.2em] mt-1">{user?.field || "General Expert"}</p>
                                    </div>
                                    <p className="text-slate-500 dark:text-[#92c9a4] text-xs font-medium leading-relaxed opacity-70">
                                        {user?.bio || "No bio available."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-8">
                                    <StatBox label="Rating" value="5.0" />
                                    <StatBox label="Swaps" value="24" />
                                    <StatBox label="Skills" value={skills.length} />
                                </div>
                                
                                <button className="w-full mt-8 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-[#13ec5b]/5 text-[#13ec5b] border border-[#13ec5b]/10 hover:bg-[#13ec5b] hover:text-[#102216] transition-all font-black text-[10px] uppercase tracking-widest shadow-lg">
                                    <Share2 size={16} /> Share Profile
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Content Section */}
                    <section className="flex-1">
                        <div className="mb-8 border-b border-slate-200 dark:border-white/10">
                            <div className="flex gap-10">
                                <TabButton active={activeTab === 'teaching'} onClick={() => setActiveTab('teaching')} icon={<School size={20} />} label="Teaching" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {skills.map(skill => (
                                <SkillCard
                                    key={skill.id}
                                    skill={skill}
                                    onDelete={() => handleDeleteSkill(skill.id)}
                                />
                            ))}

                            {/* Add Skill Button */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group flex flex-col items-center justify-center gap-4 p-8 min-h-[280px] border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-[#13ec5b]/50 hover:bg-[#13ec5b]/5 rounded-[2.5rem] transition-all"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[#13ec5b]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(19,236,91,0.1)]">
                                    <Plus className="text-[#13ec5b]" size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="font-black uppercase tracking-widest text-xs group-hover:text-[#13ec5b] transition-colors">Add Expertise</p>
                                    <p className="text-[#92c9a4] text-[9px] font-bold uppercase tracking-widest mt-1 opacity-50">Share a new skill</p>
                                </div>
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* modals - Dono Modals ko yahan call kiya gaya hai */}
            
            {/* Expertise Modal */}
            {isModalOpen && (
                <ExpertisePage
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSkillAdded={handleSkillAdded}
                />
            )}

            {/* Logout Confirmation Modal */}
            <LogOut 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={handleLogoutConfirm} 
            />
        </div>
    );
};

// UI Mini Components
const StatBox = ({ label, value }) => (
    <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
        <span className="text-lg font-black dark:text-white tracking-tighter">{value}</span>
        <span className="text-[8px] uppercase tracking-widest text-slate-500 dark:text-[#92c9a4] font-black opacity-60 mt-1">{label}</span>
    </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className={`relative pb-6 flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${active ? 'text-[#13ec5b]' : 'text-slate-500 hover:text-slate-300'}`}>
        {icon} {label}
        {active && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#13ec5b] rounded-full shadow-[0_-2px_15px_rgba(19,236,91,0.6)]"></div>}
    </button>
);

const SkillCard = ({ skill, onDelete }) => (
    <div className="group relative bg-white dark:bg-[#1a2e1f] rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 hover:border-[#13ec5b]/50 transition-all shadow-xl hover:shadow-[#13ec5b]/5">
        <div className="absolute top-4 right-4 z-20 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button 
                className="group/del p-3 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl text-white/70 hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-2xl"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
            >
                <Trash2 size={16} />
            </button>
        </div>

        <div className="h-48 w-full overflow-hidden bg-slate-800 relative">
            <img src={skill.img} alt={skill.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102216] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1.5 bg-[#13ec5b] text-[#102216] text-[9px] font-black uppercase tracking-widest rounded-xl shadow-neon">
                    {skill.level}
                </span>
            </div>
        </div>

        <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-[#13ec5b]/10 rounded-xl text-[#13ec5b]">{skill.icon}</div>
                <span className="text-[9px] uppercase font-black tracking-[0.2em] text-[#92c9a4] opacity-50">Expertise</span>
            </div>
            <h3 className="font-black text-lg text-white uppercase tracking-tight group-hover:text-[#13ec5b] transition-colors mb-4">{skill.title}</h3>
            <div className="flex items-center gap-2 text-[#92c9a4] text-[10px] font-black uppercase tracking-widest bg-white/5 p-3 rounded-2xl border border-white/5">
                <History size={14} className="text-[#13ec5b]" />
                {skill.info}
            </div>
        </div>
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#13ec5b] group-hover:w-full transition-all duration-500" />
    </div>
);

export default Profile;