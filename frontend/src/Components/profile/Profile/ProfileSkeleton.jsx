import { motion } from "framer-motion";

const SkeletonBox = ({ className }) => (
  <motion.div
    initial={{ opacity: 0.4 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
    className={`bg-gray-200 rounded-lg ${className}`}
  />
);

const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex gap-6">
        <SkeletonBox className="w-24 h-24 rounded-full" />
        <div className="space-y-2">
          <SkeletonBox className="w-40 h-4" />
          <SkeletonBox className="w-32 h-3" />
          <SkeletonBox className="w-28 h-3" />
        </div>
      </div>

      <div className="space-y-4">
        <SkeletonBox className="w-full h-10" />
        <SkeletonBox className="w-full h-10" />
        <SkeletonBox className="w-full h-20" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
