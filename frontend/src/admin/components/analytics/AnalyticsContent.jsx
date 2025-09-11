import React from "react";
import { TrendingUp } from "lucide-react";

const AnalyticsContent = ({ salesData }) => {
  return (
    <div className="text-center py-16">
      <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Analytics Dashboard
      </h3>
      <p className="text-gray-500">Advanced analytics coming soon...</p>
    </div>
  );
};

export default AnalyticsContent;
