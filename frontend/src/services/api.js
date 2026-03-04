// src/services/api.js
import axios from "axios";

// Define baseURL once
export const API_URL =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://foodordering-i801.onrender.com");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 40000,
});

// Add a helper to resolve image URLs
export const getImageUrl = (path) => {
  if (!path) return "/placeholder-food.jpg"; // fallback
  if (path.startsWith("http")) return path; // already full URL
  return `${API_URL}${path}`;
};
// //helper for fetching categories
// export const getCategories = () => {
//   return api.get("/api/categories");
// };

// Interceptors
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser?.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
