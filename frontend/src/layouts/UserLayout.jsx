import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/common/UserSidebar';

const UserLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <UserSidebar />
      
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <Outlet /> 
      </main>
    </div>
  );
};

export default UserLayout;