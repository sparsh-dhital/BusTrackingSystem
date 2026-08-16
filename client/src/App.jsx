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
import BusLoader from "./components/BusLoader";

// Pages
import StudentDashboard from "./pages/StudentDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Simulate initial app hydration/loading process
  useEffect(() => {
    // In a real app, you'd check localStorage or verify a JWT token here.
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (credentials) => {
    setUser({ role: credentials.role, id: credentials.idNumber });
  };

  const handleLogout = () => {
    setUser(null);
  };

  // If the app is initializing, show the splash screen loader
  if (isAppLoading) {
    return <BusLoader message="Loading Vignan TMS..." />;
  }

  return (
    <Router>
      {/* UPDATE: Passed handleLogin to onAdminLogin prop */}
      <AdminCommandPalette onAdminLogin={handleLogin} />

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

        {/* --- PROTECTED ROUTE: Student Portal --- */}
        <Route
          path="/student-portal"
          element={
            <ProtectedRoute userRole={user?.role} requiredRole="student">
              <StudentDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* --- PROTECTED ROUTE: Driver Portal --- */}
        <Route
          path="/driver-portal"
          element={
            <ProtectedRoute userRole={user?.role} requiredRole="driver">
              <DriverDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* --- PROTECTED ROUTE: Admin Portal --- */}
        <Route
          path="/admin-portal"
          element={
            <ProtectedRoute userRole={user?.role} requiredRole="admin">
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Catch-All Route for 404s */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}