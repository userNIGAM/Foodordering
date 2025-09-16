import React from "react";
import ToggleSwitch from "../ui/ToggleSwitch";
import SelectField from "../ui/SelectField";

export default function DeliverySection({ data, onChange, isEditing }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Delivery Preferences
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Default Delivery Instructions
        </label>
        <textarea
          value={data.defaultDeliveryInstructions}
          onChange={(e) =>
            onChange("delivery", "defaultDeliveryInstructions", e.target.value)
          }
          disabled={!isEditing}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="E.g., Leave at door, call when arrived, etc."
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">Contactless Delivery</h4>
          <p className="text-sm text-gray-500">
            Prefer no-contact delivery when available
          </p>
        </div>
        <ToggleSwitch
          checked={data.contactlessDelivery}
          onChange={(val) => onChange("delivery", "contactlessDelivery", val)}
          disabled={!isEditing}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">Leave at Door</h4>
          <p className="text-sm text-gray-500">
            Default to leaving food at door instead of hand-off
          </p>
        </div>
        <ToggleSwitch
          checked={data.leaveAtDoor}
          onChange={(val) => onChange("delivery", "leaveAtDoor", val)}
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Default Tip Percentage
        </label>
        <SelectField
          value={data.defaultTipPercentage}
          onChange={(val) =>
            onChange("delivery", "defaultTipPercentage", parseInt(val))
          }
          disabled={!isEditing}
          options={[
            { value: "0", label: "No tip" },
            { value: "10", label: "10%" },
            { value: "15", label: "15%" },
            { value: "20", label: "20%" },
            { value: "25", label: "25%" },
          ]}
        />
      </div>
    </div>
  );
}
