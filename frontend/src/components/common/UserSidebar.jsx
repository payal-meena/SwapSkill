import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut as LogOutIcon } from 'lucide-react';
import LogOut from '../modals/LogOut';
import { chatService } from '../../services/chatService';
import { requestService } from '../../services/requestService';
import { useChat } from '../../context/ChatContext';

const getMyIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload.id || payload._id;
  } catch (e) { return null; }
};

const NavItem = ({ icon, label, to, badgeCount = 0, onClick }) => {
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
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      <p className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
        {label}
      </p>
      {badgeCount > 0 && !isActive && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#13ec5b] text-[#102216] font-bold text-xs px-2 py-0.5 rounded-full shadow-sm">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </Link>
  );
};

const UserSidebar = ({ isMobileMenuOpen = false, setIsMobileMenuOpen = () => {} }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [incomingRequestCount, setIncomingRequestCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { chats } = useChat();
  const myId = getMyIdFromToken();

  const getUnreadCountFor = (c) => {
    if (!c) return 0;
    const uc = c.unreadCount;
    if (uc == null) return 0;
    if (typeof uc === 'number') return uc;
    if (Array.isArray(uc)) {
      const it = uc.find(u => (u.userId || u._id || u.id) === myId);
      return it?.count || 0;
    }
    return uc[myId] || uc.count || 0;
  };

  const totalUnread = (chats || []).reduce((sum, c) => sum + getUnreadCountFor(c), 0);

  // Close mobile drawer when route changes
  useEffect(() => {
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  }, [location.pathname, setIsMobileMenuOpen]);

  useEffect(() => {
    if (!myId) return;
    const socket = chatService.socket;
    if (!socket) return;

    const handleNewRequest = (request) => {
      if (request?.receiver?._id?.toString() === myId?.toString() || request?.receiver === myId) {
        setIncomingRequestCount(prev => prev + 1);
      }
    };
    socket.on('newNotification', handleNewRequest);
    return () => socket.off('newNotification', handleNewRequest);
  }, [myId]);

  useEffect(() => {
    if (location.pathname === '/requests') setIncomingRequestCount(0);
  }, [location.pathname]);

  const handleLogoutConfirm = () => {
    if (myId) chatService.logout(myId);
    localStorage.clear();
    setIsLogoutModalOpen(false);
    navigate('/auth');
  };

  const renderSidebarContent = (isMobileView) => (
    <div className="flex flex-col justify-between h-full font-['Lexend']">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex gap-3 items-center">
            <div className="bg-[#13ec5b] rounded-lg p-2 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#102216] font-bold">swap_horiz</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-lg font-black leading-tight tracking-tight">SwapSkill</h1>
              <p className="text-[#13ec5b] text-[10px] font-bold uppercase tracking-widest">P2P Learning</p>
            </div>
          </div>
          {isMobileView && setIsMobileMenuOpen && (
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 dark:text-white">
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-1.5">
          <NavItem to="/dashboard" icon="dashboard" label="Dashboard" />
          <NavItem to="/explore" icon="explore" label="Explore" />
          <NavItem to="/my-skills" icon="psychology" label="My Skills" />
          <NavItem to="/my-connection" icon="group" label="My Connection" />
          <NavItem to="/requests" icon="handshake" label="Requests" badgeCount={incomingRequestCount} />
          <NavItem to="/messages/:userId" icon="chat_bubble" label="Messages" badgeCount={totalUnread} />
        </nav>
      </div>

      <div className="flex flex-col gap-2 pt-6 border-t border-slate-200 dark:border-[#23482f]">
        <NavItem to="/settings" icon="settings" label="Settings" />
        <div 
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer group"
        >
          <LogOutIcon size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          <p className="text-sm font-bold uppercase tracking-wider">Logout</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#112217] border-r border-slate-200 dark:border-[#23482f] p-8 h-screen sticky top-0 z-50 ">
        {renderSidebarContent(false)}
      </aside>

      {isMobileMenuOpen && (
        <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 visible`}>
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-100"
            onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[280px] bg-white dark:bg-[#112217] p-6 shadow-2xl transition-transform duration-300 ease-in-out translate-x-0">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}

      {isLogoutModalOpen && (
        <LogOut isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogoutConfirm} />
      )}
    </>
  );
};

export default UserSidebar;