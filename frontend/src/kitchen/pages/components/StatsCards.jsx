import React from 'react';

const StatsCards = ({ stats, filter, onFilterChange }) => {
  const cards = [
    { key: 'assigned_to_kitchen', label: 'Total Orders', value: stats.total, bg: 'from-blue-500 to-blue-600' },
    { key: 'confirmed', label: 'Confirmed', value: stats.confirmed, bg: 'from-blue-500 to-blue-600' },
    { key: 'preparing', label: 'Preparing', value: stats.preparing, bg: 'from-yellow-500 to-yellow-600' },
    { key: 'prepared', label: 'Prepared', value: stats.prepared, bg: 'from-green-500 to-green-600' },
    { key: 'issue', label: 'Issues', value: stats.issues, bg: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`p-4 rounded-lg shadow cursor-pointer transition-all ${
            filter === card.key
              ? `bg-gradient-to-br ${card.bg} text-white`
              : 'bg-white hover:shadow-md'
          }`}
          onClick={() => onFilterChange(card.key)}
        >
          <p className="text-sm font-semibold opacity-80">{card.label}</p>
          <p className="text-3xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;