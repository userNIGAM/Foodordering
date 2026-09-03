import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import ProfileSkeleton from "./ProfileSkeleton";

const ProfileHeader = ({ profile, isEditing, onAvatarChange }) => {
  const [preview, setPreview] = useState(null);

  if (!profile) return <ProfileSkeleton />;

  useEffect(() => {
    setPreview(profile.avatar || null);
  }, [profile]);

  const handleFileChange = (file) => {
    if (!file) return;
    onAvatarChange(file);
    setPreview(URL.createObjectURL(file)); // Preview before saving
  };

  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="relative">
        <img
          src={preview || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
        />

        {isEditing && (
          <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer border border-gray-200 hover:bg-gray-50 transition-colors">
            <Camera size={16} className="text-gray-600" />
            <input
              type="file"
              name="avatar" //
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </label>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800">
          {profile.firstName || profile.name || "User"}
        </h3>
        <p className="text-gray-500">{profile.email}</p>
        <p className="text-gray-400 text-sm mt-1">
          Joined{" "}
          {profile.createdAt
            ? new Date(profile.createdAt).toLocaleDateString()
            : ""}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
