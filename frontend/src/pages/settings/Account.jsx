import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, Trash2, Mail, Lock, ShieldCheck, Camera, Github, Globe, Briefcase, FileText, ChevronDown, ChevronUp, Instagram, Facebook, Ghost, Twitter, Link as LinkIcon, ExternalLink, Edit3, Check, X, ArrowLeft } from 'lucide-react';
import { getMyProfile } from "../../services/authService.js";
import api from "../../services/api";
import AccountModal from "./AccountModal"; 

// Vite environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Account = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); 
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [profileVisible, setProfileVisible] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    snapchat: '',
    github: '',
    twitter: ''
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    onConfirm: null
  });

  const [activeTab, setActiveTab] = useState(null);

  // Helper function for consistent image paths
  const getImageUrl = (img, name) => {
    if (img) {
      if (img.startsWith('blob:')) return img;
      if (img.startsWith('http')) return img;
      return `${API_URL}${img.startsWith('/') ? '' : '/'}${img}`;
    }
    return `https://ui-avatars.com/api/?name=${name}&bg=13ec5b&color=000&bold=true`;
  };

  const showModal = (type, title, message, onConfirm = null) => {
    setModalConfig({ isOpen: true, type, title, message, onConfirm });
  };

  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });
  const toggleTab = (tab) => setActiveTab(activeTab === tab ? null : tab);
  const canSavePassword = passwords.next.length >= 8 && passwords.next === passwords.confirm && passwords.current.length > 0;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setUserName(data.name || "User");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setProfession(data.profession || "");
        
        if (data.profileImage) {
          setPreviewImage(getImageUrl(data.profileImage, data.name));
        }
        
        setSocialLinks(data.socialLinks || { instagram: '', facebook: '', snapchat: '', github: '', twitter: '' });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await api.put('/users/me', { email, bio, profession, socialLinks });
      showModal('success', 'Profile Updated', 'All changes have been saved.');
      setActiveTab(null); 
    } catch (error) {
      showModal('error', 'Update Failed', error.response?.data?.message || "Failed to update profile.");
    }
    setIsUpdating(false);
  };

  const handleSavePassword = async () => {
    try {
      await api.put('/users/password', { currentPassword: passwords.current, newPassword: passwords.next });
      showModal('success', 'Password Changed', 'Security settings updated.');
      setPasswords({ current: '', next: '', confirm: '' });
      setActiveTab(null);
    } catch (error) {
      showModal('error', 'Auth Error', error.response?.data?.message || "Current password is wrong.");
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return showModal('error', 'Selection Required', 'Please select an image first.');
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", profileImage);
      const res = await api.put("/users/profile-image", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      const newPath = getImageUrl(res.data.user.profileImage, userName);
      setPreviewImage(newPath);
      showModal('success', 'Upload Complete', 'Your profile picture is updated.');
      setProfileImage(null);
    } catch (error) {
      showModal('error', 'Upload Failed', 'Could not save your image.');
    }
    setIsUploading(false);
  };

  const handleDeleteProfileImage = async () => {
    setIsUpdating(true);
    try {
      await api.delete('/users/profile-image');
      setPreviewImage(getImageUrl(null, userName)); 
      setProfileImage(null);
      showModal('success', 'Removed', 'Profile image has been removed.');
    } catch (error) {
      showModal('error', 'Error', "Failed to delete image.");
    }
    setIsUpdating(false);
  };

  const handleConnect = (url) => {
    if (!url) return showModal('error', 'No Link Found', 'Please add a link first.');
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(formattedUrl, '_blank');
  };

  const startEdit = (field, currentVal) => {
    setEditingField(field);
    setTempValue(currentVal || "");
  };

  const saveTempLink = (field) => {
    setSocialLinks({ ...socialLinks, [field]: tempValue });
    setEditingField(null);
  };

  if (loading) return (
    <div className="w-full flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13ec5b]"></div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-8 animate-in fade-in duration-700 font-['Lexend']">
      
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Go back to profile"
        >
          <ArrowLeft size={24} className="text-slate-900 dark:text-white" />
        </button>
        <div>
          <h2 className="text-3xl font-bold dark:text-white text-slate-900">Account Settings</h2>
          <p className="text-slate-500 dark:text-[#92c9a4]">Update your profile and social presence.</p>
        </div>
      </div>

      {/* 1. Photo Section */}
      <section className="bg-white dark:bg-[#112217] rounded-3xl border border-slate-200 dark:border-[#23482f] p-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="h-36 w-36 rounded-full border-4 border-[#13ec5b] overflow-hidden bg-slate-900 shadow-xl flex items-center justify-center">
               <img 
                src={previewImage || getImageUrl(null, userName)} 
                alt={userName}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = getImageUrl(null, userName); }}
              />
            </div>
            <input 
              type="file" 
              accept="image/*" 
              id="profileImageInput" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) { 
                  setProfileImage(file); 
                  setPreviewImage(URL.createObjectURL(file)); 
                }
            }} />
            <button 
              onClick={() => document.getElementById("profileImageInput").click()} 
              className="absolute bottom-1 right-2 bg-[#13ec5b] p-3 rounded-full text-[#102216] hover:scale-110 shadow-lg border-4 border-[#112217] transition-all"
            >
              <Camera size={20} />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold dark:text-white mb-6">{userName}</h4>
            <div className="flex gap-4 justify-center md:justify-start">
              <button 
                onClick={uploadProfileImage} 
                disabled={isUploading || !profileImage} 
                className="text-sm font-bold px-6 py-3 bg-[#13ec5b] text-[#102216] rounded-xl disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-[#13ec5b]/20"
              >
                {isUploading ? 'Uploading...' : 'Save New Photo'}
              </button>
              <button 
                onClick={handleDeleteProfileImage} 
                className="text-sm font-bold px-6 py-3 text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-xl transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Accordions */}
      <div className="space-y-4">
        {/* General Settings */}
        <div className="bg-white dark:bg-[#112217] rounded-3xl border border-slate-200 dark:border-[#23482f] overflow-hidden">
          <button onClick={() => toggleTab('general')} className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-[#1a3323] transition-colors">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-slate-100 dark:bg-[#23482f] rounded-2xl"><UserCog className="text-[#13ec5b]" size={24} /></div>
              <div className="text-left"><span className="block font-bold text-lg dark:text-white">General Settings</span><span className="text-xs text-slate-500">Email, Profession, and Bio</span></div>
            </div>
            {activeTab === 'general' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          <div className={`transition-all duration-300 ${activeTab === 'general' ? 'max-h-[1000px] p-8 pt-2 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] dark:text-white outline-none border border-transparent focus:border-[#13ec5b]/30" placeholder="Email Address" />
              <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] dark:text-white outline-none border border-transparent focus:border-[#13ec5b]/30" placeholder="Profession (e.g. Developer)" />
            </div>
            <textarea rows="4" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] dark:text-white outline-none mb-6 border border-transparent focus:border-[#13ec5b]/30" placeholder="Tell us about yourself..." />
            <div className="flex justify-end p-2">
              <button onClick={handleUpdateProfile} disabled={isUpdating} className="px-8 py-3 bg-[#13ec5b] text-[#102216] font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-[#13ec5b]/20">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

         <div className="bg-white dark:bg-[#112217] rounded-3xl border border-slate-200 dark:border-[#23482f] overflow-hidden">
          <button onClick={() => toggleTab('security')} className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-[#1a3323] transition-colors">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-slate-100 dark:bg-[#23482f] rounded-2xl"><Lock className="text-[#13ec5b]" size={24} /></div>
              <div className="text-left"><span className="block font-bold text-lg dark:text-white">Security</span><span className="text-xs text-slate-500">Password management</span></div>
            </div>
            {activeTab === 'security' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          <div className={`transition-all duration-300 ${activeTab === 'security' ? 'max-h-[600px] p-8 pt-2 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
            <input type="password" placeholder="Current Password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full md:w-1/2 px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] dark:text-white outline-none mb-4 block border border-transparent focus:border-[#13ec5b]/30" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input type="password" placeholder="New Password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] dark:text-white outline-none border border-transparent focus:border-[#13ec5b]/30" />
              <input type="password" placeholder="Confirm New Password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] dark:text-white outline-none border border-transparent focus:border-[#13ec5b]/30" />
            </div>
            <button disabled={!canSavePassword} onClick={handleSavePassword} className="px-10 py-3.5 bg-[#13ec5b] text-[#102216] font-bold rounded-xl disabled:opacity-30 active:scale-95 transition-all">Update Password</button>
          </div>
        </div>

        {/* Social Presence Section */}
        <div className="bg-white dark:bg-[#112217] rounded-3xl border border-slate-200 dark:border-[#23482f] overflow-hidden shadow-sm">
          <button onClick={() => toggleTab('social')} className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-[#1a3323] transition-colors">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-slate-100 dark:bg-[#23482f] rounded-2xl"><ShieldCheck className="text-[#13ec5b]" size={24} /></div>
              <div className="text-left"><span className="block font-bold text-lg dark:text-white">Social Presence</span><span className="text-xs text-slate-500">Connect your profiles</span></div>
            </div>
            {activeTab === 'social' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          <div className={`transition-all duration-300 ${activeTab === 'social' ? 'max-h-[1200px] opacity-100 p-8 pt-2' : 'max-h-0 overflow-hidden opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { id: 'instagram', icon: <Instagram className="text-pink-500" />, label: 'Instagram' },
                { id: 'facebook', icon: <Facebook className="text-blue-600" />, label: 'Facebook' },
                { id: 'snapchat', icon: <Ghost className="text-yellow-500" />, label: 'Snapchat' },
                { id: 'github', icon: <Github className="dark:text-white" />, label: 'GitHub' },
                { id: 'twitter', icon: <Twitter className="text-sky-500" />, label: 'Twitter / X' }
              ].map((social) => (
                <div key={social.id} className="p-4 rounded-2xl border border-slate-100 dark:border-[#23482f] bg-slate-50/50 dark:bg-[#1a3323]/20 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {social.icon}
                      <span className="text-sm font-bold dark:text-white">{social.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleConnect(socialLinks[social.id])} className="px-3 py-1.5 bg-[#13ec5b]/10 text-[#13ec5b] rounded-lg text-xs font-bold hover:bg-[#13ec5b] hover:text-[#102216] transition-all">
                        Connect
                      </button>
                      <button onClick={() => startEdit(social.id, socialLinks[social.id])} className="p-1.5 text-slate-400 hover:text-[#13ec5b]">
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </div>
                  {editingField === social.id ? (
                    <div className="flex items-center gap-2 animate-in slide-in-from-top-1">
                      <input type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="flex-1 px-3 py-2 bg-white dark:bg-[#23482f] dark:text-white rounded-lg text-xs outline-none border border-[#13ec5b]/30" placeholder="Link here..." />
                      <button onClick={() => saveTempLink(social.id)} className="p-2 bg-[#13ec5b] text-[#102216] rounded-lg"><Check size={14} /></button>
                      <button onClick={() => setEditingField(null)} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><X size={14} /></button>
                    </div>
                  ) : socialLinks[social.id] && (
                    <p className="text-[10px] text-slate-400 truncate px-1 italic">{socialLinks[social.id]}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end p-2">
              <button onClick={handleUpdateProfile} disabled={isUpdating} className="px-8 py-3 bg-[#13ec5b] text-[#102216] font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-[#13ec5b]/20">
                Update Social Links
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
       
      </div>

      <AccountModal {...modalConfig} onClose={closeModal} />

      {/* Delete Footer */}
      <div className="pt-8 border-t border-slate-200 dark:border-[#23482f] flex justify-between items-center">
        <p className="text-sm text-slate-500">Caution: This cannot be undone.</p>
        <button onClick={() => showModal('delete', 'Delete Account?', 'Proceed to permanently delete your data?', () => api.delete("/users/me").then(() => { localStorage.removeItem("token"); window.location.href = "/login"; }))} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-500 font-bold hover:bg-red-500/10 transition-all active:scale-95">
          <Trash2 size={18} /> Delete Account
        </button>
      </div>
    </div>
  );
};

export default Account;