const StatsCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Stat title="Total Deliveries" value={stats.totalOrders} />
      <Stat title="In Transit" value={stats.inTransit} className="text-blue-600" />
      <Stat title="Delivered Today" value={stats.delivered} className="text-green-600" />
      <Stat title="Rating" value={`⭐ ${stats.rating?.toFixed(1) || "N/A"}`} />
    </div>
  );
};

const Stat = ({ title, value, className }) => (
  <div className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition">
    <h6 className="text-sm text-gray-500">{title}</h6>
    <h2 className={`text-2xl font-bold mt-1 ${className || "text-gray-900"}`}>
      {value}
    </h2>
  </div>
);

export default StatsCards;