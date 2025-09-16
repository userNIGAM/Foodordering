import React from "react";
import { LogOut } from "lucide-react";

export default function LogoutSection({ onLogout }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <LogOut className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">
        Ready to leave?
      </h2>
      <p className="text-slate-600 mb-6">You can always log back in anytime.</p>
      <button
        onClick={onLogout}
        className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
      >
        Confirm Logout
      </button>
    </div>
  );
}
