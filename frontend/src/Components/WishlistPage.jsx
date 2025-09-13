import React from "react";
import { Heart, ArrowLeft, ShoppingCart } from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import Image from "./UI/Image";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 mt-16">
        <Link
          to="/menu"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Link>

        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-slate-600 mb-6">
            Start adding items you love by clicking the heart icon on any
            product.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/menu"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Your Wishlist</h1>
          <p className="text-slate-600">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            for later
          </p>
        </div>
        <div className="flex items-center bg-rose-50 text-rose-800 px-4 py-3 rounded-lg">
          <Heart className="w-5 h-5 mr-2 fill-rose-500 text-rose-500" />
          <span className="font-medium">{wishlist.length} Favorites</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id || product._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />

              {product.popular && (
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Popular
                </div>
              )}

              <button
                onClick={() => removeFromWishlist(product.id || product._id)}
                className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition-colors"
                aria-label="Remove from wishlist"
              >
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </button>
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 text-lg">
                  {product.name}
                </h3>
                <span className="text-indigo-600 font-bold">
                  ₹{product.price}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-3 flex-grow">
                {product.desc}
              </p>

              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div className="flex mr-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-slate-500 text-sm ml-1">
                    {product.rating}
                  </span>
                </div>
                <span className="text-slate-500 text-sm bg-slate-100 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="bg-indigo-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors mt-auto"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
