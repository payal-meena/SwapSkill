import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, LogOut as LogOutIcon } from 'lucide-react';

const NavItem = ({ icon, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive
          ? 'bg-[#13ec5b] text-[#102216] shadow-md'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#23482f]'
      }`}
    >
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
};

const SidebarContent = ({ closeSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  return (
    <div className="flex flex-col justify-between h-full overflow-y-auto font-['Lexend']">

      {/* TOP */}
      <div className="flex flex-col gap-8">
        {/* LOGO */}
        <div className="flex items-center gap-3 px-2">
          <div className="bg-[#13ec5b] rounded-lg p-2">
            <span className="material-symbols-outlined text-[#102216] font-bold">
              swap_horiz
            </span>
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">
              SwapSkill
            </h1>
            <p className="text-[10px] text-[#13ec5b] font-bold tracking-widest">
              P2P LEARNING
            </p>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-1.5">
          <NavItem to="/dashboard" icon="dashboard" label="Dashboard" />
          <NavItem to="/explore" icon="explore" label="Explore" />
          <NavItem to="/my-skills" icon="psychology" label="My Skills" />
          <NavItem to="/my-connection" icon="group" label="My Connection" />
          <NavItem to="/requests" icon="handshake" label="Requests" />
          <NavItem to="/messages" icon="chat_bubble" label="Messages" />
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="border-t pt-6 flex flex-col gap-2">
        <NavItem to="/settings" icon="settings" label="Settings" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOutIcon size={18} />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};

const UserSidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* DESKTOP */}
      <aside className="hidden lg:flex w-72 h-screen bg-white dark:bg-[#112217] border-r border-slate-200 dark:border-[#23482f] p-8 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* MOBILE */}
      <div className={`fixed inset-0 z-[200] lg:hidden ${isOpen ? 'visible' : 'invisible'}`}>
        {/* overlay */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={closeSidebar}
        />

        {/* drawer */}
        <div
          className={`absolute left-0 top-0 h-full w-[280px] bg-white dark:bg-[#112217] p-6 overflow-y-auto transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={closeSidebar} className="mb-4 text-slate-500">
            <X />
          </button>

          <SidebarContent closeSidebar={closeSidebar} />
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
