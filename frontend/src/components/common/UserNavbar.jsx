import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationModal from '../modals/NotificationModal';
import { getMyProfile } from "../../services/authService.js";
import { useNotifications } from '../../context/NotificationContext';
import UserSidebar from './UserSidebar'; 

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserNavbar = ({ userName }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* --- MOBILE SIDEBAR DRAWER (Direct UserSidebar) --- */}
      <div className={`fixed inset-0 z-[1000] lg:hidden transition-all duration-300 ${isSidebarOpen ? "visible" : "invisible"}`}>
        
        {/* Backdrop / Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        
        {/* Sidebar Panel: Yahan se Header (Menu/Close) hata diya gaya hai */}
        <div className={`absolute inset-y-0 left-0 w-[280px] bg-[#102216] shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="h-full overflow-y-auto">
            {/* Direct UserSidebar Call */}
            <UserSidebar isMobile={true} closeSidebar={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      </div>

      {/* --- MAIN NAVBAR --- */}
      <header className="sticky top-0 z-[100] flex items-center justify-between border-b border-slate-200 dark:border-[#23482f] bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md px-4 sm:px-8 py-4 font-['Lexend'] w-full">
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Hamburger Icon */}
          <button 
            onClick={() => setIsSidebarOpen(true)} 
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
            {/* Notifications */}
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

            {/* Profile */}
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
    </>
  );
};

export default UserNavbar;