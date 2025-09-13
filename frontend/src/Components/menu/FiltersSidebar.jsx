import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import SearchableCategoryFilter from "./filtersidebar/SearchableCategoryFilter";
import PriceRangeFilter from "./filtersidebar/PriceRangeFilter";
import RatingFilter from "./filtersidebar/RatingFilter";
import DietaryPreferencesFilter from "./filtersidebar/DietaryPreferencesFilter";
import ResetFiltersButton from "./filtersidebar/ResetFiltersButton";

const FiltersSidebar = memo(
  ({ filters, setFilters, priceRange, setSearch, mobile, isLoading }) => {
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

        <SearchableCategoryFilter
          value={filters.category === "all" ? "" : filters.category}
          onChange={(category) =>
            setFilters((prev) => ({ ...prev, category: category || "all" }))
          }
          disabled={isLoading}
        />

        <PriceRangeFilter
          filters={filters}
          setFilters={setFilters}
          priceRange={priceRange}
          isLoading={isLoading}
        />

        <RatingFilter
          rating={filters.rating}
          setFilters={setFilters}
          isLoading={isLoading}
        />

        <DietaryPreferencesFilter isLoading={isLoading} />

        <ResetFiltersButton
          onReset={handleResetFilters}
          isLoading={isLoading}
        />
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
