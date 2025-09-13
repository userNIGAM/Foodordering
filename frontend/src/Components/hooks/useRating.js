import { useState } from "react";
import api from "../services/api";

export function useRating(productId) {
  const [rating, setRating] = useState(0);

  const submitRating = async (value) => {
    try {
      await api.post("/api/ratings", { productId, rating: value });
      setRating(value);
    } catch (err) {
      console.error("Failed to submit rating:", err);
    }
  };

  return { rating, submitRating };
}
