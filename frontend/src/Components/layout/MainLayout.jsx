import { useContext, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

const MainLayout = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin" && location.pathname === "/") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "user" && location.pathname === "/") {
        navigate("/home", { replace: true });
      }
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Not logged in → force to /auth
  if (!loading && !user) {
    if (location.pathname === "/auth") {
      return children;
    }
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default MainLayout;
