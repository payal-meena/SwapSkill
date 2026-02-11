import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationModal from '../modals/NotificationModal';
import { getMyProfile } from "../../services/authService.js";
import { useNotifications } from '../../context/NotificationContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserNavbar = ({ userName, onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: userName || "User",
    profileImage: null
  });
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const getImageUrl = (img, name) => {
    if (img) {
      if (img.startsWith('http')) return img;
      return `${API_URL}${img.startsWith('/') ? '' : '/'}${img}`;
    }
    return `https://ui-avatars.com/api/?name=${name}&bg=13ec5b&color=000&bold=true`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getMyProfile();
        if (data) {
          setUserProfile({
            name: data.name || userName,
            profileImage: data.profileImage || null
          });
        }
      } catch (error) {
        console.error("Error fetching profile for navbar:", error);
      }
    };
    fetchUserData();
  }, [userName]);

  return (
    <header className="lg:sticky lg:top-0 z-[60] flex items-center justify-between border-b border-slate-200 dark:border-[#23482f] bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md px-4 sm:px-8 py-4 font-['Lexend'] w-full">
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden flex items-center justify-center rounded-xl h-10 w-10 bg-[#13ec5b]/10 text-[#13ec5b] hover:bg-[#13ec5b]/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined font-bold">menu</span>
        </button>
        <h2 className="text-slate-900 dark:text-white text-base sm:text-xl font-bold tracking-tight truncate">
          Welcome back, <span className="text-[#13ec5b]">{userProfile.name}</span>!
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex gap-2 sm:gap-3 items-center">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center justify-center rounded-xl h-9 w-9 sm:h-10 sm:w-10 bg-slate-100 dark:bg-[#23482f] text-slate-600 dark:text-white hover:bg-slate-200 transition-colors relative"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#13ec5b] text-[#102216] text-[10px] sm:text-xs font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
          </div>
          <div 
            onClick={() => navigate('/my-profile')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#13ec5b] overflow-hidden cursor-pointer hover:scale-105 transition-all shadow-lg shadow-[#13ec5b]/10 bg-slate-800"
          >
            <img 
              src={getImageUrl(userProfile.profileImage, userProfile.name)} 
              alt={userProfile.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${userProfile.name}&bg=13ec5b&color=000&bold=true`; }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;