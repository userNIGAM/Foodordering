import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../services/userService";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import ProfileHeader from "./ProfileHeader";
import ProfileField from "./ProfileField";
import ProfileBio from "./ProfileBio";
import ProfileActions from "./ProfileActions";
import { User, Phone, Mail, MapPin, Edit3 } from "lucide-react";
import ProfileSkeleton from "./ProfileSkeleton";
import api from "../../../services/api";

const ProfileSection = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        if (res.data.success) {
          setProfile(res.data.user);
          setFormData(res.data.user);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Profile fetch error:");
      }
    };
    fetchProfile();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    phoneNumber: "",
    location: "",
    email: "",
    avatar: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (file) => {
    console.log("Avatar before save:", formData.avatar);
    setFormData((prev) => ({ ...prev, avatar: file }));
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName || "");
    formDataToSend.append("lastName", formData.lastName || "");
    formDataToSend.append("bio", formData.bio || "");
    formDataToSend.append("phoneNumber", formData.phoneNumber || "");

    if (formData.avatar instanceof File) {
      formDataToSend.append("avatar", formData.avatar); // 👈 MUST MATCH multer field name!
    }

    try {
      const res = await api.put("/api/user/update", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setProfile(res.data.user);
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error("Update error:", err);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };
  if (!profile) return <ProfileSkeleton />;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">
          Profile Information
        </h2>
        <p className="text-gray-500 mt-1">Manage your personal information</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-8"
      >
        <ProfileHeader
          profile={profile}
          isEditing={isEditing}
          onAvatarChange={handleAvatarChange}
        />

        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              label="Full Name"
              icon={<User size={18} />}
              name="name"
              value={formData.name}
              editing={isEditing}
              onChange={handleInputChange}
            />
            <ProfileField
              label="Email Address"
              icon={<Mail size={18} />}
              name="email"
              value={formData.email}
              editing={isEditing}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              label="Phone Number"
              icon={<Phone size={18} />}
              name="phone"
              value={formData.phone}
              editing={isEditing}
              onChange={handleInputChange}
            />
            <ProfileField
              label="Location"
              icon={<MapPin size={18} />}
              name="location"
              value={formData.location}
              editing={isEditing}
              onChange={handleInputChange}
            />
          </div>

          <ProfileBio
            label="Bio"
            icon={<Edit3 size={18} />}
            name="bio"
            value={formData.bio}
            editing={isEditing}
            onChange={handleInputChange}
          />
        </div>

        <ProfileActions
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </motion.div>
    </div>
  );
};

export default ProfileSection;
