import React, { useState, useRef } from "react";
import {
    ShieldCheck, Activity, Users, AlertTriangle, Database, Bell, Settings,
    LogOut, Terminal, CheckCircle2, BarChart3, RefreshCcw,
    Camera, Save, X, Lock, User, Search, Eye, EyeOff, Globe, Shield
} from "lucide-react";

const AdminProfile = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);

    // --- States ---
    const [adminData, setAdminData] = useState({
        name: "Alex Rivera",
        role: "SUPER ADMIN",
        bio: "Managing the SwapSkill ecosystem. Focused on platform integrity and user growth.",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AdminAlex",
        isVisible: true,
    });

    const [passwords, setPasswords] = useState({ new: "" });
    const fileInputRef = useRef(null);

    // --- Handlers ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAdminData({ ...adminData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleToggleVisibility = () => {
        setAdminData(prev => ({ ...prev, isVisible: !prev.isVisible }));
    };

    const stats = [
        { label: "TOTAL SWAPPERS", value: "1,284", icon: <Users size={18} />, color: "text-blue-400" },
        { label: "ACTIVE SWAPS", value: "432", icon: <RefreshCcw size={18} />, color: "text-[#13ec5b]" },
        { label: "VERIFICATIONS", value: "18", icon: <ShieldCheck size={18} />, color: "text-yellow-400" },
        { label: "REPORTS", value: "3", icon: <AlertTriangle size={18} />, color: "text-red-400" },
    ];

    return (
        <div className="min-h-screen bg-[#050a06] text-white font-['Lexend']">

            {/* 1. Updated Header - Heading: Admin Profile */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#102216]/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-tight text-white uppercase">Admin Profile</h1>
                        <p className="text-[10px] text-[#13ec5b] font-bold tracking-[0.2em]">MANAGE YOUR ACCOUNT SETTINGS</p>
                    </div>

                   
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* 2. Sidebar */}
                    <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-[#102216] border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
                            <div className="flex flex-col items-center text-center gap-5 relative z-10">
                                <div className="relative group cursor-pointer">
                                    <div className="size-32 rounded-[2.5rem] border-2 border-[#13ec5b] p-1.5 overflow-hidden transition-transform duration-500 group-hover:scale-95 shadow-[0_0_20px_rgba(19,236,91,0.2)]">
                                        <img src={adminData.avatar} alt="Admin" className="size-full object-cover rounded-[2.2rem]" />
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute inset-0 bg-black/60 rounded-[2.2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Camera className="text-[#13ec5b]" size={28} />
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                                </div>

                                <div className="w-full">
                                    {isEditing ? (
                                        <input
                                            autoFocus
                                            className="w-full bg-white/5 border border-[#13ec5b]/30 rounded-xl px-4 py-2 text-center text-lg font-bold text-white focus:border-[#13ec5b] outline-none"
                                            value={adminData.name}
                                            onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-black tracking-tight text-white">{adminData.name}</h2>
                                    )}
                                    <p className="text-[#13ec5b] text-[10px] font-black uppercase tracking-[0.3em] mt-2 bg-[#13ec5b]/10 py-1 rounded-full">{adminData.role}</p>
                                </div>

                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`w-full py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isEditing ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-[#13ec5b]/10 text-[#13ec5b] border border-[#13ec5b]/20 hover:bg-[#13ec5b] hover:text-[#102216]'
                                        }`}
                                >
                                    {isEditing ? <><Save size={16} /> Save Changes</> : <><Settings size={16} /> Edit Profile</>}
                                </button>
                            </div>
                        </div>

                        {/* Password Security */}
                        <div className="bg-[#102216] border border-white/10 rounded-[2.5rem] p-8 space-y-5 shadow-xl">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-3">
                                <Lock size={14} className="text-[#13ec5b]" /> Password Security
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-[1.2rem] px-5 py-3 text-xs text-white focus:border-[#13ec5b] outline-none transition-all"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                />
                                <button className="w-full bg-[#13ec5b]/10 hover:bg-[#13ec5b] text-[#13ec5b] hover:text-[#102216] py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all border border-[#13ec5b]/20">
                                    Update Password
                                </button>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="bg-[#102216] border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-3">
                                <Shield size={14} className="text-[#13ec5b]" /> Preferences
                            </h3>
                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    {adminData.isVisible ? <Eye size={18} className="text-[#13ec5b]" /> : <EyeOff size={18} className="text-red-400" />}
                                    <span className="text-xs font-bold text-white/80 uppercase tracking-tighter">Public Visibility</span>
                                </div>
                                <button
                                    onClick={handleToggleVisibility}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${adminData.isVisible ? 'bg-[#13ec5b]' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 size-4 bg-white rounded-full transition-all shadow-md ${adminData.isVisible ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* 3. Main Dashboard Content */}
                    <section className="flex-1 space-y-10">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                            {stats.map((s, i) => (
                                <div key={i} className="bg-[#102216] border border-white/10 p-6 rounded-[2.5rem] group hover:border-[#13ec5b]/40 transition-all duration-500 shadow-xl">
                                    <div className={`size-12 rounded-2xl bg-white/5 flex items-center justify-center mb-5 ${s.color} group-hover:scale-110 transition-transform`}>{s.icon}</div>
                                    <p className="text-3xl font-black mb-1">{s.value}</p>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-10 border-b border-white/10 px-4">
                            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Activity size={18} />} label="System" />
                            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="Swappers" />
                        </div>

                        {/* Content Area */}
                        <div className="min-h-[400px]">
                            {activeTab === 'overview' ? (
                                <div className="bg-[#102216] rounded-[3rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-12">
                                        <h3 className="text-xl font-black flex items-center gap-4 uppercase tracking-tight text-white">
                                            <BarChart3 className="text-[#13ec5b]" /> Analytics Overview
                                        </h3>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-[#13ec5b]/10 rounded-full border border-[#13ec5b]/20">
                                            <div className="size-2 bg-[#13ec5b] rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black text-[#13ec5b]">LIVE STATUS</span>
                                        </div>
                                    </div>
                                    <div className="h-48 flex items-end gap-4 px-2">
                                        {[60, 30, 80, 45, 95, 100, 65, 85, 40, 70].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-[#13ec5b]/5 via-[#13ec5b]/40 to-[#13ec5b] rounded-2xl transition-all hover:opacity-80 cursor-pointer" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#102216] rounded-[3rem] border border-white/10 p-20 text-center">
                                    <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Users size={40} className="text-[#13ec5b] opacity-50" />
                                    </div>
                                    <h4 className="text-xl font-black uppercase mb-2">User Database</h4>
                                    <p className="text-white/40 text-sm max-w-xs mx-auto">Access and manage all registered skill swappers across the platform.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

// --- Custom Tab Button ---
const TabButton = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className={`relative pb-6 flex items-center gap-3 font-black transition-all text-[11px] uppercase tracking-[0.2em] ${active ? 'text-[#13ec5b]' : 'text-white/40 hover:text-white'}`}>
        {icon} {label}
        {active && (
            <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#13ec5b] rounded-t-full shadow-[0_0_15px_rgba(19,236,91,0.8)]" />
        )}
    </button>
);

export default AdminProfile;