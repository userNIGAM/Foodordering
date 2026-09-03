const ChefStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      className: "text-warning",
    },
    {
      title: "Completed Today",
      value: stats.completed,
      className: "text-success",
    },
    {
      title: "Capacity",
      value: `${stats.currentCapacity}/${stats.maxCapacity}`,
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {statCards.map((stat) => (
        <div className="col-md-3" key={stat.title}>
          <div className="card stat-card">
            <div className="card-body">
              <h6 className="card-title text-muted">{stat.title}</h6>

              <h2 className={`mb-0 ${stat.className || ""}`}>{stat.value}</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChefStats;
