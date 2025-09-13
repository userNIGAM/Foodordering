import { useState, useEffect } from "react";
import api from "../../services/api";

export function useRating(productId) {
  const [rating, setRating] = useState(0); // user's rating
  const [stats, setStats] = useState(null); // average + count
  const [loading, setLoading] = useState(true);

  // Fetch ratings when product changes
  useEffect(() => {
    if (!productId) return;

    const fetchRatings = async () => {
      try {
        const res = await api.get(`/api/ratings/${productId}`);
        if (res.data.success) {
          setStats(res.data.stats);

          // ✅ Pre-fill logged-in user's rating if available
          if (res.data.userRating) {
            setRating(res.data.userRating.rating);
          }
        }
      } catch (err) {
        console.error("Failed to fetch ratings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [productId]);

  // Submit rating
  const submitRating = async (value) => {
    try {
      await api.post("/api/ratings", {
        productId,
        rating: value,
      });
      setRating(value);

      // ✅ Re-fetch stats after submitting
      const res = await api.get(`/api/ratings/${productId}`);
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error("Failed to submit rating:", err);
    }
  };

  return { rating, setRating, stats, submitRating, loading };
}
