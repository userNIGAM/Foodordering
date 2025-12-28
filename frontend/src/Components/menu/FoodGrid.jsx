/* eslint-disable no-unused-vars */
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, Clock } from "lucide-react";
import PropTypes from "prop-types";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import Image from "../UI/Image";
import { StarHalf } from "lucide-react";

const FoodCard = memo(({ item }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { name, image, price, ratings } = item;
  const average = ratings?.average || 0;
  const count = ratings?.count || 0;

  // const handleImageError = (e) => {
  //   e.target.src = "/placeholder-food.jpg";
  // };

  const handleWishlist = (e) => {
    e.preventDefault(); // prevent navigation
    if (isInWishlist(item._id)) {
      removeFromWishlist(item._id);
    } else {
      addToWishlist(item);
    }
  };

  //-----------------------------------------------------------------------------------------//
  //                             RenderStar Function                                         //
  //-----------------------------------------------------------------------------------------//
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            size={14}
            fill="currentColor"
            className="text-yellow-500"
          />
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <StarHalf
            key={i}
            size={14}
            fill="currentColor"
            className="text-yellow-500"
          />
        );
      } else {
        stars.push(<Star key={i} size={14} className="text-gray-300" />);
      }
    }
    return stars;
  };

  //-----------------------------------------------------------------------------------------//
  //                             RenderStar Function                                         //
  //-----------------------------------------------------------------------------------------//

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <Link to={`/menu/${item._id}`} className="block">
        <div className="relative overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md"
          >
            <Heart
              size={16}
              className={
                isInWishlist(item._id) ? "text-red-500" : "text-gray-600"
              }
            />
          </button>

          {item.isPopular && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Popular
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {item.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {/* ⭐ Show stars + average number */}
            <div className="flex items-center">
              {renderStars(item.ratings?.average || 0)}
              <span className="ml-2 text-sm text-gray-600">
                {item.ratings?.average?.toFixed(1) || "0.0"}
              </span>
            </div>

            <div className="flex items-center ml-3 text-gray-500 text-sm">
              <Clock size={14} className="mr-1" />
              <span>15-25 min</span>
            </div>
          </div>

          <span className="text-indigo-600 font-bold text-lg">
            Rs.{item.price.toFixed(2)}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(item);
          }}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
});

FoodCard.propTypes = {
  item: PropTypes.object.isRequired,
};

FoodCard.displayName = "FoodCard";

const FoodGrid = memo(({ items }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No items found</div>
        <p className="text-gray-400">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {items.map((item) => (
        <FoodCard key={item._id} item={item} />
      ))}
    </div>
  );
});

FoodGrid.propTypes = {
  items: PropTypes.array.isRequired,
};

FoodGrid.displayName = "FoodGrid";

export default FoodGrid;
