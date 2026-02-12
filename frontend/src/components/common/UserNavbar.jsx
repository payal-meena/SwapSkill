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

  const { unreadCount, fetchNotifications } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications on mount
    fetchNotifications();
  }, []);

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
        console.error("Navbar profile error:", error);
      }
    };
    fetchUserData();
  }, [userName]);

  return (
    <header className="
      sticky top-0 z-[60] w-full
      flex items-center justify-between
      px-3 sm:px-6 lg:px-8 py-3
      border-b border-slate-200 dark:border-[#23482f]
      bg-white/80 dark:bg-[#102216]/80
      backdrop-blur-md
      font-['Lexend']
    ">
      {/* LEFT */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="
            lg:hidden
            h-11 w-11
            flex items-center justify-center
            rounded-xl
            bg-[#13ec5b]/10 text-[#13ec5b]
            hover:bg-[#13ec5b]/20
            active:scale-95
          "
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <h2 className="
          text-sm sm:text-base lg:text-lg
          font-bold text-slate-900 dark:text-white
          truncate max-w-[180px] sm:max-w-[260px] lg:max-w-none
        ">
          Welcome back,&nbsp;
          <span className="text-[#13ec5b] truncate">
            {userProfile.name}
          </span>
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="
              h-11 w-11
              flex items-center justify-center
              rounded-xl
              bg-slate-100 dark:bg-[#23482f]
              text-slate-600 dark:text-white
              hover:bg-slate-200 dark:hover:bg-[#2f5e41]
            "
          >
            <span className="material-symbols-outlined text-xl">
              notifications
            </span>

            {unreadCount > 0 && (
              <span className="
                absolute -top-1 -right-1
                min-w-[18px] h-[18px]
                flex items-center justify-center
                rounded-full
                bg-[#13ec5b] text-[#102216]
                text-[10px] font-bold
              ">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationModal
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* Profile */}
        <div
          onClick={() => navigate('/my-profile')}
          className="
            h-11 w-11
            rounded-full
            border-2 border-[#13ec5b]
            overflow-hidden
            cursor-pointer
            hover:scale-105
            transition
            bg-slate-800
          "
        >
          <img
            src={getImageUrl(userProfile.profileImage, userProfile.name)}
            alt={userProfile.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${userProfile.name}&bg=13ec5b&color=000&bold=true`;
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
