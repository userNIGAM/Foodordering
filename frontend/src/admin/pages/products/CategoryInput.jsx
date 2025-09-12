import React, { useState } from "react";

const CategoryInput = ({
  categories,
  formData,
  setFormData,
  openCategoryModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Category *
      </label>
      <div className="relative">
        <input
          type="text"
          value={formData.category}
          onChange={(e) => {
            setFormData({ ...formData, category: e.target.value });
            setSearchTerm(e.target.value);
          }}
          placeholder="Type or select category..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Dropdown */}
        {searchTerm && (
          <ul className="absolute z-20 w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg text-sm sm:text-base">
            {filteredCategories.map((cat, i) => (
              <li
                key={i}
                onClick={() => {
                  setFormData({ ...formData, category: cat });
                  setSearchTerm("");
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {cat}
              </li>
            ))}
            {filteredCategories.length === 0 && (
              <li
                onClick={() => {
                  setFormData({ ...formData, category: searchTerm });
                  setSearchTerm("");
                }}
                className="px-4 py-2 cursor-pointer bg-blue-50 text-blue-700"
              >
                ➕ Add "{searchTerm}"
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Manage Categories Button */}
      <button
        type="button"
        onClick={openCategoryModal}
        className="mt-3 w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
      >
        Manage Categories
      </button>
    </div>
  );
};

export default CategoryInput;
