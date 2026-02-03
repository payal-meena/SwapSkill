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
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  if (src && !src.includes('dicebear.com')) {
    return (
      <div className={`${size} rounded-full overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
        <img src={src} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${size} rounded-full flex items-center justify-center text-white font-bold ${textSize} ${getBackgroundColor(name)} ${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      {getInitial(name)}
    </div>
  );
};

export default Avatar;