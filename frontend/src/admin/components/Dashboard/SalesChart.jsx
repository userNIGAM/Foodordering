import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

const SalesChart = ({ salesData }) => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Weekly Sales Overview
        </h3>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#4B5563", fontSize: 12 }} />
            <YAxis tick={{ fill: "#4B5563", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
              }}
              cursor={{ fill: "rgba(59,130,246,0.1)" }}
            />

            {/* Bars = order count */}
            <Bar
              dataKey="sales"
              fill="url(#salesGradient)"
              radius={[8, 8, 0, 0]}
            />

            {/* Line = revenue trend */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#F97316"
              strokeWidth={3}
              dot={{ r: 4, fill: "#F97316", strokeWidth: 1 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
