import React from "react";
import { Camera } from "lucide-react";

const ProfileHeader = ({ profile, isEditing, onAvatarChange }) => {
  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="relative">
        <img
          src={profile.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
        />
        {isEditing && (
          <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer border border-gray-200 hover:bg-gray-50 transition-colors">
            <Camera size={16} className="text-gray-600" />
            <input
              type="file"
              className="hidden"
              onChange={(e) => onAvatarChange(e.target.files[0])}
            />
          </label>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
        <p className="text-gray-500">{profile.username}</p>
        <p className="text-gray-400 text-sm mt-1">
          Member since {profile.joinDate}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
