import React from "react";
import ToggleSwitch from "../ui/ToggleSwitch";

export default function PrivacySection({ data, onChange, isEditing }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">Save Search History</h4>
          <p className="text-sm text-gray-500">
            Store your search terms for quicker access
          </p>
        </div>
        <ToggleSwitch
          checked={data.searchHistory}
          onChange={(val) => onChange("privacy", "searchHistory", val)}
          disabled={!isEditing}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">Save Order History</h4>
          <p className="text-sm text-gray-500">
            Keep a record of your past orders
          </p>
        </div>
        <ToggleSwitch
          checked={data.orderHistory}
          onChange={(val) => onChange("privacy", "orderHistory", val)}
          disabled={!isEditing}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">Show Recently Viewed</h4>
          <p className="text-sm text-gray-500">
            Display restaurants you've recently viewed
          </p>
        </div>
        <ToggleSwitch
          checked={data.showRecentlyViewed}
          onChange={(val) => onChange("privacy", "showRecentlyViewed", val)}
          disabled={!isEditing}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">
            Personalized Recommendations
          </h4>
          <p className="text-sm text-gray-500">
            Use your data to suggest relevant restaurants
          </p>
        </div>
        <ToggleSwitch
          checked={data.shareDataForPersonalization}
          onChange={(val) =>
            onChange("privacy", "shareDataForPersonalization", val)
          }
          disabled={!isEditing}
        />
      </div>
    </div>
  );
}
