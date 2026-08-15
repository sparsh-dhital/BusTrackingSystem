// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, userRole, requiredRole }) {
  // If no one is logged in, send to login page
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // If the logged-in user doesn't have the correct role for this page
  if (requiredRole && userRole !== requiredRole) {
    // Send them to their own dedicated page
    return <Navigate to={`/${userRole}-portal`} replace />;
  }

  // If validation passes, render the page
  return children;
}