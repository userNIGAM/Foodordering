import React from "react";

export default function SettingsNav({ items, active, onChange }) {
  return (
    <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
      {items.map((sub) => (
        <button
          key={sub.id}
          onClick={() => onChange(sub.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap ${
            active === sub.id
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {sub.icon}
          <span>{sub.label}</span>
        </button>
      ))}
    </div>
  );
}
