import React from "react";
import { ChevronRight } from "lucide-react";

export default function Sidebar({
  user,
  navigationItems,
  activeSection,
  setActiveSection,
}) {
  return (
    <div className="md:w-64 bg-slate-800 text-white p-6 hidden md:block">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
          {/* <navigationItems[0].icon className="w-6 h-6" /> Optional: placeholder */}
        </div>
        <div>
          <h2 className="font-semibold">{user?.name}</h2>
          <p className="text-slate-300 text-sm">{user?.email}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              item.action ? item.action() : setActiveSection(item.id)
            }
            className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
              activeSection === item.id
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-700"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
            {activeSection === item.id && (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
