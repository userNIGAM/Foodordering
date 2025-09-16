import React, { useState } from "react";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiEye,
  FiShare2,
  FiTruck,
  FiHeart,
} from "react-icons/fi";
import SettingsHeader from "./SettingsHeader";
import SettingsNav from "./SettingsNav";
import PreferencesSection from "./sections/PreferencesSection";
import PrivacySection from "./sections/PrivacySection";
import DeliverySection from "./sections/DeliverySection";
import AccessibilitySection from "./sections/AccessibilitySection";

export default function SettingsSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState("preferences");

  const [settings, setSettings] = useState({
    preferences: {
      defaultView: "grid",
      autoCompleteAddress: true,
      showRecentSearches: true,
      quickReorder: true,
      estimatedDeliveryTimes: true,
    },
    privacy: {
      searchHistory: true,
      orderHistory: true,
      showRecentlyViewed: true,
      shareDataForPersonalization: true,
    },
    delivery: {
      defaultDeliveryInstructions: "Leave at door",
      contactlessDelivery: true,
      leaveAtDoor: true,
      defaultTipPercentage: 15,
    },
    accessibility: {
      highContrastMode: false,
      largerText: false,
      reduceAnimations: true,
    },
  });

  const [formData, setFormData] = useState({ ...settings });

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setSettings({ ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...settings });
    setIsEditing(false);
  };

  const subSections = [
    { id: "preferences", label: "App Preferences", icon: <FiEye /> },
    { id: "privacy", label: "Privacy", icon: <FiShare2 /> },
    { id: "delivery", label: "Delivery Options", icon: <FiTruck /> },
    { id: "accessibility", label: "Accessibility", icon: <FiHeart /> },
  ];

  const renderContent = () => {
    switch (activeSubSection) {
      case "preferences":
        return (
          <PreferencesSection
            data={formData.preferences}
            onChange={handleInputChange}
            isEditing={isEditing}
          />
        );
      case "privacy":
        return (
          <PrivacySection
            data={formData.privacy}
            onChange={handleInputChange}
            isEditing={isEditing}
          />
        );
      case "delivery":
        return (
          <DeliverySection
            data={formData.delivery}
            onChange={handleInputChange}
            isEditing={isEditing}
          />
        );
      case "accessibility":
        return (
          <AccessibilitySection
            data={formData.accessibility}
            onChange={handleInputChange}
            isEditing={isEditing}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Select a category to manage your preferences
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <SettingsHeader
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={handleCancel}
        onEdit={() => setIsEditing(true)}
      />

      <SettingsNav
        items={subSections}
        active={activeSubSection}
        onChange={setActiveSubSection}
      />

      <div className="bg-white p-6 rounded-lg border border-gray-200 flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}
