import React from "react";
import PropTypes from "prop-types";

const ResetFiltersButton = ({ onReset, isLoading }) => {
  return (
    <button
      onClick={onReset}
      disabled={isLoading}
      className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
    >
      Reset Filters
    </button>
  );
};

ResetFiltersButton.propTypes = {
  onReset: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ResetFiltersButton;
