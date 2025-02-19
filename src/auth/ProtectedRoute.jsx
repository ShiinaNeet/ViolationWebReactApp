import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, userType } = useAuth();
  const location = useLocation();
  function redirectUserToTheirLayouts() {
    if (userType.toLowerCase() === "admin") {
      return <Navigate to="/violations" replace />;
    } else if (userType.toLowerCase() === "dean") {
      return <Navigate to="/dean" replace />;
    } else if (userType.toLowerCase() === "professor") {
      return <Navigate to="/professor/home" replace />;
    } else if (userType.toLowerCase() === "program head") {
      return <Navigate to="/department-head/home" replace />;
    } else if (userType.toLowerCase() === "osd_coordinator") {
      return <Navigate to="/coordinator/home" replace />;
    } else {
      return <Navigate to="/students" replace />;
    }
  }
  if (isAuthenticated == true && location.pathname.toLowerCase() === "/login") {
    redirectUserToTheirLayouts();
  }
  if (location.pathname.toLowerCase() === "/" && isAuthenticated) {
    redirectUserToTheirLayouts();
  }
  return element;
};

export default ProtectedRoute;
