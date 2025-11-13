import React from "react";

const ProfileField = ({ label, icon, name, value, editing, onChange }) => (
  <div>
    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-2">
      {icon}
      {label}
    </label>
    {editing ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    ) : (
      <div className="px-4 py-2 text-gray-800">{value}</div>
    )}
  </div>
);

export default ProfileField;
