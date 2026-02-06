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

const NavItem = ({ icon, label, to, badge = false, badgeCount = 0, onClick }) => {
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
      {badgeCount > 0 && !isActive && (
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 bg-[#13ec5b] text-[#102216] font-bold text-xs px-2 py-0.5 rounded-full shadow-sm ${badgeCount ? 'wiggle-badge' : ''}`}>
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </Link>
  );
};

const UserSidebar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    if (typeof uc === 'object') {
      if (uc[myId] != null) return uc[myId];
      return uc.count || 0;
    }
    return 0;
  };

  const totalUnread = (chats || []).reduce((sum, c) => sum + getUnreadCountFor(c), 0);

  // Log whenever chats change
  useEffect(() => {
    if (chats && chats.length > 0) {
      console.log('💬 UserSidebar - Chats updated:', {
        count: chats.length,
        totalUnread,
        chats: chats.map(c => ({ 
          id: c._id, 
          participant: c.participants?.[0]?.name,
          unreadCount: c.unreadCount 
        }))
      });
    }
  }, [chats, totalUnread]);

  // Listen for incoming connection requests
  useEffect(() => {
    if (!myId) return;

    // Try to use socket from chatService
    const socket = chatService.socket;
    if (!socket) {
      console.warn('⚠️ Socket not available for request notifications');
      return;
    }

    const handleNewRequest = (request) => {
      console.log('🔔 Incoming request notification:', request);
      // Only increment if this is for current user (receiver)
      if (request?.receiver?._id?.toString() === myId?.toString() || request?.receiver === myId) {
        setIncomingRequestCount(prev => {
          const newCount = prev + 1;
          console.log('📥 Updated incoming request count:', newCount);
          return newCount;
        });
      }
    };

    const handleRequestUpdated = (updatedRequest) => {
      // If it's a new pending request for us, increment
      if (updatedRequest?.status === 'pending' && (updatedRequest?.receiver?._id?.toString() === myId?.toString() || updatedRequest?.receiver === myId)) {
        setIncomingRequestCount(prev => {
          const newCount = prev + 1;
          console.log('📥 Updated incoming request count (from requestUpdated):', newCount);
          return newCount;
        });
      }
    };

    socket.on('newNotification', handleNewRequest);
    socket.on('requestUpdated', handleRequestUpdated);

    return () => {
      socket.off('newNotification', handleNewRequest);
      socket.off('requestUpdated', handleRequestUpdated);
    };
  }, [myId]);

  // Reset incoming request count when user visits requests page
  useEffect(() => {
    if (location.pathname === '/requests') {
      console.log('🔄 User opened Requests page, resetting counter');
      setIncomingRequestCount(0);
    }
  }, [location.pathname]);

  // Fetch incoming requests count on mount
  useEffect(() => {
    if (!myId) return;
    
    const fetchIncomingRequestsCount = async () => {
      try {
        console.log('📥 Fetching incoming requests count on mount...');
        const res = await requestService.getMyRequests();
        console.log('📥 API Response:', res);
        
        if (res?.requests && Array.isArray(res.requests)) {
          const incomingCount = res.requests.filter(r => {
            const isReceiverMatch = r.receiver?._id?.toString() === myId?.toString() || 
                                    r.receiver === myId;
            const isPending = r.status === 'pending';
            console.log(`📥 Checking request - Receiver: ${isReceiverMatch}, Status: ${r.status}`);
            return isReceiverMatch && isPending;
          }).length;
          
          console.log('📥 Final incoming request count:', incomingCount);
          setIncomingRequestCount(incomingCount);
        } else {
          console.warn('📥 No requests array in response or invalid format:', res);
        }
      } catch (err) {
        console.error('❌ Error fetching incoming requests count:', err);
      }
    };
    
    fetchIncomingRequestsCount();
  }, [myId]);

  const handleLogoutConfirm = () => {
    const myId = getMyIdFromToken();
    if (myId) {
      // Tell server we're logging out so it can update lastSeen immediately
      chatService.logout(myId);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsLogoutModalOpen(false);
    navigate('/auth');
  };

  // Sidebar Content Function
  const renderSidebarContent = (isMobileView) => (
    <div className="flex flex-col justify-between h-full font-['Lexend']">
      <div className="flex flex-col gap-8">
        {/* Logo Section */}
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex gap-3 items-center">
            <div className="bg-[#13ec5b] rounded-lg p-2 flex items-center justify-center shadow-[0_0_15px_rgba(19,236,91,0.3)]">
              <span className="material-symbols-outlined text-[#102216] font-bold">swap_horiz</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-lg font-black leading-tight tracking-tight">SwapSkill</h1>
              <p className="text-[#13ec5b] text-[10px] font-bold uppercase tracking-widest">P2P Learning</p>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          {isMobileView && (
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-500 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          <NavItem to="/dashboard" icon="dashboard" label="Dashboard" />
          <NavItem to="/explore" icon="explore" label="Explore" />
          <NavItem to="/my-skills" icon="psychology" label="My Skills" />
          <NavItem to="/requests" icon="handshake" label="Requests" badgeCount={incomingRequestCount} />
          <NavItem to="/messages/:userId" icon="chat_bubble" label="Messages" badgeCount={totalUnread} />
        </nav>
      </div>

      {/* Bottom Actions */}
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
      {/* --- MOBILE HEADER --- */}
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

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#112217] border-r border-slate-200 dark:border-[#23482f] p-8 h-screen sticky top-0 z-50">
        {renderSidebarContent(false)}
      </aside>

      {/* --- MOBILE DRAWER --- */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-[#112217] z-[80] p-6 shadow-2xl lg:hidden">
            {renderSidebarContent(true)}
          </div>
        </>
      )}

      {/* LogOut Modal */}
      {isLogoutModalOpen && (
        <LogOut 
          isOpen={isLogoutModalOpen} 
          onClose={() => setIsLogoutModalOpen(false)} 
          onConfirm={handleLogoutConfirm} 
        />
      )}
    </>
  );
};

export default UserSidebar;