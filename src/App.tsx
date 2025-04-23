import "./App.css";
import JobSearchTracker from "./components/Jobhunt";
import AuthProvider from "./contexts/authContext";
import Login from "./components/login";
import useAuth from "./hooks/useAuth";

function AppContent() {
  const { user } = useAuth();

  return user ? <JobSearchTracker /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
