import React from "react";
import { ShoppingCart, TrendingUp, Users, BarChart3 } from "lucide-react";

const iconComponents = { ShoppingCart, TrendingUp, Users, BarChart3 };

const StatsCardGrid = ({ stats }) => (
  <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map((stat, index) => {
      const IconComponent = iconComponents[stat.icon];
      return (
        <div
          key={index}
          className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
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
        </div>
      );
    })}
  </div>
);

export default StatsCardGrid;
