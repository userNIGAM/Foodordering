/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getUserProfile } from "../../../services/userService";
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
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    bio: "",
    avatar: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        if (res.data.success) {
          const u = res.data.user;

          setProfile(u);
          setFormData({
            fullName: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            email: u.email || "",
            phoneNumber: u.phoneNumber || "",
            location: u.location || "",
            bio: u.bio || "",
            avatar: u.avatar || null,
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Failed to fetch profile!");
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarChange = (file) => {
    setFormData((prev) => ({ ...prev, avatar: file }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const fd = new FormData();

    // Split full name before sending ✔️
    const [firstName = "", ...rest] = formData.fullName.split(" ");
    const lastName = rest.join(" ");

    fd.append("firstName", firstName);
    fd.append("lastName", lastName);
    fd.append("bio", formData.bio);
    fd.append("phoneNumber", formData.phoneNumber);
    fd.append("location", formData.location);

    if (formData.avatar instanceof File) {
      fd.append("avatar", formData.avatar);
    }

    try {
      const res = await api.put("/api/user/update", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setProfile(res.data.user);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
      email: profile.email || "",
      phoneNumber: profile.phoneNumber || "",
      location: profile.location || "",
      bio: profile.bio || "",
      avatar: profile.avatar || null,
    });
  };

  if (!profile) return <ProfileSkeleton />;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">
          Profile Information
        </h2>
        <p className="text-gray-500 mt-1">Manage your personal details</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-8"
      >
        <ProfileHeader
          profile={{ ...profile, avatar: formData.avatar }}
          isEditing={isEditing}
          onAvatarChange={handleAvatarChange}
        />

        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              label="Full Name"
              icon={<User size={18} />}
              name="fullName"
              value={formData.fullName}
              editing={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Email"
              icon={<Mail size={18} />}
              name="email"
              value={formData.email}
              editing={false} // Email should not be editable
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              label="Phone"
              icon={<Phone size={18} />}
              name="phoneNumber"
              value={formData.phoneNumber}
              editing={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Location"
              icon={<MapPin size={18} />}
              name="location"
              value={formData.location}
              editing={isEditing}
              onChange={handleChange}
            />
          </div>

          <ProfileBio
            label="Bio"
            icon={<Edit3 size={18} />}
            name="bio"
            value={formData.bio}
            editing={isEditing}
            onChange={handleChange}
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
