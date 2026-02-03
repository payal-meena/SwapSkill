import React, { useState, useEffect } from 'react';
import { UserCog, Trash2, Mail, Lock, ShieldCheck, Camera, Github, Globe, Briefcase, FileText, ChevronDown, ChevronUp, Instagram, Facebook, Ghost, Twitter, Link as LinkIcon, ExternalLink, Edit3, Check, X } from 'lucide-react';
import { getMyProfile } from "../../services/authService.js";
import api from "../../services/api";
import AccountModal from "./AccountModal"; 
import Avatar from "../../components/common/Avatar";

const Account = () => {
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
        setPreviewImage(data.profileImage || null);
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
      showModal('success', 'Profile Updated', 'Your changes and social links have been saved.');
      setActiveTab(null); 
    } catch (error) {
      showModal('error', 'Update Failed', error.response?.data?.message || "Failed to update profile.");
    }
    setIsUpdating(false);
  };

  const handleSavePassword = async () => {
    try {
      await api.put('/users/password', { currentPassword: passwords.current, newPassword: passwords.next });
      showModal('success', 'Password Changed', 'Your account security has been updated.');
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
      setPreviewImage(res.data.user.profileImage);
      showModal('success', 'Upload Complete', 'Your new profile picture is now live.');
      setProfileImage(null);
    } catch (error) {
      showModal('error', 'Upload Failed', 'We could not save your image.');
    }
    setIsUploading(false);
  };

  const deleteAccountFinal = async () => {
    try {
      await api.delete("/users/me");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      showModal('error', 'Action Failed', 'Could not delete account. Try again later.');
    }
  };

  const confirmDelete = () => {
    showModal('delete', 'Delete Account?', 'This will permanently remove all your data. Proceed?', deleteAccountFinal);
  };

  const handleConnect = (url) => {
    if (!url) {
        showModal('error', 'No Link Found', 'Please edit and add a link first.');
        return;
    }
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(formattedUrl, '_blank');
  };

  const startEdit = (field, currentVal) => {
    setEditingField(field);
    setTempValue(currentVal);
  };

  const saveTempLink = (field) => {
    setSocialLinks({ ...socialLinks, [field]: tempValue });
    setEditingField(null);
  };

  const handleDeleteProfileImage = async () => {
    setIsUpdating(true);
    try {
      await api.delete('/users/profile-image');
      setPreviewImage(null); 
      setProfileImage(null);
      showModal('success', 'Profile Image Removed', 'Your profile image has been removed.');
      setActiveTab(null);
    } catch (error) {
      showModal('error', 'Image Delete Failed', error.response?.data?.message || "Failed to delete profile image.");
    }
    setIsUpdating(false);
  };

  if (loading) return (
    <div className="w-full flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13ec5b]"></div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-8 animate-in fade-in duration-700 font-['Lexend']">
      
      <div className="mb-4">
        <h2 className="text-3xl font-bold dark:text-white text-slate-900">Account Settings</h2>
        <p className="text-slate-500 dark:text-[#92c9a4]">Update your profile and security preferences.</p>
      </div>

      {/* 1. Photo Section */}
      <section className="bg-white dark:bg-[#112217] rounded-3xl border border-slate-200 dark:border-[#23482f] p-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="h-32 w-32 rounded-full border-4 border-[#13ec5b] overflow-hidden bg-slate-100 shadow-xl flex items-center justify-center">
              {/* FIXED: Added text-5xl and font-bold for big initials */}
               <Avatar 
                src={previewImage} 
                name={userName} 
                size="w-full h-full" 
                className="rounded-none border-none text-5xl font-bold flex items-center justify-center uppercase" 
              />
            </div>
            <input type="file" accept="image/*" id="profileImageInput" className="hidden" onChange={(e) => {
                const file = e.target.files[0];
                if (file) { 
                  setProfileImage(file); 
                  setPreviewImage(URL.createObjectURL(file)); 
                }
            }} />
            <button onClick={() => document.getElementById("profileImageInput").click()} className="absolute bottom-1 right-1 bg-[#13ec5b] p-3 rounded-full text-[#102216] hover:scale-110 transition-transform shadow-lg"><Camera size={20} /></button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold dark:text-white mb-4">Profile Photo</h4>
            <div className="flex gap-4 justify-center md:justify-start">
              <button onClick={uploadProfileImage} disabled={isUploading || !profileImage} className="text-sm font-bold px-6 py-3 bg-[#13ec5b] text-[#102216] rounded-xl disabled:opacity-50 shadow-lg">{isUploading ? 'Uploading...' : 'Save New Photo'}</button>
              <button onClick={handleDeleteProfileImage } className="text-sm font-bold px-6 py-3 text-red-500 border border-red-500/20 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-xl">Remove</button>
            </div>
          </div>
        </div>
      </section>

      {/* Accordions */}
      <div className="space-y-4">
        {/* General Settings */}
        <div className="bg-white dark:bg-[#112217] rounded-3xl border border-slate-200 dark:border-[#23482f] overflow-hidden">
          <button onClick={() => toggleTab('general')} className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-[#1a3323]">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-slate-100 dark:bg-[#23482f] rounded-2xl"><UserCog className="text-[#13ec5b]" size={24} /></div>
              <div className="text-left"><span className="block font-bold text-lg dark:text-white">General Settings</span><span className="text-xs text-slate-500">Email, Profession, and Bio</span></div>
            </div>
            {activeTab === 'general' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          <div className={`transition-all duration-300 ${activeTab === 'general' ? 'max-h-[1000px] p-8 pt-2 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] text-white outline-none" placeholder="Email" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Professional Title</label>
                <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] text-white outline-none" placeholder="e.g. Full Stack Developer" />
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">About Bio</label>
              <textarea rows="4" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] text-white outline-none" placeholder="Short Bio" />
            </div>
            <div className="flex justify-between items-center p-5 bg-slate-50 dark:bg-[#23482f]/20 rounded-2xl">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold dark:text-white">Profile Visibility</span>
                <Toggle checked={profileVisible} onChange={() => setProfileVisible(!profileVisible)} />
              </div>
              <button onClick={handleUpdateProfile} disabled={isUpdating} className="px-8 py-3 bg-[#13ec5b] text-[#102216] font-bold rounded-xl active:scale-95 disabled:opacity-50">{isUpdating ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-[#112217] rounded-3xl border border-slate-200 dark:border-[#23482f] overflow-hidden shadow-sm">
          <button onClick={() => toggleTab('security')} className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-[#1a3323] transition-colors">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-slate-100 dark:bg-[#23482f] rounded-2xl"><Lock className="text-[#13ec5b]" size={24} /></div>
              <div className="text-left">
                  <span className="block font-bold text-lg dark:text-white text-slate-900">Security</span>
                  <span className="text-xs text-slate-500 dark:text-[#92c9a4]">Password Management</span>
              </div>
            </div>
            {activeTab === 'security' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          <div className={`transition-all duration-300 ease-in-out ${activeTab === 'security' ? 'max-h-[800px] opacity-100 p-8 pt-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <input type="password" placeholder="Current Password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full md:w-1/2 px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] text-white outline-none mb-6 block" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <input type="password" placeholder="New Password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] text-white outline-none" />
              <input type="password" placeholder="Confirm New Password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#23482f] text-white outline-none" />
            </div>
            <button disabled={!canSavePassword} onClick={handleSavePassword} className="px-10 py-3.5 bg-[#13ec5b] text-[#102216] font-bold rounded-xl disabled:opacity-30 active:scale-95 transition-transform">Update Password</button>
          </div>
        </div>

        {/* Linked Accounts - Social Presence */}
        <div className="bg-white dark:bg-[#112217] rounded-3xl border border-slate-200 dark:border-[#23482f] overflow-hidden shadow-sm">
          <button onClick={() => toggleTab('connections')} className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-[#1a3323] transition-colors">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-slate-100 dark:bg-[#23482f] rounded-2xl"><ShieldCheck className="text-[#13ec5b]" size={24} /></div>
              <div className="text-left">
                  <span className="block font-bold text-lg dark:text-white text-slate-900">Social Presence</span>
                  <span className="text-xs text-slate-500 dark:text-[#92c9a4]">Connect and edit your links</span>
              </div>
            </div>
            {activeTab === 'connections' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          <div className={`transition-all duration-300 ease-in-out ${activeTab === 'connections' ? 'max-h-[1200px] opacity-100 p-8 pt-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            
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
                      <button 
                        onClick={() => handleConnect(socialLinks[social.id])}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#13ec5b]/10 text-[#13ec5b] rounded-lg text-xs font-bold hover:bg-[#13ec5b] hover:text-[#102216] transition-all"
                      >
                        <ExternalLink size={14} /> Connect
                      </button>
                      <button 
                        onClick={() => startEdit(social.id, socialLinks[social.id])}
                        className="p-1.5 text-slate-400 hover:text-[#13ec5b] transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </div>

                  {editingField === social.id && (
                    <div className="flex items-center gap-2 mt-1 animate-in slide-in-from-top-1 duration-200">
                      <input 
                        type="text" 
                        value={tempValue} 
                        onChange={(e) => setTempValue(e.target.value)}
                        placeholder="Paste URL here..."
                        className="flex-1 px-3 py-2 bg-white dark:bg-[#23482f] dark:text-white rounded-lg text-xs outline-none border border-[#13ec5b]/30 focus:border-[#13ec5b]"
                      />
                      <button onClick={() => saveTempLink(social.id)} className="p-2 bg-[#13ec5b] text-[#102216] rounded-lg"><Check size={14} /></button>
                      <button onClick={() => setEditingField(null)} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><X size={14} /></button>
                    </div>
                  )}
                  {!editingField && socialLinks[social.id] && (
                    <p className="text-[10px] text-slate-400 truncate px-1 italic">{socialLinks[social.id]}</p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-[#23482f]">
                <button 
                  onClick={handleUpdateProfile} 
                  disabled={isUpdating}
                  className="px-8 py-3 bg-[#13ec5b] text-[#102216] font-bold rounded-xl active:scale-95 shadow-lg shadow-[#13ec5b]/20"
                >
                  {isUpdating ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>
          </div>
        </div>
      </div>

      <AccountModal 
        {...modalConfig} 
        onClose={closeModal} 
      />

      {/* Delete Footer */}
      <div className="pt-8 border-t border-slate-200 dark:border-[#23482f] flex flex-col md:flex-row gap-4 justify-between items-center">
        <p className="text-sm text-slate-500">Dangerous area: This action cannot be undone.</p>
        <button onClick={confirmDelete} className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all text-sm font-bold active:scale-95">
          <Trash2 size={20} />
          Delete Account Permanently
        </button>
      </div>
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <div onClick={onChange} className={`relative inline-flex h-6 w-12 cursor-pointer items-center rounded-full transition-colors ${checked ? 'bg-[#13ec5b]' : 'bg-slate-300 dark:bg-[#23482f]'}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
  </div>
);

export default Account;