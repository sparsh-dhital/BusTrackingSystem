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
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (credentials) => {
    setUser({ role: credentials.role, id: credentials.idNumber });
  };

  if (isAppLoading) {
    return <BusLoader message="Loading Vignan TMS..." />;
  }

  return (
    <Router>
      <ThemeToggle />
      <AdminCommandPalette />

      <Routes>
        {/* Root path redirects unauthenticated users to /login, or to their portal if logged in */}
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <Navigate to={`/${user.role}-portal`} replace />
            )
          }
        />

        {/* Explicit Login Page Route */}
        <Route
          path="/login"
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