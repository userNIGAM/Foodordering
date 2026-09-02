import React from "react";
import { User } from "lucide-react";

const ProfileButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
  >
    <User className="h-6 w-6" />
  </button>
);

export default ProfileButton;
