import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, TrendingUp, Users, BarChart3 } from "lucide-react";

const iconComponents = { ShoppingCart, TrendingUp, Users, BarChart3 };

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const StatsCardGrid = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
    {stats.map((stat, index) => {
      const IconComponent = iconComponents[stat.icon];
      return (
        <motion.div
          key={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all min-h-[120px] sm:min-h-[140px] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ rotate: 8 }}
              className={`p-2 sm:p-3 rounded-xl ${stat.color}`}
            >
              <IconComponent
                className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`}
              />
            </motion.div>
            <span
              className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full ${
                stat.trend === "up"
                  ? "text-green-700 bg-green-100"
                  : "text-red-700 bg-red-100"
              }`}
            >
              {stat.change}
            </span>
          </div>

          <div className="mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
              {stat.title}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {stat.value}
            </h3>
          </div>
        </motion.div>
      );
    })}
  </div>
);

export default StatsCardGrid;
