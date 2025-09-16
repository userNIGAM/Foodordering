import React from "react";

export default function HeaderSection({ activeSection }) {
  const descriptions = {
    profile: "Manage your personal information",
    security: "Secure your account with password and 2FA",
    notifications: "Manage your notification preferences",
    billing: "View and manage your billing details",
    settings: "Manage your preferences",
    logout: "Sign out of your account",
  };

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-800 capitalize">
        {activeSection}
      </h1>
      <p className="text-slate-600">{descriptions[activeSection]}</p>
    </div>
  );
}
