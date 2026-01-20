import { Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Dashboard from "../pages/dashboard/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default AppRoutes;
