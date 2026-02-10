import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationModal from '../modals/NotificationModal';
import { getMyProfile } from "../../services/authService";
import { useNotifications } from '../../context/NotificationContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserNavbar = ({ userName, openSidebar }) => {
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
      return `${API_URL}${img}`;
    }
    return `https://ui-avatars.com/api/?name=${name}&bg=13ec5b&color=000&bold=true`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getMyProfile();
      if (data) {
        setUserProfile({
          name: data.name,
          profileImage: data.profileImage
        });
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="sticky top-0 z-[100] flex items-center justify-between px-4 sm:px-8 py-4 bg-white dark:bg-[#102216] border-b dark:border-[#23482f]">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* HAMBURGER */}
        <button
          onClick={openSidebar}
          className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-[#13ec5b]/10 text-[#13ec5b]"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <h2 className="font-bold text-slate-900 dark:text-white">
          Welcome, <span className="text-[#13ec5b]">{userProfile.name}</span>
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* NOTIFICATION */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-[#23482f] flex items-center justify-center"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#13ec5b] text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationModal
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* PROFILE */}
        <div
          onClick={() => navigate('/my-profile')}
          className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#13ec5b] cursor-pointer"
        >
          <img
            src={getImageUrl(userProfile.profileImage, userProfile.name)}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
