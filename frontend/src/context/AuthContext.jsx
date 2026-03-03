/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/api/auth/me");

      if (res?.data?.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);

      if (
        process.env.NODE_ENV === "development" &&
        err?.response?.status !== 401
      ) {
        console.error("Auth check failed:", err);
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
      const res = await api.post("/api/auth/login", { email, password });

      if (res?.data?.success) {
        setUser(res.data.user);

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        return { success: true, user: res.data.user };
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;