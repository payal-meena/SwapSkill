import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut as LogOutIcon } from 'lucide-react'; // Icons for responsive
import LogOut from '../modals/LogOut';

const NavItem = ({ icon, label, to, badge = false, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer relative ${
        isActive 
          ? 'bg-[#13ec5b] text-[#102216] shadow-[0_4px_15px_rgba(19,236,91,0.2)]' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#23482f] dark:hover:text-white'
      }`}
    >
      <span className="material-symbols-outlined text-[22px]">
        {icon}
      </span>
      <p className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
        {label}
      </p>
      {badge && !isActive && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-2 w-2 rounded-full bg-[#13ec5b] animate-pulse"></span>
      )}
    </Link>
  );
};

const UserSidebar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Route badalne par mobile menu band kar dein
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  const SidebarContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full font-['Lexend']">
      <div className="flex flex-col gap-8">
        {/* Logo Section */}
        <div className="flex items-center justify-between lg:justify-start gap-3 px-2">
          <Link to="/" className="flex gap-3 items-center cursor-pointer">
            <div className="bg-[#13ec5b] rounded-lg p-2 flex items-center justify-center shadow-[0_0_15px_rgba(19,236,91,0.3)]">
              <span className="material-symbols-outlined text-[#102216] font-bold">swap_horiz</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-lg font-black leading-tight tracking-tight">SwapSkill</h1>
              <p className="text-[#13ec5b] text-[10px] font-bold uppercase tracking-widest">P2P Learning</p>
            </div>
          </Link>
          
          {/* Mobile Close Button */}
          {isMobile && (
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-500 dark:text-white">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          <NavItem to="/dashboard" icon="dashboard" label="Dashboard" />
          <NavItem to="/explore" icon="explore" label="Explore" />
          <NavItem to="/my-skills" icon="psychology" label="My Skills" />
          <NavItem to="/requests" icon="handshake" label="Requests" badge />
          <NavItem to="/messages" icon="chat_bubble" label="Messages" />
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2 pt-6 border-t border-slate-200 dark:border-[#23482f]">
        <NavItem to="/settings" icon="settings" label="Settings" />
        <div 
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer group"
        >
          <LogOutIcon size={20} className="group-hover:-translate-x-1 transition-transform" />
          <p className="text-sm font-bold uppercase tracking-wider">Logout</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* --- MOBILE HEADER (Sirf Small Screens Par Dikhega) --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#112217] border-b border-slate-200 dark:border-[#23482f] flex items-center justify-between px-6 z-[60]">
        <div className="flex items-center gap-2">
          <div className="bg-[#13ec5b] rounded p-1">
            <span className="material-symbols-outlined text-sm text-[#102216] font-bold">swap_horiz</span>
          </div>
          <span className="font-black dark:text-white text-sm uppercase tracking-tighter">SwapSkill</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-[#13ec5b]/10 text-[#13ec5b] rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* --- DESKTOP SIDEBAR (Static) --- */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#112217] border-r border-slate-200 dark:border-[#23482f] p-8 h-screen sticky top-0 z-50">
        {SidebarContent(false)}
      </aside>

      {/* --- MOBILE DRAWER (Overlay) --- */}
      {isMobileMenuOpen && (
        <>
          {/* Dark Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-[#112217] z-[80] p-6 shadow-2xl lg:hidden animate-in slide-in-from-left duration-300">
            {SidebarContent(true)}
          </div>
        </>
      )}

      {/* LogOut Modal */}
      <LogOut 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogoutConfirm} 
      />
    </>
  );
};

export default UserSidebar;