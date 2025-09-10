import React, { useEffect, useState, useCallback, useMemo } from "react";
import FoodGrid from "./FoodGrid";
import FiltersSidebar from "./FiltersSidebar";
import HeroSection from "./HeroSection";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorMessage from "../UI/ErrorMessage";
import api from "../../services/api";
import { Funnel, Grid, List } from "lucide-react";
import Layout from "../layout/Layout";

export default function FoodMenu() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [filters, setFilters] = useState({
    category: "all",
    price: [0, 100],
    rating: 0,
    search: "",
  });
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch menu items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/api/menu-items");

      if (!res.data?.data || !Array.isArray(res.data.data)) {
        throw new Error("Invalid data format received");
      }

      const data = res.data.data;
      setItems(data);

      // Compute price range dynamically
      if (data.length > 0) {
        const prices = data.map((i) => i.price || 0);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));

        setPriceRange([minPrice, maxPrice]);
        setFilters((prev) => ({
          ...prev,
          price: [minPrice, maxPrice],
        }));
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load menu items. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Apply filters + sorting
  useEffect(() => {
    if (loading) return;

    let updated = [...items];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      updated = updated.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      updated = updated.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price filter
    updated = updated.filter(
      (item) => item.price >= filters.price[0] && item.price <= filters.price[1]
    );

    // Rating filter
    if (filters.rating > 0) {
      updated = updated.filter((item) => (item.rating || 0) >= filters.rating);
    }

    // Sorting
    const sortFunctions = {
      priceLowHigh: (a, b) => a.price - b.price,
      priceHighLow: (a, b) => b.price - a.price,
      rating: (a, b) => (b.rating || 0) - (a.rating || 0),
      newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      name: (a, b) => a.name.localeCompare(b.name),
    };

    if (sortFunctions[sort]) {
      updated.sort(sortFunctions[sort]);
    }

    setFilteredItems(updated);
  }, [filters, items, sort, loading]);

  const handleSearch = useCallback((searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(items.map((item) => item.category))];
    return ["all", ...uniqueCategories].filter(Boolean);
  }, [items]);

  const totalItems = filteredItems.length;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <HeroSection
          search={filters.search}
          setSearch={(value) =>
            setFilters((prev) => ({ ...prev, search: value }))
          }
          onSubmit={handleSearch}
          menuItems={items}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar (desktop) */}
            <div className="hidden lg:block">
              <FiltersSidebar
                filters={filters}
                setFilters={setFilters}
                priceRange={priceRange}
                isLoading={loading}
              />
            </div>

            {/* Main content */}
            <div className="flex-1">
              {/* Mobile filters button */}
              <div className="lg:hidden flex justify-between items-center mb-6">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm"
                >
                  <Funnel size={18} className="mr-2" />
                  Filters
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {totalItems} items
                  </span>
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

              {/* Mobile filters overlay */}
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
                        <button onClick={() => setMobileFiltersOpen(false)}>
                          ✕
                        </button>
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

              {/* Header with sorting and results */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Our Menu</h1>
                  <p className="text-gray-600 mt-1">
                    {totalItems} {totalItems === 1 ? "item" : "items"} found
                    {filters.search && ` for "${filters.search}"`}
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

              {/* Content states */}
              {loading ? (
                <LoadingSpinner message="Loading delicious options..." />
              ) : error ? (
                <ErrorMessage message={error} onRetry={fetchItems} />
              ) : filteredItems.length > 0 ? (
                <FoodGrid items={filteredItems} viewMode={viewMode} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-xl mb-4">
                    No items match your criteria
                  </div>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        category: "all",
                        price: priceRange,
                        rating: 0,
                        search: "",
                      })
                    }
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
