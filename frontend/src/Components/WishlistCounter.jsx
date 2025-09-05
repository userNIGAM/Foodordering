// src/Components/pages/WishlistCounter.jsx
import React from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext";
import { Link } from "react-router-dom";

const WishlistCounter = () => {
  const { getWishlistCount } = useWishlist();
  const count = typeof getWishlistCount === "function" ? getWishlistCount() : 0;

  return (
    <Link
      to="/wishlist"
      className="fixed top-24 right-4 bg-white rounded-full shadow-lg p-3 flex items-center justify-center z-40 hover:shadow-xl transition-all"
    >
      <div className="relative">
        <Heart className="w-6 h-6 text-red-500" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
    </Link>
  );
};

export default WishlistCounter;
