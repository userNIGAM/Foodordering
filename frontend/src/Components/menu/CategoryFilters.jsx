import React from "react";
import PropTypes from "prop-types";

const CategoryFilters = ({ categories, activeCategory, setActiveCategory }) => (
  <div className="flex flex-wrap justify-center gap-3 mb-12">
    {categories.map((category) => (
      <button
        key={category.id || category}
        className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${
          activeCategory === category.id || activeCategory === category
            ? "bg-[#8B2635] text-white border-[#8B2635] shadow-md"
            : "bg-white border-[#88A096] text-[#88A096] hover:bg-[#88A096] hover:text-white"
        }`}
        onClick={() => setActiveCategory(category.id || category)}
      >
        {category.name || category}
      </button>
    ))}
  </div>
);

CategoryFilters.propTypes = {
  categories: PropTypes.array.isRequired,
  activeCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setActiveCategory: PropTypes.func.isRequired,
};

export default CategoryFilters;
