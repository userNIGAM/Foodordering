// src/components/ProductsGrid.jsx
import ProductCard from "./ProductCard";
import { products } from "../../lists/Products";
import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../../../contexts/CartContext";
import { X, Filter, ShoppingCart } from "lucide-react";

const ProductsGrid = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addToCart } = useCart();
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  // Filter products based on selection - MOVED TO TOP
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => {
          if (selectedCategory === "veg") return product.isVeg;
          if (selectedCategory === "nonveg") return !product.isVeg;
          if (selectedCategory === "fastfood")
            return product.category !== "Curry";
          if (selectedCategory === "spicy")
            return product.spicyLevel !== "Mild";
          return true;
        });

  // Create refs for each product card
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, filteredProducts.length);
  }, [filteredProducts]);

  // Set up Intersection Observer to detect when cards come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.indexOf(entry.target);
          if (index !== -1) {
            if (entry.isIntersecting) {
              // Card visible → animate in
              setVisibleCards((prev) => [...new Set([...prev, index])]);
            } else {
              // Card out of view → remove from visibleCards
              setVisibleCards((prev) => prev.filter((i) => i !== index));
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [filteredProducts]);

  // Filter modal content based on category
  const getModalContent = () => {
    switch (activeFilter) {
      case "veg":
        return {
          title: "Vegetarian Options",
          description:
            "Explore our delicious vegetarian dishes made with fresh ingredients.",
          items: products.filter((p) => p.isVeg),
        };
      case "nonveg":
        return {
          title: "Non-Vegetarian Specialties",
          description:
            "Hearty meals featuring premium chicken and other proteins.",
          items: products.filter((p) => !p.isVeg),
        };
      case "fastfood":
        return {
          title: "Fast Food Favorites",
          description: "Quick, delicious meals perfect for any time of day.",
          items: products.filter((p) => p.category !== "Curry"),
        };
      case "spicy":
        return {
          title: "Spicy Delights",
          description: "For those who enjoy a little heat in their meals.",
          items: products.filter((p) => p.spicyLevel !== "Mild"),
        };
      default:
        return { title: "", description: "", items: [] };
    }
  };

  const modalData = getModalContent();

  // Function to handle adding items to cart from modal
  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: You can add a toast notification here
    console.log(`${product.name} added to cart!`);
  };

  return (
    <div id="products" className="max-w-7xl mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filter by Category
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setActiveFilter("veg");
              setSelectedCategory("veg");
            }}
            className="flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium hover:bg-green-200 transition-colors"
          >
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            Veg
          </button>

          <button
            onClick={() => {
              setActiveFilter("nonveg");
              setSelectedCategory("nonveg");
            }}
            className="flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 font-medium hover:bg-red-200 transition-colors"
          >
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            Non-Veg
          </button>

          <button
            onClick={() => {
              setActiveFilter("fastfood");
              setSelectedCategory("fastfood");
            }}
            className="flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium hover:bg-blue-200 transition-colors"
          >
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            Fast Food
          </button>

          <button
            onClick={() => {
              setActiveFilter("spicy");
              setSelectedCategory("spicy");
            }}
            className="flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-800 font-medium hover:bg-orange-200 transition-colors"
          >
            <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
            Spicy
          </button>

          <button
            onClick={() => setSelectedCategory("all")}
            className="flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors"
          >
            Show All
          </button>
        </div>

        {selectedCategory !== "all" && (
          <div className="mt-4 flex items-center text-sm text-slate-600">
            <span className="bg-slate-100 px-3 py-1 rounded-full">
              Showing {filteredProducts.length} of {products.length} items
              <button
                onClick={() => setSelectedCategory("all")}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                Clear filter
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`transition-all duration-700 transform ${
              visibleCards.includes(index)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{
              transitionDelay: visibleCards.includes(index)
                ? `${(index % 4) * 100}ms`
                : "0ms",
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {activeFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-2xl font-bold text-slate-800">
                {modalData.title}
              </h2>
              <button
                onClick={() => setActiveFilter(null)}
                className="text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-slate-600 mb-6">{modalData.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modalData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate">
                          {item.name}
                        </h3>
                        <p className="text-slate-600 text-sm">₹{item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.isVeg
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.isVeg ? "Veg" : "Non-Veg"}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 ml-2">
                          {item.spicyLevel}
                        </span>
                      </div>

                      {/* Bottom-aligned Cart Button */}
                      <button
                        className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                        onClick={() => handleAddToCart(item)}
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t">
              <button
                onClick={() => setActiveFilter(null)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
