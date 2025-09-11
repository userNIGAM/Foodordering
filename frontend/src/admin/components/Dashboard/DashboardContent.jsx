import React from "react";
import StatsCardGrid from "./StatsCardGrid";
import SalesChart from "./SalesChart";
import RecentOrders from "./RecentOrders";

const DashboardContent = ({ data }) => (
  <>
    <StatsCardGrid stats={data.stats} />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <SalesChart salesData={data.salesData} />
      <RecentOrders
        orders={data.recentOrders}
        lowStockAlerts={data.lowStockAlerts}
      />
    </div>
  </>
);

export default DashboardContent;
