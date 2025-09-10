// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE ||
    (import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : "https://foodordering-i801.onrender.com"),
  withCredentials: true,
  timeout: 40000,
});

// Interceptors
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem("user");
      } catch (e) {}
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;
