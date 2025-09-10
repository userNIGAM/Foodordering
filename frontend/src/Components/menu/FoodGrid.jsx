import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, Clock } from "lucide-react";
import PropTypes from "prop-types";
import { useCart } from "../../contexts/CartContext";

const FoodCard = memo(({ item }) => {
  const { addToCart } = useCart();
  const handleImageError = (e) => {
    e.target.src = "/placeholder-food.jpg";
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <Link to={`/menu/${item._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={item.image || "/placeholder-food.jpg"}
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
          <div className="absolute top-3 right-3">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors">
              <Heart size={16} className="text-gray-600 hover:text-red-500" />
            </button>
          </div>
          {item.isPopular && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Popular
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                <Star size={14} className="fill-current mr-1" />
                <span className="text-sm font-semibold">
                  {item.rating?.toFixed(1) || "4.5"}
                </span>
              </div>
              <div className="flex items-center ml-3 text-gray-500 text-sm">
                <Clock size={14} className="mr-1" />
                <span>15-25 min</span>
              </div>
            </div>

            <span className="text-indigo-600 font-bold text-lg">
              ${item.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault(); // prevent navigating when clicking the button
              addToCart(item);
            }}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </Link>
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
