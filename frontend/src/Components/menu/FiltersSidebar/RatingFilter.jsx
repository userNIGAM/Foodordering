import React from "react";
import PropTypes from "prop-types";

const RatingFilter = ({ rating, setFilters, isLoading }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        Minimum Rating
      </label>
      <div className="flex space-x-2">
        {[0, 2, 3, 4].map((r) => (
          <button
            key={r}
            onClick={() => setFilters((prev) => ({ ...prev, rating: r }))}
            disabled={isLoading}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              rating === r
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {r === 0 ? "All" : `${r}★+`}
          </button>
        ))}
      </div>
    </div>
  );
};

RatingFilter.propTypes = {
  rating: PropTypes.number.isRequired,
  setFilters: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default RatingFilter;
