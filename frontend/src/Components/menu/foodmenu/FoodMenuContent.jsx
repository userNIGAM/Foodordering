import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorMessage from "../../UI/ErrorMessage";
import FoodGrid from "../FoodGrid";

export default function FoodMenuContent({
  loading,
  error,
  filteredItems,
  fetchItems,
  resetFilters,
  viewMode,
  // priceRange,
}) {
  if (loading) return <LoadingSpinner message="Loading delicious options..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchItems} />;
  if (filteredItems.length > 0)
    return <FoodGrid items={filteredItems} viewMode={viewMode} />;

  return (
    <div className="text-center py-12">
      <div className="text-gray-500 text-xl mb-4">
        No items match your criteria
      </div>
      <p className="text-gray-400 mb-6">
        Try adjusting your filters or search terms
      </p>
      <button
        onClick={resetFilters}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  );
}
