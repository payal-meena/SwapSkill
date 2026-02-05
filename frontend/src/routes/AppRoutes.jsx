import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import AdminProfile from "../pages/admin/settings/AdminProfile";
import ExploreProfile from "../pages/explore/ExploreProfile";
import Monitoring from "../pages/admin/Monitoring";

// --- AUTH CHECK HELPERS ---
// Note: Aap apne actual auth logic (Redux, Context, ya LocalStorage) ke mutabik ise change karein.
const isAuthenticated = () => !!localStorage.getItem("token"); 
const isAdmin = () => localStorage.getItem("role") === "admin";

// Wrapper Component for User Routes
const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/auth" replace />;
};

// Wrapper Component for Admin Routes
const AdminRoute = () => {
  return isAuthenticated() && isAdmin() ? <Outlet /> : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes: Har koi dekh sakta hai */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />

      {/* Protected User Routes: Sirf Login Users ke liye */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-skills" element={<MySkills />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/messages/:userId" element={<MessagesPage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore-profile" element={<ExploreProfile />} />
          <Route path="/my-profile" element={<Profile />} />
        </Route>

        {/* Settings inside Protected Route */}
        <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="/settings/account" replace />} />
          <Route path="account" element={<Account />} />
          <Route path="security" element={<Security />} />
        </Route>
      </Route>

      {/* Admin Routes: Sirf Admin Role ke liye */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagment />} />
          <Route path="skills" element={<SkillModeration />} />
          <Route path="exchanges" element={<Monitoring />} />
          <Route path="settings" element={<AdminProfile />} />
          <Route path="moderation" element={<div>Moderation Page</div>} />
        </Route>
      </Route>

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;