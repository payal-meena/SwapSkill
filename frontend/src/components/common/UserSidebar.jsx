
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut as LogOutIcon } from 'lucide-react';
import LogOut from '../modals/LogOut';
import { chatService } from '../../services/chatService';
import { requestService } from '../../services/requestService';
import { useChat } from '../../context/ChatContext';
import { SocketContext } from '../../context/SocketContext';

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
  const isActive = location.pathname === to || (to === '/messages/list' && location.pathname.startsWith('/messages/'));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer relative ${isActive
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

  const { chats, setActiveChatId, myUserId } = useChat();
  const myId = myUserId || getMyIdFromToken();
  const { socket } = useContext(SocketContext);

  

  // 1. Unread Count logic (Supports both Number and Array structure)
  const getUnreadCount = (chat) => {
    if (!chat) return 0;

    // Console log ke mutabik unreadCount ek property hai chat object ki
    const uc = chat.unreadCount;

    if (typeof uc === 'number') return uc;

    // Agar unreadCount array hai (jo aapke console mein dikh raha hai)
    if (Array.isArray(uc)) {
      const myEntry = uc.find(item =>
        (item.userId?.toString() === myId?.toString()) ||
        (item._id?.toString() === myId?.toString())
      );
      return myEntry ? myEntry.count : 0;
    }

    // Agar unreadCount object hai
    if (typeof uc === 'object' && uc !== null) {
      return uc[myId] || uc.count || 0;
    }

    return 0;
  };

  // 2. Real-time Total Unread
  const totalUnread = useMemo(() => {
    return (chats || []).reduce((sum, c) => sum + getUnreadCount(c), 0);
  }, [chats, myId]);

  // 3. WhatsApp Style Real-time Logic: Detect URL Change
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const activeIdFromUrl = pathParts[pathParts.length - 1];

    // Agar user kisi specific chat par hai (not on list or empty)
    if (location.pathname.startsWith('/messages/') && activeIdFromUrl !== 'list' && activeIdFromUrl !== ':userId') {
      setActiveChatId(activeIdFromUrl);
    } else {
      setActiveChatId(null);
    }
  }, [location.pathname, setActiveChatId]);

  // 4. Requests count fetch logic
  // 4. Requests count fetch AND Real-time listener
  // 4. Requests count fetch AND Real-time listener
  // 4. Requests count fetch AND Real-time listener
  // 4. Requests count fetch AND Real-time listener (Instagram Style)
  // 4. Requests count fetch AND Real-time listener (Robust Version)
useEffect(() => {
  if (!socket || !myId) return;

  const handleRequestUpdated = (data) => {
    const receiverId = (data?.receiver?._id || data?.receiver)?.toString();
    if (receiverId === myId) {
      const count = data.totalPending ?? 0;
      setIncomingRequestCount(count); // direct update from socket
    }
  };

  socket.on("requestUpdated", handleRequestUpdated);
  socket.on("requestSeen", handleRequestUpdated);

  return () => {
    socket.off("requestUpdated", handleRequestUpdated);
    socket.off("requestSeen", handleRequestUpdated);
  };
}, [socket, myId]);



  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!myId) return;

      if (location.pathname === '/requests') {
        setIncomingRequestCount(0);
        return;
      }

      try {
        const res = await requestService.getMyRequests();
        setIncomingRequestCount(res.count); // backend ne already unseen pending count calculate kar diya
      } catch (err) {
        console.log("Error fetching requests:", err);
      }

    };

    fetchPendingRequests();
  }, [myId, location.pathname]);


  useEffect(() => {
    const markSeenAndResetCount = async () => {
      if (!myId) return;

      if (location.pathname === '/requests') {
        try {
          // 🔹 1️⃣ Server ko mark as seen call karo
          await requestService.markRequestsAsSeen();

          // 🔹 2️⃣ Local count zero kar do
          setIncomingRequestCount(0);
        } catch (err) {
          console.log("Error marking requests as seen:", err);
        }
      }
    };

    markSeenAndResetCount();
  }, [myId, location.pathname]);




  // 5. URL change hone par count reset logic (UX improvement)
  useEffect(() => {
    if (location.pathname === '/requests') {
      setIncomingRequestCount(0);
    }
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
          <NavItem to="/requests" icon="handshake" label="Requests" badgeCount={incomingRequestCount} onClick={() => setIncomingRequestCount(0)} />
          <NavItem to="/messages/list" icon="chat_bubble" label="Messages" badgeCount={totalUnread} />
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
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#112217] border-b border-slate-200 dark:border-[#23482f] flex items-center justify-between px-6 z-[60]">
        <div className="flex items-center gap-2">
          <div className="bg-[#13ec5b] rounded p-1">
            <span className="material-symbols-outlined text-sm text-[#102216] font-bold">swap_horiz</span>
          </div>
          <span className="font-black dark:text-white text-sm uppercase tracking-tighter">SwapSkill</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-[#13ec5b]/10 text-[#13ec5b] rounded-lg">
          <Menu size={24} />
        </button>
      </div>

      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#112217] border-r border-slate-200 dark:border-[#23482f] p-8 h-screen sticky top-0 z-50">
        {renderSidebarContent(false)}
      </aside>

      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-[#112217] z-[80] p-6 shadow-2xl lg:hidden">
            {renderSidebarContent(true)}
          </div>
        </>
      )}

      {isLogoutModalOpen && (
        <LogOut isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogoutConfirm} />
      )}
    </>
  );
};

export default UserSidebar;