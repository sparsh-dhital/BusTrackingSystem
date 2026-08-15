// client/src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Components
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCommandPalette from "./components/AdminCommandPalette";
import NotFound from "./components/NotFound";
import ThemeToggle from "./components/ThemeToggle";
import BusLoader from "./components/BusLoader";

// Pages
import DriverDashboard from "./DriverDashboard";
import TrackingMap from "./TrackingMap";

export default function App() {
  const [user, setUser] = useState(null);

  // 1. Create a global loading state that starts as TRUE
  const [isAppLoading, setIsAppLoading] = useState(true);

  // 2. Simulate initial app hydration/loading process
  useEffect(() => {
    // In a real app, you'd check localStorage or verify a token here.
    // For now, we simulate a 1.5-second initial load.
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (credentials) => {
    setUser({ role: credentials.role, email: credentials.email });
  };

  // 3. If the app is initializing, show the splash screen loader!
  if (isAppLoading) {
      return <BusLoader message="Loading Vignan TMS..." />;
  }

  return (
    <Router>
      <ThemeToggle />
      <AdminCommandPalette />

      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <LoginForm onLogin={handleLogin} />
            ) : (
              <Navigate to={`/${user.role}-portal`} replace />
            )
          }
        />

        <Route
          path="/student-portal"
          element={
            <ProtectedRoute userRole={user?.role} requiredRole="student">
              <TrackingMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver-portal"
          element={
            <ProtectedRoute userRole={user?.role} requiredRole="driver">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}