import React from "react";
import { Edit3, Save } from "lucide-react";

const ProfileActions = ({ isEditing, onEdit, onSave, onCancel }) => {
  return (
    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
      {isEditing ? (
        <>
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={18} />
            Save Changes
          </button>
        </>
      ) : (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit3 size={18} />
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfileActions;
