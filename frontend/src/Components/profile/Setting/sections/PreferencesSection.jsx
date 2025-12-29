import React, { useContext } from "react";
import ToggleSwitch from "../ui/ToggleSwitch";
import SelectField from "../ui/SelectField";
import { ThemeContext } from "../../../../context/ThemeContext";

export default function PreferencesSection({ data, onChange, isEditing }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // const handleThemeSwitch = (val) => {
  //   const newTheme = val ? "dark" : "light";

  //   // Update in Context
  //   if (newTheme !== theme) {
  //     toggleTheme();
  //   }

  //   // Save in user preferences state
  //   onChange("preferences", "theme", newTheme);

  //   // Save in local storage
  //   localStorage.setItem("theme", newTheme);
  // };

  const handleThemeSwitch = (val) => {
  const newTheme = val ? "dark" : "light";

  if (newTheme !== theme) {
    toggleTheme();              // context will update DOM + storage correctly
  }

  onChange("preferences", "theme", newTheme);
};
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">App Preferences</h3>
      <div className="flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h4 className="font-medium text-gray-800">
            Default Restaurant View
          </h4>{" "}
          <p className="text-sm text-gray-500">
            {" "}
            How restaurants are displayed by default{" "}
          </p>{" "}
        </div>{" "}
        <SelectField
          value={data.defaultView}
          onChange={(val) => onChange("preferences", "defaultView", val)}
          disabled={!isEditing}
          options={[
            { value: "grid", label: "Grid View" },
            { value: "list", label: "List View" },
            { value: "map", label: "Map View" },
          ]}
        />{" "}
      </div>{" "}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h4 className="font-medium text-gray-800">
            Auto-Complete Address
          </h4>{" "}
          <p className="text-sm text-gray-500">Suggest addresses as you type</p>{" "}
        </div>{" "}
        <ToggleSwitch
          checked={data.autoCompleteAddress}
          onChange={(val) =>
            onChange("preferences", "autoCompleteAddress", val)
          }
          disabled={!isEditing}
        />{" "}
      </div>{" "}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h4 className="font-medium text-gray-800">
            Show Recent Searches
          </h4>{" "}
          <p className="text-sm text-gray-500">
            {" "}
            Display your recent search history{" "}
          </p>{" "}
        </div>{" "}
        <ToggleSwitch
          checked={data.showRecentSearches}
          onChange={(val) => onChange("preferences", "showRecentSearches", val)}
          disabled={!isEditing}
        />{" "}
      </div>{" "}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h4 className="font-medium text-gray-800">Quick Reorder</h4>{" "}
          <p className="text-sm text-gray-500">
            {" "}
            Enable one-click reordering of previous meals{" "}
          </p>{" "}
        </div>{" "}
        <ToggleSwitch
          checked={data.quickReorder}
          onChange={(val) => onChange("preferences", "quickReorder", val)}
          disabled={!isEditing}
        />{" "}
      </div>
      {/* 🌙 New Dark Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">Dark Mode</h4>
          <p className="text-sm text-gray-500">
            Switch between light and dark theme appearance
          </p>
        </div>
        <ToggleSwitch
          checked={theme === "dark"} // Reflect ThemeContext state
          onChange={handleThemeSwitch}
          disabled={!isEditing}
        />
      </div>
      {/* Existing UI continues... */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800">Quick Reorder</h4>
          <p className="text-sm text-gray-500">
            Enable one-click reordering of previous meals
          </p>
        </div>
        <ToggleSwitch
          checked={data.quickReorder}
          onChange={(val) => onChange("preferences", "quickReorder", val)}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
}
