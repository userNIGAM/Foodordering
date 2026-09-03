const KitchenStats = ({ stats }) => {
  const statItems = [
    {
      label: "Total Orders",
      value: stats.total,
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
    },
    {
      label: "Preparing",
      value: stats.preparing,
    },
    {
      label: "Ready",
      value: stats.prepared,
    },
  ];

  return (
    <div className="bg-black/20 border-b border-cyan-400/40 p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <div
          key={stat.label}
          className="bg-white/5 border border-cyan-400/30 rounded-xl p-6 text-center hover:-translate-y-1 transition"
        >
          <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>

          <div className="text-sm uppercase tracking-wider text-gray-400 mt-2">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KitchenStats;
