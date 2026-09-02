import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Check whether the current user is authenticated.
   */
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");

    // No token = definitely logged out
    if (!token) {
      setUser(null);
      setLoading(false);
      return false;
    }

    try {
      setLoading(true);

      const res = await api.get("/api/auth/me", {
        timeout: 10000,
      });

      if (res?.data?.success && res?.data?.user) {
        setUser(res.data.user);
        return true;
      }

      // Invalid response
      localStorage.removeItem("token");
      setUser(null);

      return false;
    } catch (err) {
      console.error("Auth check failed:", err?.response?.data || err?.message);

      // Token is invalid/expired
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
      }

      setUser(null);

      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check authentication when application starts.
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Login
   */
  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (!res?.data?.success) {
        return {
          success: false,
          message: res?.data?.message || "Invalid credentials",
        };
      }

      const { user, token } = res.data;

      // Store JWT token
      if (token) {
        localStorage.setItem("token", token);
      }

      // Update authentication state immediately
      setUser(user);

      return {
        success: true,
        user,
      };
    } catch (err) {
      console.error("Login error:", err?.response?.data || err?.message);

      return {
        success: false,
        message:
          err?.response?.data?.message || "Unable to login. Please try again.",
      };
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    // Clear local authentication immediately
    localStorage.removeItem("token");
    setUser(null);

    try {
      // Tell backend to invalidate/logout if supported
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout API error:", err?.response?.data || err?.message);
    }
  };

  /**
   * Check whether user has admin privileges.
   */
  const isAdmin = ["admin", "superadmin"].includes(user?.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAdmin,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
