import useAuth from "../hooks/useAuth";
import AppSidebar from "../components/custom/AppSidebar";
import Login from "../pages/Login";
import { Route, Routes } from "react-router";
import FavoritesPage from "@/pages/favorites";
import JobSearchTracker from "@/pages/Jobhunt";

export default function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Login />
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <AppRoutes />
      </div>
    </div>
  );
}
function AppRoutes() {
  const { user } = useAuth();

  if (!user) return <Login />;

  return (
    <Routes>
      <Route path="/" element={<JobSearchTracker />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}
