export default function FoodMenuHeader({
  totalItems,
  search,
  sort,
  setSort,
  loading,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Our Menu</h1>
        <p className="text-gray-600 mt-1">
          {totalItems} {totalItems === 1 ? "item" : "items"} found
          {search && ` for "${search}"`}
        </p>
      </div>

      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="newest">Newest First</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>
    </div>
  );
}
