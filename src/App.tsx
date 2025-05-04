import "./App.css";
import JobSearchTracker from "./pages/Jobhunt";
import AuthProvider from "./contexts/authProvider";
import Login from "./pages/Login";
import useAuth from "./hooks/useAuth";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";

function AppContent() {
  const { user } = useAuth();

  return user ? <JobSearchTracker /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
      <Analytics />
    </AuthProvider>
  );
}
