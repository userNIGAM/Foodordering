import React, { useState, useEffect } from "react";
import axios from "axios";
import { Package, Upload, X } from "lucide-react";

//api
import api from "../../../services//api.js";

import CategoryInput from "./CategoryInput";
import CategoryModal from "./CategoryModal";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ProductsContent = () => {
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    prepTime: "",
    calories: "",
    description: "",
    ingredients: "",
    tags: "",
    isPopular: false,
  });

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/menu-items/categories/all");
      if (res.data.success) setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addCategory = async (name) => {
    if (!name.trim()) return;
    try {
      const res = await api.post("/api/menu-items/categories", { name });
      if (res.data.success) {
        setCategories([...categories, name]);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const updateCategory = async (oldName, newName) => {
    try {
      const res = await api.put(`/api/menu-items/categories/${oldName}`, {
        name: newName,
      });
      if (res.data.success) {
        setCategories(categories.map((c) => (c === oldName ? newName : c)));
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const deleteCategory = async (name) => {
    try {
      const res = await api.delete(`/api/menu-items/categories/${name}`);
      if (res.data.success) {
        setCategories(categories.filter((c) => c !== name));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // File Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("❌ File size must be less than 10MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Submit Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const actualFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      actualFormData.append(key, formData[key]);
    });
    if (imageFile) actualFormData.append("image", imageFile);

    try {
      const response = await api.post("/api/menu-items", actualFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("✅ Product added successfully!");
        setFormData({
          name: "",
          category: "",
          price: "",
          prepTime: "",
          calories: "",
          description: "",
          ingredients: "",
          tags: "",
          isPopular: false,
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        alert("❌ Failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error while adding product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <Package className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Category */}
            <CategoryInput
              categories={categories}
              formData={formData}
              setFormData={setFormData}
              openCategoryModal={() => setShowCategoryModal(true)}
            />

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Prep Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prep Time (minutes) *
              </label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={(e) =>
                  setFormData({ ...formData, prepTime: e.target.value })
                }
                placeholder="15"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Calories */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Calories *
              </label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={(e) =>
                  setFormData({ ...formData, calories: e.target.value })
                }
                placeholder="250"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ingredients
              </label>
              <input
                type="text"
                name="ingredients"
                value={formData.ingredients}
                onChange={(e) =>
                  setFormData({ ...formData, ingredients: e.target.value })
                }
                placeholder="Cheese, Tomato, Basil"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your product..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="spicy, vegetarian, gluten-free"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Image *
            </label>
            <div className="mt-2">
              {!imagePreview ? (
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageUpload}
                        required
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Popular */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPopular"
              id="isPopular"
              checked={formData.isPopular}
              onChange={(e) =>
                setFormData({ ...formData, isPopular: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="isPopular" className="ml-2 text-sm">
              Mark as Popular Item
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          categories={categories}
          addCategory={addCategory}
          updateCategory={updateCategory}
          deleteCategory={deleteCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
};

export default ProductsContent;
