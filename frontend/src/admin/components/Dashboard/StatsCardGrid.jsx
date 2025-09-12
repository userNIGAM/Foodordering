// frontend/src/admin/components/Dashboard/StatsCardGrid.jsx
import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, TrendingUp, Users, BarChart3 } from "lucide-react";

const iconComponents = { ShoppingCart, TrendingUp, Users, BarChart3 };

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const StatsCardGrid = ({ stats }) => (
  <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map((stat, index) => {
      const IconComponent = iconComponents[stat.icon];
      return (
        <motion.div
          key={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ rotate: 5 }}
              className={`p-3 rounded-xl ${stat.color}`}
            >
              <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
            </motion.div>
            <span
              className={`text-sm font-semibold px-2 py-1 rounded-full ${
                stat.trend === "up"
                  ? "text-green-700 bg-green-100"
                  : "text-red-700 bg-red-100"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {stat.title}
            </p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        </motion.div>
      );
    })}
  </div>
);

export default StatsCardGrid;
