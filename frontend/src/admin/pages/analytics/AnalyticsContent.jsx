import React from "react";
import { TrendingUp } from "lucide-react";

const AnalyticsContent = ({ salesData }) => {
  return (
    <div className="text-center py-8 sm:py-12 md:py-16 px-4">
      <TrendingUp className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
        Analytics Dashboard
      </h3>
      <p className="text-sm sm:text-base text-gray-500">
        Advanced analytics coming soon...
      </p>
    </div>
  );
};

export default AnalyticsContent;
