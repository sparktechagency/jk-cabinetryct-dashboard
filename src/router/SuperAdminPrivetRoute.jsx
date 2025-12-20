import { Navigate, useLocation } from "react-router-dom";
import { getUserRole, isAuthenticated } from "../utils/authUtils";

// eslint-disable-next-line react/prop-types
const SuperAdminPrivetRoute = ({ children }) => {
  const location = useLocation();
  const role = getUserRole();

  const isAuth = isAuthenticated();

  // If user is not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const isAuthenticatedRole = role === "super_admin";

  if (isAuthenticatedRole) {
    return children;
  }
  return <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default SuperAdminPrivetRoute;
