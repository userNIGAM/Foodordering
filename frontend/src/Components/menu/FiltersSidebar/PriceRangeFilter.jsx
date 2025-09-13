import React, { useCallback } from "react";
import PropTypes from "prop-types";

const PriceRangeFilter = ({ filters, setFilters, priceRange, isLoading }) => {
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

  return (
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
            handlePriceRangeChange([Number(e.target.value), filters.price[1]])
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
            handlePriceRangeChange([filters.price[0], Number(e.target.value)])
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
  );
};

PriceRangeFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  priceRange: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};

export default PriceRangeFilter;
