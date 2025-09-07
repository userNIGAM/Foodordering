import React from "react";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useWishlist } from "../../contexts/WishlistContext";
import { useCart } from "../../contexts/CartContext";

// ⭐ Render Stars
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  for (let i = 0; i < fullStars; i++)
    stars.push(
      <span key={i} className="text-yellow-400">
        ★
      </span>
    );
  if (hasHalfStar)
    stars.push(
      <span key="half" className="text-yellow-400">
        ★
      </span>
    );
  for (let i = stars.length; i < 5; i++)
    stars.push(
      <span key={`empty-${i}`} className="text-gray-300">
        ★
      </span>
    );
  return stars;
};

// 🎬 Row animation
const rowVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

// 🎬 Card animation
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// 💡 Skeleton Loader
const SkeletonCard = () => (
  <div className="bg-gray-200 animate-pulse rounded-xl h-80 w-full" />
);

const FoodGrid = ({ items, loading }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const toggleWishlist = (item) => {
    if (isInWishlist(item._id)) {
      removeFromWishlist(item._id);
    } else {
      addToWishlist(item);
    }
  };

  // Skeleton shimmer
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Zap className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-600">
          No items found in this category
        </h3>
        <p className="text-gray-500">Try selecting a different category</p>
      </div>
    );
  }

  // Group items row-wise (4 per row)
  const rows = [];
  for (let i = 0; i < items.length; i += 4) {
    rows.push(items.slice(i, i + 4));
  }

  return (
    <div className="flex flex-col gap-8">
      {rows.map((rowItems, rowIndex) => {
        const { ref, inView } = useInView({
          threshold: 0.2,
          triggerOnce: false,
        });
        return (
          <motion.div
            key={rowIndex}
            ref={ref}
            variants={rowVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {rowItems.map((item) => {
              const wishlisted = isInWishlist(item._id);
              return (
                <motion.div
                  key={item._id}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    rotate: -1,
                    boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
                  }}
                  className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-56 object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80";
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute top-4 right-4 bg-[#8B2635] text-white px-3 py-1 rounded-full text-sm shadow">
                      ₹{item.price}
                    </div>
                    {item.isPopular && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow">
                        Popular
                      </div>
                    )}
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition"
                      aria-label="Toggle Wishlist"
                    >
                      <motion.div
                        whileTap={{ scale: 0.8 }}
                        animate={wishlisted ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            wishlisted
                              ? "fill-red-500 text-red-500"
                              : "text-slate-600"
                          }`}
                        />
                      </motion.div>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {item.name}
                      </h3>
                      <div className="flex">{renderStars(item.rating)}</div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 flex-grow">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-[#88A096] mb-4">
                      <span>🔥 {item.calories} cal</span>
                      <span>⏱ {item.prepTime} min</span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 relative overflow-hidden bg-[#8B2635] text-white py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-[#2E3532] transition"
                        onClick={() => addToCart(item)}
                      >
                        <span className="relative z-10 flex items-center gap-1">
                          <Zap className="w-4 h-4" /> Buy Now
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-0 hover:opacity-20 transition"></span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-white border border-[#8B2635] text-[#8B2635] py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-gray-100 transition"
                        onClick={() => addToCart(item)}
                      >
                        <ShoppingCart className="w-4 h-4" /> Add
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
};

export default FoodGrid;
