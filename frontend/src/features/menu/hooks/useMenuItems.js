import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../../../services/api";

export function useMenuItems() {
  const [items, setItems] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const [filters, setFilters] = useState({
    category: "all",
    price: [0, 100],
    rating: 0,
    search: "",
  });

  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch menu items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching menu items...");

      const res = await api.get("/api/menu-items");

      console.log("Menu API response:", res.data);

      if (!res.data?.success || !Array.isArray(res.data.data)) {
        throw new Error("Invalid data format received");
      }

      const data = res.data.data;

      console.log("Menu items received:", data);

      setItems(data);

      if (data.length > 0) {
        const prices = data.map((item) => Number(item.price) || 0);

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        setPriceRange([minPrice, maxPrice]);

        setFilters((prev) => ({
          ...prev,
          price: [minPrice, maxPrice],
        }));
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load menu items. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Calculate filtered items instead of storing them separately
  const filteredItems = useMemo(() => {
    console.log("Filtering items:", {
      totalItems: items.length,
      filters,
      sort,
    });

    let updated = [...items];

    // Search
    if (filters.search?.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();

      updated = updated.filter((item) => {
        return (
          item.name?.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm) ||
          item.category?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Category
    if (filters.category && filters.category !== "all") {
      updated = updated.filter(
        (item) =>
          item.category?.toLowerCase() === filters.category.toLowerCase(),
      );
    }

    // Price
    if (filters.price && filters.price.length === 2) {
      updated = updated.filter((item) => {
        const price = Number(item.price) || 0;

        return (
          price >= Number(filters.price[0]) && price <= Number(filters.price[1])
        );
      });
    }

    // Rating
    if (Number(filters.rating) > 0) {
      updated = updated.filter(
        (item) =>
          Number(item.ratings?.average || item.rating || 0) >=
          Number(filters.rating),
      );
    }

    // Sorting
    switch (sort) {
      case "priceLowHigh":
        updated.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;

      case "priceHighLow":
        updated.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;

      case "rating":
        updated.sort(
          (a, b) =>
            Number(b.ratings?.average || b.rating || 0) -
            Number(a.ratings?.average || a.rating || 0),
        );
        break;

      case "name":
        updated.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;

      case "newest":
      default:
        updated.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        break;
    }

    console.log("Filtered items result:", updated);

    return updated;
  }, [items, filters, sort]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(items.map((item) => item.category)),
    ].filter(Boolean);

    return ["all", ...uniqueCategories];
  }, [items]);

  return {
    items,
    filteredItems,
    priceRange,
    filters,
    setFilters,
    sort,
    setSort,
    loading,
    error,
    fetchItems,
    categories,
  };
}
