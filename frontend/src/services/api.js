// src/services/api.js
import axios from "axios";

const api = axios.create({
  // Make baseURL point to the server origin (we keep "/api" in the requests)
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000",
  withCredentials: true, // important for cookie-based auth
});

api.interceptors.request.use(
  (config) => {
    // optionally add headers here
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // unauthorized → ensure local client state cleared and redirect to login
      try {
        localStorage.removeItem("user");
      } catch (e) {}
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;
