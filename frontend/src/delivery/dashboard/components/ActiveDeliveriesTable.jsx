import React, { useContext, useState } from "react";
import { User, LogOut } from "lucide-react";
import { AuthContext } from "../../../contexts/AuthContext";

const ActiveDeliveriesTable = () => {
  const { user, logout } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await logout();

      // Redirect after successful logout
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout failed:", error);

      // Still redirect if something unexpected happens
      window.location.href = "/auth";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative">
      {/* User section */}
      <div className="group relative inline-flex items-center gap-2 cursor-pointer">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : user?.email
              ? user.email.charAt(0).toUpperCase()
              : "U"}
        </div>

        {/* User name */}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {user?.name || "User"}
          </p>

          <p className="text-xs text-gray-500">{user?.email || ""}</p>
        </div>

        {/* Hover menu */}
        <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          {/* Profile */}
          <button
            type="button"
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            <User className="w-4 h-4" />
            Profile
          </button>

          <div className="border-t border-gray-100" />

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />

            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveDeliveriesTable;
