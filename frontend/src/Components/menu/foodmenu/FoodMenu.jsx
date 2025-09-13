import { useState } from "react";
import Layout from "../../layout/Layout";
import HeroSection from "../HeroSection";
import { useMenuItems } from "../../hooks/useMenuItems";
import FoodMenuHeader from "./FoodMenuHeader";
import FoodMenuFilters from "./FoodMenuFilters";
import FoodMenuContent from "./FoodMenuContent";

export default function FoodMenu() {
  const [viewMode, setViewMode] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
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
  } = useMenuItems();

  const totalItems = filteredItems.length;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <HeroSection
          search={filters.search}
          setSearch={(value) =>
            setFilters((prev) => ({ ...prev, search: value }))
          }
          onSubmit={(search) => setFilters((prev) => ({ ...prev, search }))}
          menuItems={items}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <FoodMenuFilters
              filters={filters}
              setFilters={setFilters}
              priceRange={priceRange}
              loading={loading}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalItems={totalItems}
            />

            <div className="flex-1">
              <FoodMenuHeader
                totalItems={totalItems}
                search={filters.search}
                sort={sort}
                setSort={setSort}
                loading={loading}
              />

              <FoodMenuContent
                loading={loading}
                error={error}
                filteredItems={filteredItems}
                fetchItems={fetchItems}
                resetFilters={() =>
                  setFilters({
                    category: "all",
                    price: priceRange,
                    rating: 0,
                    search: "",
                  })
                }
                viewMode={viewMode}
                priceRange={priceRange}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
