import React from "react";
import { Sun, Moon } from "lucide-react";

export default function ToggleSwitch({
  checked,
  onChange,
  disabled,
  ariaLabel = "Toggle Switch",
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-label={ariaLabel}
      />

      {/* Track */}
      <div
        className="
          relative w-12 h-6 rounded-full
          bg-gray-300 dark:bg-gray-700
          peer-checked:bg-indigo-600 
          transition-colors
        "
      >
        {/* Icons */}
        <Sun className="absolute left-1 top-1 h-4 w-4 text-yellow-400 opacity-80 peer-checked:opacity-0 transition-opacity" />
        <Moon className="absolute right-1 top-1 h-4 w-4 text-white opacity-0 peer-checked:opacity-80 transition-opacity" />

        {/* Knob */}
        <div
          className="
            absolute top-[2px] left-[2px] h-5 w-5 
            bg-white rounded-full shadow-md
            transition-all peer-checked:translate-x-6
          "
        ></div>
      </div>
    </label>
  );
}
