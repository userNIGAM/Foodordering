import React, { useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";
import ChartWrapper from "../wrapper/ChartWrapper";

const SalesChart = ({ salesData }) => {
  // Fix Recharts bug: force resize so it recalculates
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 400); // give more time on smaller devices
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-2 sm:p-4 bg-white rounded-2xl shadow-md border border-gray-100 w-full max-w-full min-w-0 transition-all">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          Weekly Sales Overview
        </h3>
      </div>

      <ChartWrapper>
        <ComposedChart data={salesData}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#4B5563", fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fill: "#4B5563", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
            }}
            cursor={{ fill: "rgba(59,130,246,0.1)" }}
          />

          <Bar
            dataKey="sales"
            fill="url(#salesGradient)"
            radius={[6, 6, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#F97316"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#F97316", strokeWidth: 1 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ChartWrapper>
    </div>
  );
};

export default SalesChart;
