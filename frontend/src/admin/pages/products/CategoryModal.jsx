import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

const CategoryModal = ({
  categories,
  addCategory,
  updateCategory,
  deleteCategory,
  onClose,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full sm:max-w-lg rounded-lg shadow-xl p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">
          Manage Categories
        </h3>

        {/* Add New */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
          <button
            onClick={() => {
              addCategory(newCategory);
              setNewCategory("");
            }}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1" /> Add
          </button>
        </div>

        {/* List */}
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {categories.map((cat, idx) => (
            <li
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between border p-2 rounded-lg gap-2"
            >
              {editingCategory === cat ? (
                <input
                  type="text"
                  defaultValue={cat}
                  onBlur={(e) => {
                    updateCategory(cat, e.target.value);
                    setEditingCategory(null);
                  }}
                  className="flex-1 px-2 py-1 border rounded text-sm sm:text-base"
                  autoFocus
                />
              ) : (
                <span className="text-sm sm:text-base">{cat}</span>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() =>
                    setEditingCategory(editingCategory === cat ? null : cat)
                  }
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => deleteCategory(cat)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Close */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
