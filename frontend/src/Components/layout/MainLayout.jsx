import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

const MainLayout = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Only redirect to /auth when loading is false and user is null, but not if already on /auth
  if (!loading && !user) {
    if (window.location.pathname === "/auth") {
      // Already on /auth, don't redirect again
      return children;
    }
    return <Navigate to="/auth" replace />;
  }

  // If authenticated → render the protected content
  return children;
};

export default MainLayout;
