import React from "react";

export default function ProfileSection({ user }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">
        Profile Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            First Name
          </label>
          <input
            type="text"
            defaultValue={user?.name?.split(" ")[0] || ""}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Last Name
          </label>
          <input
            type="text"
            defaultValue={user?.name?.split(" ")[1] || ""}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Email
        </label>
        <input
          type="email"
          defaultValue={user?.email || ""}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Bio
        </label>
        <textarea
          rows={4}
          placeholder="Tell us about yourself..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
        Save Changes
      </button>
    </div>
  );
}
