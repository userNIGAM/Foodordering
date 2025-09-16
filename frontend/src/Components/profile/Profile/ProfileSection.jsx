import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, MapPin, Edit3, Camera, Save } from "lucide-react";

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    username: "@alexj",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "January 2022",
    bio: "Product designer with a passion for creating intuitive user experiences. Love hiking and photography in my free time.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80",
  });

  const [formData, setFormData] = useState({ ...profile });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setProfile({ ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">
          Profile Information
        </h2>
        <p className="text-gray-500 mt-1">Manage your personal information</p>
      </div>

      {/* Profile Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-8"
      >
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
                <input type="file" className="hidden" />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {profile.name}
            </h3>
            <p className="text-gray-500">{profile.username}</p>
            <p className="text-gray-400 text-sm mt-1">
              Member since {profile.joinDate}
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-2">
                <User size={18} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="px-4 py-2 text-gray-800">{profile.name}</div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-2">
                <Mail size={18} />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="px-4 py-2 text-gray-800">{profile.email}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-2">
                <Phone size={18} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="px-4 py-2 text-gray-800">{profile.phone}</div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-2">
                <MapPin size={18} />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="px-4 py-2 text-gray-800">
                  {profile.location}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-2">
              <Edit3 size={18} />
              Bio
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                rows="3"
              />
            ) : (
              <div className="px-4 py-2 text-gray-800 leading-relaxed">
                {profile.bio}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={18} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 size={18} />
              Edit Profile
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSection;
