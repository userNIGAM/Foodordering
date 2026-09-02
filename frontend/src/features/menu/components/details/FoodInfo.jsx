import React from "react";
import { Star, Clock } from "lucide-react";

export default function FoodInfo({ item, activeTab, setActiveTab }) {
  const preparationTime = item.prepTime || item.preparationTime || "N/A";
  const calories = item.calories ?? null;
  const ingredients = Array.isArray(item.ingredients) ? item.ingredients : [];

  const capitalize = (s) =>
    typeof s === "string" && s.length > 0
      ? s.charAt(0).toUpperCase() + s.slice(1)
      : s;

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>

      <div className="flex items-center mb-4">
        <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-3">
          <Star size={16} className="fill-current mr-1" />
          <span className="font-semibold">{(item.rating ?? 0).toFixed(1)}</span>
        </div>
        <span className="text-gray-600">•</span>
        <div className="flex items-center ml-3 text-gray-600">
          <Clock size={16} className="mr-1" />
          <span>{preparationTime}</span>
        </div>
      </div>

      <p className="text-2xl font-bold text-indigo-600 mb-6">
        Rs.{Number(item.price ?? 0).toFixed(2)}
      </p>

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          {["description", "ingredients", "nutrition"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 font-medium ${
                activeTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="py-4">
          {activeTab === "description" && (
            <p className="text-gray-700">{item.description}</p>
          )}

          {activeTab === "ingredients" && (
            <ul className="list-disc list-inside text-gray-700">
              {ingredients.length > 0 ? (
                ingredients.map((ing, i) => <li key={i}>{ing}</li>)
              ) : (
                <li>No ingredients listed</li>
              )}
            </ul>
          )}

          {activeTab === "nutrition" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Calories</p>
                <p className="font-semibold">
                  {calories !== null ? calories : "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold">{capitalize(item.category)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
