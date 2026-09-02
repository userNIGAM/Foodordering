// Create a new component: SearchableCategoryFilter.jsx
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { ChevronDown, Search, X } from "lucide-react";
import api from "../../services/api";

const SearchableCategoryFilter = ({ value, onChange, disabled }) => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/categories");
        if (response.data.success) {
          setCategories(response.data.data);
          setFilteredCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const handleSelect = useCallback(
    (category) => {
      onChange(category.name);
      setSearchTerm(category.name);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange("all");
    setSearchTerm("");
    setIsOpen(false);
  }, [onChange]);

  return (
    <div className="relative mb-6">
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        Category
      </label>

      <div className="relative">
        <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 text-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search categories..."
            disabled={disabled || loading}
            className="flex-1 bg-transparent outline-none"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="ml-2 text-gray-400 hover:text-gray-600"
              disabled={disabled}
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-2 text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            <ChevronDown size={16} className={isOpen ? "rotate-180" : ""} />
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {loading ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                Loading categories...
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                {searchTerm ? "No categories found" : "No categories available"}
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    value === category.name
                      ? "bg-indigo-50 text-indigo-700"
                      : ""
                  }`}
                  onClick={() => handleSelect(category)}
                >
                  {category.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SearchableCategoryFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SearchableCategoryFilter;
