import React, { useCallback, memo } from "react";
import PropTypes from "prop-types";

const FiltersSidebar = memo(
  ({ filters, setFilters, priceRange, setSearch, mobile, isLoading }) => {
    const handleCategoryChange = useCallback(
      (e) => {
        setFilters((prev) => ({ ...prev, category: e.target.value }));
      },
      [setFilters]
    );

    const handleRatingChange = useCallback(
      (e) => {
        setFilters((prev) => ({ ...prev, rating: Number(e.target.value) }));
      },
      [setFilters]
    );

    const handlePriceChange = useCallback(
      (e, index) => {
        const value = Math.max(
          priceRange[0],
          Math.min(priceRange[1], Number(e.target.value))
        );
        const newPrice = [...filters.price];
        newPrice[index] = value;
        setFilters((prev) => ({ ...prev, price: newPrice }));
      },
      [filters.price, priceRange, setFilters]
    );

    const handlePriceRangeChange = useCallback(
      (values) => {
        setFilters((prev) => ({ ...prev, price: values }));
      },
      [setFilters]
    );

    const handleResetFilters = useCallback(() => {
      setFilters({
        category: "all",
        price: priceRange,
        rating: 0,
        search: "",
      });
      setSearch?.(""); // safely clear search if passed
    }, [setFilters, priceRange, setSearch]);

    return (
      <div
        className={`p-6 bg-white rounded-xl shadow-lg ${
          mobile ? "w-full mb-6" : "sticky top-24 w-80 h-fit"
        }`}
        aria-label="Filters sidebar"
      >
        <h2 className="font-bold text-xl mb-6 text-gray-800 border-b pb-3">
          Filters
        </h2>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Category
          </label>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="pizza">Pizza</option>
            <option value="burgers">Burgers</option>
            <option value="salads">Salads</option>
            <option value="drinks">Drinks</option>
            <option value="desserts">Desserts</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Price Range (${filters.price[0]} – ${filters.price[1]})
          </label>
          <div className="flex items-center space-x-3 mb-2">
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={filters.price[0]}
              onChange={(e) =>
                handlePriceRangeChange([
                  Number(e.target.value),
                  filters.price[1],
                ])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-label="Minimum price"
            />
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={filters.price[1]}
              onChange={(e) =>
                handlePriceRangeChange([
                  filters.price[0],
                  Number(e.target.value),
                ])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-label="Maximum price"
            />
          </div>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              min={priceRange[0]}
              max={priceRange[1]}
              value={filters.price[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              disabled={isLoading}
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              min={priceRange[0]}
              max={priceRange[1]}
              value={filters.price[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Minimum Rating
          </label>
          <div className="flex space-x-2">
            {[0, 2, 3, 4].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilters((prev) => ({ ...prev, rating }))}
                disabled={isLoading}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  filters.rating === rating
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {rating === 0 ? "All" : `${rating}★+`}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Dietary Preferences
          </label>
          <div className="space-y-2">
            {["Vegetarian", "Vegan", "Gluten-Free"].map((pref) => (
              <label key={pref} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">{pref}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleResetFilters}
          disabled={isLoading}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    );
  }
);

FiltersSidebar.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  priceRange: PropTypes.array.isRequired,
  setSearch: PropTypes.func,
  mobile: PropTypes.bool,
  isLoading: PropTypes.bool,
};

FiltersSidebar.displayName = "FiltersSidebar";

export default FiltersSidebar;
