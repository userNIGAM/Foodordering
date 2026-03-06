import redis from "../config/redis.js";
import Order from "../models/Order.js";

export const getChefDashboardStats = async (chefId) => {
  const cacheKey = `chef:dashboard:${chefId}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const stats = await Order.aggregate([
    { $match: { chefId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  await redis.set(cacheKey, JSON.stringify(stats), "EX", 60);

  return stats;
};