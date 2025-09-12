import React, { useState, useCallback, memo } from "react";
import { SearchIcon, X, Truck, Shield, Clock } from "lucide-react";
import PropTypes from "prop-types";
import Image from "../UI/Image";

const HeroSection = memo(({ search, setSearch, onSubmit, menuItems }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const safeSearch = search ?? "";

  const suggestions = React.useMemo(() => {
    if (safeSearch.trim() === "") return [];
    return menuItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(safeSearch.toLowerCase()) ||
          item.description.toLowerCase().includes(safeSearch.toLowerCase()) ||
          item.category.toLowerCase().includes(safeSearch.toLowerCase())
      )
      .slice(0, 5);
  }, [safeSearch, menuItems]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setShowSuggestions(false);
        onSubmit(safeSearch);
      }
    },
    [onSubmit, safeSearch]
  );

  const clearSearch = useCallback(() => {
    setSearch("");
    setShowSuggestions(false);
    onSubmit("");
  }, [setSearch, onSubmit]);

  const handleSuggestionClick = useCallback(
    (item) => {
      setSearch(item.name);
      setShowSuggestions(false);
      onSubmit(item.name);
    },
    [setSearch, onSubmit]
  );

  return (
    <>
      <section className="relative py-16 bg-gradient-to-br from-indigo-900 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Delicious Food,
              <span className="block text-yellow-400">Delivered Fast</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
              Fresh ingredients, authentic flavors, and lightning-fast delivery
              right to your door
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <Truck size={20} className="mr-2" />
                <span className="text-black">Free delivery over $25</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <Clock size={20} className="mr-2" />
                <span className="text-black">30-min average delivery</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <Shield size={20} className="mr-2" />
                <span className="text-black">Contactless delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="relative max-w-2xl my-5 mx-auto px-4">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
          <input
            type="text"
            value={safeSearch}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search for dishes, cuisines, or ingredients..."
            className="w-full pl-12 pr-10 py-4 rounded-xl shadow-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-transparent outline-none text-gray-800 text-lg"
          />
          {safeSearch && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              {suggestions.map((item) => (
                <button
                  key={item._id}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionClick(item)}
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {item.category}
                      </div>
                    </div>
                    <div className="text-indigo-600 font-bold">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showSuggestions &&
            safeSearch.trim() !== "" &&
            suggestions.length === 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 px-6 py-4 text-gray-600">
                No items found matching "{safeSearch}"
              </div>
            )}
        </div>
      </div>
    </>
  );
});

HeroSection.propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  menuItems: PropTypes.array.isRequired,
};

HeroSection.defaultProps = {
  search: "",
};

HeroSection.displayName = "HeroSection";

export default HeroSection;
