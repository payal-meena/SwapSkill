import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/public/Home";
import Auth from "../pages/public/Auth";
import Dashboard from "../pages/dashboard/Dashboard";
import MySkills from "../pages/skills/MySkills";
import UserLayout from "../layouts/UserLayout";
import Requests from "../pages/requests/Requests";
import MessagesPage from "../pages/messages/MessagesPage";
import SettingsLayout from "../pages/settings/SettingLayout";
import BlockedUsers from "../pages/settings/BlockedUsers";
import Account from "../pages/settings/Account";
import Explore from "../pages/explore/Explore";
import Profile from "../pages/profile/Profile";
import ExploreProfile from "../pages/explore/ExploreProfile";
import MyConnection from "../pages/myconnection/MyConnection";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />

      {/* User Routes (Wrapped in UserLayout) */}
      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-skills" element={<MySkills />} />
        <Route path="/my-connection" element={<MyConnection />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/messages/:userId" element={<MessagesPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore-profile" element={<ExploreProfile />} />
        <Route path="/my-profile" element={<Profile />} />
      </Route> {/* Fixed: Closing tag for UserLayout added here */}

      {/* Settings Routes */}
      <Route path="/settings" element={<SettingsLayout />}>
        <Route index element={<Navigate to="/settings/account" replace />} />
        <Route path="account" element={<Account />} />
        <Route path="blocked-users" element={<BlockedUsers />} />
      </Route>

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;