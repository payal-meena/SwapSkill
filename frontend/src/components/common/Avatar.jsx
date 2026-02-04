import React from 'react';

const Avatar = ({ 
  src, 
  name = "User", 
  size = "w-10 h-10", 
  textSize = "text-sm",
  className = "",
  onClick
}) => {
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const getBackgroundColor = (name) => {
    // Navbar wala look dene ke liye professional colors
    const colors = [
      'bg-slate-500', 'bg-blue-600', 'bg-emerald-600', 'bg-orange-500', 
      'bg-purple-600', 'bg-rose-500', 'bg-indigo-600', 'bg-cyan-600'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // ✅ Step 1: Check karo ki image valid hai ya nahi
  // Agar link khali hai, ya bitmoji/dicebear wala hai, toh usse invalid maano
  const isInvalidImage = !src || 
                         src === "" || 
                         src.includes('dicebear.com') || 
                         src.includes('avatar');

  // ✅ Step 2: Agar real image hai (like cloudinary, unsplash, ya uploaded file)
  if (!isInvalidImage) {
    return (
      <div 
        className={`${size} rounded-full overflow-hidden shrink-0 ${className} ${onClick ? 'cursor-pointer' : ''}`} 
        onClick={onClick}
      >
        <img 
          src={src} 
          alt={name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            // Agar image load hone mein fat jaye toh fallback to initials
            e.target.parentElement.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // ✅ Step 3: Navbar jaisa Initial Circle (Default)
  return (
    <div 
      className={`${size} rounded-full flex items-center justify-center text-white font-bold shrink-0 ${textSize} ${getBackgroundColor(name)} ${className} ${onClick ? 'cursor-pointer' : ''}`} 
      onClick={onClick}
    >
      {getInitial(name)}
    </div>
  );
};

export default Avatar;