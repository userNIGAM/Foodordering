// src/components/profile/PlaceholderSection.jsx
import React from "react";

export default function PlaceholderSection({ title }) {
  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-600">This section is coming soon.</p>
    </div>
  );
}
