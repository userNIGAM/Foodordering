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
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist safely from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wishlist");
      const parsed = raw ? JSON.parse(raw) : [];
      setWishlist(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      // If localStorage is corrupted, start fresh
      setWishlist([]);
    }
  }, []);

  // Persist wishlist whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (e) {
      // ignore localStorage write errors
      console.warn("Could not save wishlist to localStorage:", e);
    }
  }, [wishlist]);

  // Adds id only if not already present (prevents duplicates)
  const addToWishlist = useCallback((productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlist.includes(productId),
    [wishlist]
  );

  const getWishlistCount = useCallback(() => wishlist.length, [wishlist]);

  const getWishlistItems = useCallback(
    (products = []) =>
      products.filter((product) => wishlist.includes(product.id)),
    [wishlist]
  );

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    getWishlistItems,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
