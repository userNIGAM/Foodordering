import React from "react";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { useWishlist } from "../../contexts/WishlistContext";

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} className="text-yellow-400">
        ★
      </span>
    );
  }

  if (hasHalfStar) {
    stars.push(
      <span key="half" className="text-yellow-400">
        ★
      </span>
    );
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={`empty-${i}`} className="text-gray-300">
        ★
      </span>
    );
  }

  return stars;
};

const FoodGrid = ({ items, addToCart }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = (itemId) => {
    if (isInWishlist(itemId)) {
      removeFromWishlist(itemId);
    } else {
      addToWishlist(itemId);
    }
  };

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {items.map((item) => {
        const wishlisted = isInWishlist(item._id);

        return (
          <div
            key={item._id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-56 object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute top-4 right-4 bg-[#8B2635] text-white px-3 py-1 rounded-full text-sm shadow">
                ₹{item.price}
              </div>
              {item.isPopular && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow">
                  Popular
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(item._id)}
                className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition"
                aria-label="Toggle Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    wishlisted ? "fill-red-500 text-red-500" : "text-slate-600"
                  }`}
                />
              </button>
            </div>

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
                <button
                  className="flex-1 bg-[#8B2635] text-white py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-[#2E3532] transition"
                  onClick={() => addToCart(item)}
                >
                  <Zap className="w-4 h-4" /> Buy Now
                </button>
                <button
                  className="flex-1 bg-white border border-[#8B2635] text-[#8B2635] py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-gray-100 transition"
                  onClick={() => addToCart(item)}
                >
                  <ShoppingCart className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FoodGrid;
