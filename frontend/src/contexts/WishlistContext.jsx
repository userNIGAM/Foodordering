// src/contexts/WishlistContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem("wishlist");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Could not save wishlist:", e);
    }
  }, [wishlist]);

  const addToWishlist = useCallback((product) => {
    if (!product) return;
    const id = product.id || product._id;
    setWishlist((prev) => {
      if (prev.some((p) => p.id === id || p._id === id)) return prev;
      return [...prev, { ...product, id, _id: id }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) =>
      prev.filter((p) => p.id !== productId && p._id !== productId)
    );
  }, []);

  const isInWishlist = useCallback(
    (productId) =>
      wishlist.some((p) => p.id === productId || p._id === productId),
    [wishlist]
  );

  const getWishlistCount = useCallback(() => wishlist.length, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
