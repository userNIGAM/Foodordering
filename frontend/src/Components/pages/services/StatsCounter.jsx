// StatsCounter.jsx
import { useEffect, useState } from "react";

const StatsCounter = () => {
  const stats = [
    { label: "Meals Delivered", value: 12540 },
    { label: "Active Riders", value: 432 },
    { label: "Customer Rating", value: "4.9/5" },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    stats.forEach((stat, i) => {
      if (typeof stat.value === "number") {
        let start = 0;
        const end = stat.value;
        const duration = 2000;
        const increment = end / (duration / 50);

        const counter = setInterval(() => {
          start += increment;
          if (start >= end) {
            start = end;
            clearInterval(counter);
          }
          setCounts((prev) => {
            const newCounts = [...prev];
            newCounts[i] = Math.floor(start);
            return newCounts;
          });
        }, 50);
      } else {
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[i] = stat.value;
          return newCounts;
        });
      }
    });
  }, []);

  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      {stats.map((stat, i) => (
        <div key={i} className="bg-orange-50 p-6 rounded-xl shadow">
          <h4 className="text-4xl font-bold text-orange-600">{counts[i]}</h4>
          <p className="text-gray-700 mt-2">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCounter;
