import React from "react";
import PropTypes from "prop-types";

const DietaryPreferencesFilter = ({ isLoading }) => {
  const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free"];

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        Dietary Preferences
      </label>
      <div className="space-y-2">
        {dietaryOptions.map((pref) => (
          <label key={pref} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded text-indigo-600 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-700">{pref}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

DietaryPreferencesFilter.propTypes = {
  isLoading: PropTypes.bool,
};

export default DietaryPreferencesFilter;
