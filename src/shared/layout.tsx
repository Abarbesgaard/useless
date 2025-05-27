import useAuth from "../hooks/useAuth";
import AppSidebar from "../components/custom/AppSidebar";
import Login from "../pages/Login";
import { Route, Routes } from "react-router";
import FavoritesPage from "../features/application/showFavoriteApplications/view/favorites";
import JobSearchTracker from "@/pages/Jobhunt";
import ArchivedPage from "@/pages/archived";
import AddApplication from "@/pages/addApplication";
import EditApplication from "@/pages/editApplication";
import Details from "@/pages/details";
import { LandingPage } from "../features/landing/showLanding/view/view";
import { NotFoundPage } from "../features/errors/view/view";

export default function AppLayout() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app/*" element={<AuthenticatedApp />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function AuthenticatedApp() {
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
      <div className="flex-1 overflow-auto">
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
      <Route path="applications" element={<JobSearchTracker />} />
      <Route path="favorites" element={<FavoritesPage />} />
      <Route path="archived" element={<ArchivedPage />} />
      <Route path="add" element={<AddApplication />} />
      <Route path="edit-application/:id" element={<EditApplication />} />
      <Route path="details/:id" element={<Details />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
