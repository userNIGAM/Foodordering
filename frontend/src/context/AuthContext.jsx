/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      // Make sure we call the correct endpoint. backend has /api/auth/me
      const res = await api.get("/api/auth/me", { timeout: 50000 });
      if (res?.data?.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      setLoading(false);
      // Suppress error log for 401 and ECONNABORTED after logout/network issues
      if (
        process.env.NODE_ENV === "development" &&
        err?.code !== "ECONNABORTED" &&
        err?.response?.status !== 401
      ) {
        console.error("Auth check failed:", err);
      }
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res?.data?.success) {
        // backend should set the cookie; we update local user state from response
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      } else {
        return {
          success: false,
          message: res?.data?.message || "Login failed",
        };
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      await checkAuth(); // Refresh auth state after logout
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
