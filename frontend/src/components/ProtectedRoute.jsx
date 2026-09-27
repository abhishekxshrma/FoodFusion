import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — wraps a set of routes to enforce role-based access.
 *
 * Props:
 *   allowedRoles  — array of roles that can access these routes, e.g. ["customer"]
 *   redirectTo    — where to send unauthorised users (defaults to "/")
 *
 * Behaviour:
 *   • If auth is still loading  → render nothing (avoid flash-redirect)
 *   • If not logged in          → redirect to the portal-specific login page
 *   • If wrong role             → redirect to the portal-specific login page
 *   • If authorised             → render children via <Outlet />
 */
function ProtectedRoute({ allowedRoles = [], redirectTo = "/" }) {
  const { user, loading } = useAuth();

  // Wait for the auth check to finish before deciding
  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
