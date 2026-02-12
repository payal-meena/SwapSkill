
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/common/UserSidebar';
import UserNavbar from '../components/common/UserNavbar';

const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <UserSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-hide bg-background-light dark:bg-background-dark">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default UserLayout;