import React, { useState, useEffect } from "react";
import Chatbot from "../pages/chat/Chatbot";
import api from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";

import HeroSection from "./HeroSection";
import CartSummary from "./CartSummary";
import CategoryFilters from "./CategoryFilters";
import FoodGrid from "./FoodGrid";
import NewsletterSection from "./NewsletterSection";

const FoodMenu = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cart, addToCart, getCartItemsCount, getCartTotal } = useCart();
  const { getWishlistCount } = useWishlist();

  // Fetch data
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Menu
          </h2>
          <p className="text-gray-600">{error}</p>
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
        <HeroSection />

        {/* Floating Cart + Wishlist Summary */}
        {(cart && cart.length > 0) || getWishlistCount() > 0 ? (
          <div className="flex flex-col gap-3 fixed top-20 right-4 z-20">
            {cart && cart.length > 0 && (
              <CartSummary
                itemsCount={getCartItemsCount()}
                total={getCartTotal()}
                onViewCart={() => (window.location.href = "/checkout")}
              />
            )}
            {getWishlistCount() > 0 && (
              <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 text-center">
                <p className="font-semibold text-slate-800">
                  ❤️ {getWishlistCount()} Favorites
                </p>
                <button
                  onClick={() => (window.location.href = "/wishlist")}
                  className="mt-2 w-full bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition"
                >
                  View Wishlist
                </button>
              </div>
            )}
          </div>
        ) : null}

        <CategoryFilters
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <FoodGrid items={filteredItems} addToCart={addToCart} />

        <NewsletterSection />

        <Chatbot />
      </div>
    </div>
  );
};

export default FoodMenu;
