// src/components/layout/Layout.jsx
import React from "react";
import Navbar from "../pages/Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="pt-24">
        {/* adjust pt-24 if navbar height differs */}
        {children}
      </main>
    </div>
  );
}
