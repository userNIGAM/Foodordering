import { Funnel, Grid, List } from "lucide-react";
import FiltersSidebar from "../FiltersSidebar/FiltersSidebar";

export default function FoodMenuFilters({
  filters,
  setFilters,
  priceRange,
  loading,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  viewMode,
  setViewMode,
  totalItems,
}) {
  return (
    <>
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block">
        <FiltersSidebar
          filters={filters}
          setFilters={setFilters}
          priceRange={priceRange}
          isLoading={loading}
        />
      </div>

      {/* Mobile button */}
      <div className="lg:hidden flex justify-between items-center mb-6">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm"
        >
          <Funnel size={18} className="mr-2" />
          Filters
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{totalItems} items</span>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${
              viewMode === "grid"
                ? "bg-indigo-100 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${
              viewMode === "list"
                ? "bg-indigo-100 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)}>✕</button>
              </div>
              <FiltersSidebar
                filters={filters}
                setFilters={setFilters}
                priceRange={priceRange}
                mobile
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
