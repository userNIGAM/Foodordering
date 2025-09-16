import React from "react";
import { FiSave, FiEdit2, FiX } from "react-icons/fi";

export default function SettingsHeader({
  isEditing,
  onSave,
  onCancel,
  onEdit,
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Settings</h2>

      <div className="flex space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2"
            >
              <FiSave size={16} />
              <span>Save Changes</span>
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium flex items-center space-x-2"
            >
              <FiX size={16} />
              <span>Cancel</span>
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2"
          >
            <FiEdit2 size={16} />
            <span>Edit</span>
          </button>
        )}
      </div>
    </div>
  );
}
