// src/components/ProductCard.jsx
import React from "react";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../../../contexts/CartContext";
import { useWishlist } from "../../../contexts/WishlistContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // derive wishlist state from context (keeps component pure)
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    // you can add a toast here if you want:
    // toast.success(`${product.name} added to cart`);
  };

  const toggleWishlist = () => {
    if (isWishlisted) removeFromWishlist(product.id || product._id);
    else addToWishlist(product); // pass the full product
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-amber-400 text-amber-400" />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-slate-300" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
        />

        {product.popular && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Popular
          </div>
        )}

        <div className="absolute top-3 right-3">
          <div
            className={`w-5 h-5 rounded-full border-2 ${
              product.isVeg ? "border-green-500" : "border-red-500"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full m-1.5 ${
                product.isVeg ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
        </div>

        <button
          onClick={toggleWishlist}
          className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-slate-600"
            }`}
          />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
          <span className="text-indigo-600 font-bold">₹{product.price}</span>
        </div>

        <p className="text-slate-600 text-sm mb-3 flex-grow">{product.desc}</p>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className="flex mr-1">{renderStars(product.rating)}</div>
            <span className="text-slate-500 text-sm ml-1">
              {product.rating}
            </span>
          </div>
          <span className="text-slate-500 text-sm bg-slate-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <div className="flex justify-between text-sm text-slate-500 mb-4">
          <span>⏱️ {product.cookTime}</span>
          <span>
            {product.spicyLevel === "Hot" && "🌶️🌶️🌶️"}
            {product.spicyLevel === "Medium" && "🌶️🌶️"}
            {product.spicyLevel === "Mild" && "🌶️"}
            {product.spicyLevel}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-indigo-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors mt-auto"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
