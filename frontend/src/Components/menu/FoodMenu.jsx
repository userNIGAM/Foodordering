import React, { useState, useEffect } from "react";
import axios from "axios";
import Chatbot from "../pages/chat/Chatbot";
import api from "../../services/api";

const FoodMenu = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        // Use axios to fetch data
        const response = await api.get("/api/menu-items/");
        setMenuItems(response.data.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching menu items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const categories = [
    { id: "all", name: "All Items" },
    { id: "burgers", name: "Burgers" },
    { id: "pizzas", name: "Pizzas" },
    { id: "sandwiches", name: "Sandwiches" },
    { id: "fries", name: "Fries & Sides" },
    { id: "beverages", name: "Beverages" },
    { id: "desserts", name: "Desserts" },
    { id: "starters", name: "Starters" },
    { id: "mains", name: "Main Courses" },
  ];

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const addToCart = (item) => {
    // Check if item already exists in cart
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);

    if (existingItem) {
      // If exists, increase quantity
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      // If new, add with quantity 1
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    // Show notification
    alert(`Added ${item.name} to cart!`);
  };

  const buyNow = (item) => {
    addToCart(item);
    // In a real app, you would navigate to the cart page
    alert(`Added ${item.name} to cart! Proceeding to checkout...`);
  };

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

  // Calculate total items in cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading)
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B2635]"></div>
          <p className="mt-4 text-lg text-gray-600">Loading menu...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-xl font-bold text-gray-800">
            Error Loading Menu
          </h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#8B2635] text-white px-4 py-2 rounded-lg hover:bg-[#2E3532] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-12 px-4 my-20">
      <div className="container mx-auto">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-[#2E3532] to-[#8B2635] text-white rounded-xl shadow-lg mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Fast Food Express
          </h2>
          <p className="text-xl max-w-2xl mx-auto px-4">
            Delicious fast food delivered to your door. Fresh ingredients, quick
            service!
          </p>
        </section>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed top-20 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
            <div className="flex items-center">
              <i className="fas fa-shopping-cart text-[#8B2635] mr-2"></i>
              <span className="font-bold">{totalItems} items</span>
            </div>
            <button className="mt-2 bg-[#8B2635] text-white px-3 py-1 rounded text-sm w-full">
              View Cart ($
              {cart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
              )
            </button>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-6 py-2 rounded-full border font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-[#8B2635] text-white border-[#8B2635]"
                  : "bg-white border-[#88A096] text-[#88A096] hover:bg-[#88A096] hover:text-white"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-utensils text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600">
              No items found in this category
            </h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
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
                    <h3 className="text-xl font-serif font-bold">
                      {item.name}
                    </h3>
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
                      onClick={() => buyNow(item)}
                    >
                      <i className="fas fa-bolt mr-2"></i>
                      Buy Now
                    </button>
                    <button
                      className="flex-1 bg-white border border-[#8B2635] text-[#8B2635] py-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                      onClick={() => addToCart(item)}
                    >
                      <i className="fas fa-cart-plus mr-2"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
            <div className="flex items-center mb-2">
              <i className="fas fa-shopping-cart text-[#8B2635] mr-2"></i>
              <span className="font-bold">{totalItems} items</span>
            </div>
            <div className="font-bold mb-2">
              Total: $
              {cart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </div>
            <Link
              to="/order"
              className="block w-full bg-[#8B2635] text-white px-3 py-2 rounded text-sm text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}

        {/* Newsletter Section */}
        <section className="py-16 bg-[#88A096] text-white rounded-xl mt-16 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Get Exclusive Deals
          </h2>
          <p className="max-w-2xl mx-auto mb-8 px-4">
            Subscribe to our newsletter and receive exclusive discounts and
            offers every week.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto px-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2635] text-gray-800"
            />
            <button className="bg-[#8B2635] px-6 py-3 rounded-lg font-medium hover:bg-[#2E3532] transition">
              Subscribe
            </button>
          </div>
        </section>
        <Chatbot />
      </div>
    </div>
  );
};

export default FoodMenu;
