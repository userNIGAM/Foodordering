import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../../services/api";

export function useMenuItems() {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch
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

      // price range
      if (data.length > 0) {
        const prices = data.map((i) => i.price || 0);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange([minPrice, maxPrice]);
        setFilters((prev) => ({ ...prev, price: [minPrice, maxPrice] }));
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

  // Filtering + sorting
  useEffect(() => {
    if (loading) return;
    let updated = [...items];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      updated = updated.filter(
        (i) =>
          i.name.toLowerCase().includes(s) ||
          i.description.toLowerCase().includes(s) ||
          i.category.toLowerCase().includes(s)
      );
    }

    if (filters.category !== "all") {
      updated = updated.filter(
        (i) =>
          i.category &&
          i.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    updated = updated.filter(
      (i) => i.price >= filters.price[0] && i.price <= filters.price[1]
    );

    if (filters.rating > 0) {
      updated = updated.filter((i) => (i.rating || 0) >= filters.rating);
    }

    const sortMap = {
      priceLowHigh: (a, b) => a.price - b.price,
      priceHighLow: (a, b) => b.price - a.price,
      rating: (a, b) => (b.rating || 0) - (a.rating || 0),
      newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    if (sortMap[sort]) updated.sort(sortMap[sort]);

    setFilteredItems(updated);
  }, [filters, items, sort, loading]);

  const categories = useMemo(() => {
    const unique = [...new Set(items.map((i) => i.category))];
    return ["all", ...unique].filter(Boolean);
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
