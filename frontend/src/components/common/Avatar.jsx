import React from 'react';

// Vite environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Avatar = ({ 
  src, 
  name = "User", 
  size = "w-10 h-10", 
  textSize = "text-sm",
  className = "",
  onClick
}) => {

  // ✅ 2-Letter Logic: Name + Surname ya Single Name ke first 2 letters
  const getInitials = (userName) => {
    if (!userName) return "U";
    
    const parts = userName.trim().split(/\s+/); // Name ko spaces se divide karo
    
    if (parts.length >= 2) {
      // Case 1: Agar Surname hai (e.g., "Rahul Sharma" -> "RS")
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    } else {
      // Case 2: Agar sirf ek naam hai (e.g., "Rahul" -> "RA")
      return userName.length >= 2 
        ? userName.substring(0, 2).toUpperCase() 
        : userName.toUpperCase();
    }
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('blob:') || img.startsWith('http')) return img;
    return `${API_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  const finalSrc = getImageUrl(src);

  // Profile Photo View
  if (finalSrc && !src.includes('dicebear.com')) {
    return (
      <div 
        className={`${size} rounded-full overflow-hidden border-2 border-[#1a3323] shrink-0 ${className} ${onClick ? 'cursor-pointer' : ''}`} 
        onClick={onClick}
      >
        <img 
          src={finalSrc} 
          alt={name} 
          className="w-full h-full object-cover" 
          onError={(e) => { 
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // ✅ AAPKA SPECIFIC UI: Grey BG, Black Text, Two Letters
  return (
    <div 
      className={`${size} rounded-full flex items-center justify-center bg-[#d9d9d9] text-black font-bold border-2 border-[#1a3323] shrink-0 ${textSize} ${className} ${onClick ? 'cursor-pointer' : ''}`} 
      onClick={onClick}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;