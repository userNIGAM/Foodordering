import React from "react";

const CategoryFilters = ({ categories, activeCategory, setActiveCategory }) => (
  <div className="flex flex-wrap justify-center gap-3 mb-12">
    {categories.map((category) => (
      <button
        key={category.id}
        className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${
          activeCategory === category.id
            ? "bg-[#8B2635] text-white border-[#8B2635] shadow-md"
            : "bg-white border-[#88A096] text-[#88A096] hover:bg-[#88A096] hover:text-white"
        }`}
        onClick={() => setActiveCategory(category.id)}
      >
        {category.name}
      </button>
    ))}
  </div>
);

export default CategoryFilters;
