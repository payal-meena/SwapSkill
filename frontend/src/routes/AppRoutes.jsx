import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/public/Home";
import Auth from "../pages/public/Auth";
import Dashboard from "../pages/dashboard/Dashboard";
import MySkills from "../pages/skills/MySkills";
import UserLayout from "../layouts/UserLayout";
import Requests from "../pages/requests/Requests";
import MessagesPage from "../pages/messages/MessagesPage";
import SettingsLayout from "../pages/settings/SettingLayout";
import Account from "../pages/settings/Account";
import Security from "../pages/settings/Security";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Explore from "../pages/explore/Explore";
import Profile from "../pages/profile/Profile";
import UserManagment from "../pages/admin/UserManagment";
import SkillModeration from "../pages/admin/SkillModeration";
import AdminProfile from "../pages/admin/settings/AdminProfile"

// 1. IS NAME KO MONITORING HI RAKHEIN (Aapki file ke mutabik)
import Monitoring from "../pages/admin/Monitoring"; 

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />

      {/* User Routes */}
      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-skills" element={<MySkills />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="my-profile" element={<Profile />} />
      </Route>

      {/* Settings Routes */}
      <Route path="/settings" element={<SettingsLayout />}>
        <Route index element={<Navigate to="/settings/account" replace />} />
        <Route path="account" element={<Account />} />
        <Route path="security" element={<Security />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        <Route path="users" element={<UserManagment />} />
        <Route path="skills" element={<SkillModeration />} />
        <Route path="exchanges" element={<Monitoring />} />

           {/* admin settings  */}
        <Route path="settings" element={<AdminProfile />} />
        

        <Route path="moderation" element={<div>Moderation Page</div>} />
      </Route>
      
      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;