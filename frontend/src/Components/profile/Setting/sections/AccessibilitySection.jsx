import React from "react";
import ToggleSwitch from "../ui/ToggleSwitch";

export default function AccessibilitySection({ data, onChange, isEditing }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Accessibility</h3>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">High Contrast Mode</h4>
          <p className="text-sm text-gray-500">
            Increase color contrast for better visibility
          </p>
        </div>
        <ToggleSwitch
          checked={data.highContrastMode}
          onChange={(val) => onChange("accessibility", "highContrastMode", val)}
          disabled={!isEditing}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">Larger Text</h4>
          <p className="text-sm text-gray-500">
            Increase text size across the application
          </p>
        </div>
        <ToggleSwitch
          checked={data.largerText}
          onChange={(val) => onChange("accessibility", "largerText", val)}
          disabled={!isEditing}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">Reduce Animations</h4>
          <p className="text-sm text-gray-500">
            Minimize motion and animations in the app
          </p>
        </div>
        <ToggleSwitch
          checked={data.reduceAnimations}
          onChange={(val) => onChange("accessibility", "reduceAnimations", val)}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
}
