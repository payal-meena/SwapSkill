import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/public/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import MySkills from "../pages/skills/MySkills";
import UserLayout from "../layouts/UserLayout";
import Requests from "../pages/requests/Requests";
import MessagesPage from "../pages/messages/MessagesPage";
import Auth from "../pages/public/Auth";
import SettingsLayout from "../pages/settings/SettingLayout";
import Account from "../pages/settings/Account";
import Security from "../pages/settings/Security";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Explore from "../pages/explore/Explore";
import Profile from "../pages/profile/Profile";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/auth" element={<Auth />} />

      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-skills" element={<MySkills />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="my-profile" element={<Profile />} />

      </Route>

      <Route path="/settings" element={<SettingsLayout />}>
        <Route index element={<Navigate to="/settings/account" replace />} />
        <Route path="account" element={<Account />} />
        <Route path="security" element={<Security />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Navigate to="/admin/dashboard" />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="moderation" element={<div>Moderation Page</div>} />
  </Route>
    </Routes>
  );
}

export default AppRoutes;