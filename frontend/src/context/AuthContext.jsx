import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");

    // Don't wake up Render just to check auth
    // when the user is clearly logged out
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await api.get("/api/auth/me", {
        timeout: 10000,
      });

      if (res?.data?.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch (err) {
      setUser(null);

      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
      }

      if (err?.response?.status !== 401) {
        console.error("Auth check failed:", err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (res?.data?.success) {
        const { user, token } = res.data;

        if (token) {
          localStorage.setItem("token", token);
        }

        setUser(user);

        return {
          success: true,
          user,
        };
      }

      return {
        success: false,
        message: res?.data?.message || "Login failed",
      };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
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
