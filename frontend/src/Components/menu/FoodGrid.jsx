import React from "react";

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
  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`Added ${item.name} to cart!`);
  };

  const handleBuyNow = (item) => {
    addToCart(item);
    alert(`Added ${item.name} to cart!`);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-utensils text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-600">
          No items found in this category
        </h3>
        <p className="text-gray-500">Try selecting a different category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
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
            <div className="absolute top-4 right-4 bg-[#8B2635] text-white px-3 py-1 rounded-full text-sm">
              ${item.price}
            </div>
            {item.isPopular && (
              <div className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                Popular
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-serif font-bold">{item.name}</h3>
              <div className="flex">{renderStars(item.rating)}</div>
            </div>

            <p className="text-gray-600 mb-4">{item.description}</p>

            <div className="flex justify-between items-center mb-4 text-sm text-[#88A096]">
              <span>
                <i className="fas fa-fire mr-1"></i> {item.calories} cal
              </span>
              <span>
                <i className="fas fa-clock mr-1"></i> {item.prepTime} min
              </span>
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 bg-[#8B2635] text-white py-2 rounded-lg flex items-center justify-center hover:bg-[#2E3532] transition"
                onClick={() => handleBuyNow(item)}
              >
                <i className="fas fa-bolt mr-2"></i>
                Buy Now
              </button>
              <button
                className="flex-1 bg-white border border-[#8B2635] text-[#8B2635] py-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                onClick={() => handleAddToCart(item)}
              >
                <i className="fas fa-cart-plus mr-2"></i>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodGrid;
