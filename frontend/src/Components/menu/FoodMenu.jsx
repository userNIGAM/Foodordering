// FoodMenu.jsx
import React, { useState } from "react";
import Chatbot from "../pages/chat/Chatbot";
import { menuItems } from "./menuItem";
const FoodMenu = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showRecipe, setShowRecipe] = useState(null);

  const categories = [
    { id: "all", name: "All Dishes" },
    { id: "starters", name: "Starters" },
    { id: "mains", name: "Main Courses" },
    { id: "desserts", name: "Desserts" },
  ];

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

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

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-12 px-4 my-20">
      <div className="container mx-auto">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-[#2E3532] to-[#8B2635] text-white rounded-xl shadow-lg mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Our Exquisite Menu
          </h2>
          <p className="text-xl max-w-2xl mx-auto px-4">
            Indulge in our carefully crafted dishes made with the finest
            ingredients and traditional techniques.
          </p>
        </section>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#8B2635] text-white px-3 py-1 rounded-full text-sm">
                  ${item.price}
                </div>
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

                <button
                  className="w-full bg-[#8B2635] text-white py-2 rounded-lg flex items-center justify-center hover:bg-[#2E3532] transition"
                  onClick={() =>
                    setShowRecipe(showRecipe === item.id ? null : item.id)
                  }
                >
                  <i className="fas fa-utensils mr-2"></i>
                  {showRecipe === item.id ? "Hide Recipe" : "View Recipe"}
                </button>

                {showRecipe === item.id && (
                  <div className="mt-4 p-4 bg-[#F9F5F0] rounded-lg">
                    <h4 className="font-serif font-bold mb-2">Recipe:</h4>
                    <p className="text-sm">{item.recipe}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <section className="py-16 bg-[#88A096] text-white rounded-xl mt-16 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Get Weekly Recipes
          </h2>
          <p className="max-w-2xl mx-auto mb-8 px-4">
            Subscribe to our newsletter and receive exclusive recipes and
            cooking tips every week.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto px-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow border-b-2 px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-800"
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
