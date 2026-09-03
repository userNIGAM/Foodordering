import React from "react";

export default function SecuritySection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">
        Security Settings
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            Change Password
          </h3>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
              Update Password
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            Add Additional Email
          </h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter additional email"
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-slate-800 text-white px-4 py-3 rounded-xl font-medium hover:bg-slate-900 transition-colors">
              Add Email
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            Two-Factor Authentication
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-slate-600">2FA is currently disabled</p>
            <button className="bg-slate-800 text-white px-4 py-2 rounded-xl font-medium hover:bg-slate-900 transition-colors text-sm">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
