import { Navigate, useLocation } from "react-router-dom";
import { getUserRole, isAuthenticated } from "../utils/authUtils";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const role = getUserRole();

  const isAuth = isAuthenticated();
  if (!isAuth) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const isAuthenticatedRole = role === "admin" || role === "super_admin";

  if (isAuthenticatedRole) {
    return children;
  }
  return <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
