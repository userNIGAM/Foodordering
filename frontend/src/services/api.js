// src/services/api.js
import axios from "axios";

export const API_URL =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://foodordering-i801.onrender.com");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const getImageUrl = (path) => {
  if (!path) return "/placeholder-food.jpg";

  if (path.startsWith("http")) return path;

  return `${API_URL}${path}`;
};

export default api;
