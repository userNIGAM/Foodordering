import api from "./api";

export const getUserProfile = () => api.get("/api/user/me");
export const updateUserProfile = (formData) =>
  api.put("/api/user/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
