import React, { useState, useCallback } from "react";
import { SearchIcon, X } from "lucide-react";
import HeroSuggestions from "./HeroSuggestions";
import PropTypes from "prop-types";

export default function HeroSearch({
  safeSearch,
  setSearch,
  onSubmit,
  menuItems,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

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

        {showSuggestions && (
          <HeroSuggestions
            suggestions={suggestions}
            safeSearch={safeSearch}
            handleSuggestionClick={handleSuggestionClick}
          />
        )}
      </div>
    </div>
  );
}

HeroSearch.propTypes = {
  safeSearch: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  menuItems: PropTypes.array.isRequired,
};
