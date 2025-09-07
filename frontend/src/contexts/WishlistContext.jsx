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

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wishlist");
      const parsed = raw ? JSON.parse(raw) : [];
      setWishlist(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setWishlist([]);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Could not save wishlist:", e);
    }
  }, [wishlist]);

  // Add full product object (avoid duplicates by id/_id)
  const addToWishlist = useCallback((product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id || p._id === product._id)) {
        return prev; // already in wishlist
      }
      return [...prev, product];
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

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
