import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import api from "../../../services/api";

const SearchableCategoryFilter = ({ value, onChange, disabled }) => {
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState(value || "");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // keep input synced with parent
  useEffect(() => {
    setCategoryInput(value || "");
  }, [value]);

  const handleInputChange = useCallback(
    (e) => {
      const val = e.target.value;
      setCategoryInput(val);
      setShowSuggestions(true);

      if (!val.trim()) {
        onChange(""); // reset
      }
    },
    [onChange]
  );

  const handleSelect = useCallback(
    (category) => {
      setCategoryInput(category.name);
      onChange(category.name);
      setShowSuggestions(false);
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    setTimeout(() => setShowSuggestions(false), 200); // delay to allow click
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categoryInput.toLowerCase())
  );

  return (
    <div className="mb-6 relative">
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        Category
      </label>
      <input
        type="text"
        value={categoryInput}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        placeholder="Search categories..."
        disabled={disabled}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        aria-label="Filter by category"
      />

      {showSuggestions && filteredCategories.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={(e) => e.preventDefault()} // prevents blur
              onClick={() => handleSelect(category)}
            >
              {category.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SearchableCategoryFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SearchableCategoryFilter;
