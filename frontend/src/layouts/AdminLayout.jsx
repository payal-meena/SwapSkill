import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden font-['Lexend'] bg-background-dark">
      <AdminSidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;