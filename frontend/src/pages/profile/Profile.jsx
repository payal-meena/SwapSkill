import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Logout ke baad redirect ke liye
import {
    Search, School, BookOpen, Verified, Users, History,
    Edit, Trash2, Share2, Settings, HelpCircle, ShieldCheck, Plus, LogOut as LogOutIcon,
    X, Camera, ChevronRight, Rocket, Star
} from 'lucide-react';
import { skillService } from '../../services/skillService';
import ExpertisePage from './ExpertisePage';
import api from "../../services/api";
import Toast from '../../components/common/Toast';
import Avatar from '../../components/common/Avatar';

import LogOut from '../../components/modals/LogOut';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('teaching');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Logout Modal State
    const [skills, setSkills] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

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

    // Logout function jo confirm hone par chalega
    const handleLogoutConfirm = () => {
        localStorage.removeItem('token'); // Token remove karein
        setIsLogoutModalOpen(false);
        navigate('/login'); // Login page par bhejein
    };

    const showToast = (message, type = 'info') => {
        setToast({ isVisible: true, message, type });
    };

    const hideToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const handleSkillAdded = (skillName) => {
        // Check for duplicate skill
        const isDuplicate = skills.some(skill => 
            skill.title.toLowerCase() === skillName.toLowerCase()
        );
        
        if (isDuplicate) {
            showToast('This Skill already exists!', 'warning');
            return false;
        }
        
        fetchSkills();
        setIsModalOpen(false);
        showToast('Skill successfully added!', 'success');
        return true;
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
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-3 text-[#13ec5b]">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#13ec5b]/10 rounded-lg">
                            <Users size={24} />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">Profile</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Logout Trigger */}
                        <button 
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-[#13ec5b]/20 hover:bg-[#11d652] transition-colors"
                        >
                            <LogOutIcon size={16} /> Log Out
                        </button>
                        <div className="w-10 h-10 rounded-full border-2 border-[#13ec5b]/50 overflow-hidden bg-slate-200">
                            <Avatar src={user?.profileImage} name={user?.name} size="w-10 h-10" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="sticky top-24 flex flex-col gap-6">
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <Avatar 
                                        src={user?.profileImage} 
                                        name={user?.name} 
                                        size="w-24 h-24" 
                                        textSize="text-2xl"
                                        className="border-4 border-[#13ec5b]/20 shadow-xl"
                                    />
                                    <div>
                                        <h1 className="text-2xl font-bold">{user?.name || "USER"}</h1>
                                        <p className="text-[#13ec5b] font-medium tracking-wide">{user?.profession || "No fields available."}</p>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        {user?.bio || "No bio available."}
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-8">
                                    <StatBox label="Rating" value="5.0" />
                                    <StatBox label="Swaps" value="24" />
                                    <StatBox label="Skills" value={skills.length} />
                                </div>
                                <div className="mt-8">
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#13ec5b]/10 text-[#13ec5b] border border-[#13ec5b]/20 hover:bg-[#13ec5b] hover:text-[#102216] transition-all font-bold text-sm">
                                        <Share2 size={18} /> Share Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

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

            {/* Modals */}
            {isModalOpen && (
                <ExpertisePage
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSkillAdded={handleSkillAdded}
                    existingSkills={skills}
                />
            )}

            {/* Logout Modal Integration */}
            <LogOut 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={handleLogoutConfirm}
            />
            
            {/* Toast Notification */}
            <Toast 
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    );
};

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

const SkillCard = ({ skill, onDelete }) => (
    <div className="group relative bg-white dark:bg-[#1a2e1f] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-[#13ec5b]/50 transition-all shadow-lg hover:shadow-[#13ec5b]/5">
        
        <div className="absolute top-3 right-3 z-20 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button 
                className="group/del p-2.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-xl text-white/70 hover:text-white hover:bg-red-500/80 hover:border-red-500 transition-all shadow-xl hover:shadow-red-500/20 active:scale-90"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
            >
                <Trash2 size={16} className="group-hover/del:scale-110" />
            </button>
        </div>

        <div className="h-44 w-full overflow-hidden bg-slate-800 relative">
            <img src={skill.img} alt={skill.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-3 right-3">
                <span className="px-2.5 py-1 bg-[#13ec5b] text-[#102216] text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                    {skill.level}
                </span>
            </div>
        </div>

        <div className="p-5">
            <div className="flex items-center gap-2 mb-2 text-[#13ec5b]">
                <div className="p-1.5 bg-[#13ec5b]/10 rounded-lg">
                    {skill.icon}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400">Expertise</span>
            </div>
            
            <h3 className="font-bold text-lg leading-tight group-hover:text-[#13ec5b] transition-colors mb-2 uppercase tracking-tight">
                {skill.title}
            </h3>
            
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-300 text-xs font-medium bg-slate-100 dark:bg-white/5 p-2 rounded-lg">
                <History size={14} className="text-[#13ec5b]" />
                {skill.info}
            </div>
        </div>

        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#13ec5b] group-hover:w-full transition-all duration-500"></div>
    </div>
);

export default Profile;