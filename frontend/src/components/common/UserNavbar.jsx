import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationModal from '../modals/NotificationModal';
import { getMyProfile } from "../../services/authService.js";

const UserNavbar = ({ userName }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: userName || "User",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  });
  const navigate = useNavigate();

  // Profile data fetch karne ke liye useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getMyProfile();
        if (data) {
          setUserProfile({
            name: data.name || userName,
            profileImage: data.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name || 'User'}`
          });
        }
      } catch (error) {
        console.error("Error fetching profile for navbar:", error);
      }
    };
    fetchUserData();
  }, [userName]);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 dark:border-[#23482f] bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md px-8 py-4 font-['Lexend']">
      <div className="flex items-center gap-4">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">
          Welcome back, <span className="text-[#13ec5b]">{userProfile.name}</span>!
        </h2>
      </div>

      <div className="flex items-center gap-6">
       

        <div className="flex gap-3 items-center">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-[#23482f] text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-[#326744] transition-colors relative cursor-pointer"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-[#13ec5b]"></span>
            </button>

            <NotificationModal 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)} 
            />
          </div>

          {/* Profile Image - Ab ye Account section se aa rahi hai */}
          <div className="group relative">
            <div className="h-10 w-10 rounded-full border-2 border-[#13ec5b] overflow-hidden ml-2 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-[#13ec5b]/10">
              <img 
                className="w-full h-full object-cover" 
                src={userProfile.profileImage} 
                alt="Profile"
                onClick={() => navigate('/my-profile')} 
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;