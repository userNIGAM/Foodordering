import React from "react";
import { motion } from "framer-motion";
import StatsCardGrid from "./StatsCardGrid";
import SalesChart from "./SalesChart";
import RecentOrders from "./RecentOrders";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const DashboardContent = ({ data }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="space-y-6 px-4 sm:px-6 lg:px-8"
  >
    <motion.div variants={itemVariants}>
      <StatsCardGrid stats={data.stats} />
    </motion.div>

    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 gap-6 lg:grid-cols-2"
    >
      <div className="flex flex-col min-w-0">
        <SalesChart salesData={data.salesData} />
      </div>
      <div className="flex flex-col min-w-0">
        <RecentOrders
          orders={data.recentOrders}
          lowStockAlerts={data.lowStockAlerts}
        />
      </div>
    </motion.div>
  </motion.div>
);

export default DashboardContent;
