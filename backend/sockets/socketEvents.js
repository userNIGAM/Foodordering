import { getIO } from "./socketServer.js";

export const emitChefDashboardUpdate = (chefId, stats) => {
  const io = getIO();

  io.to(`chef:${chefId}`).emit("chef_dashboard_update", stats);
};

export const emitOrderStatusChange = (customerId, payload) => {
  const io = getIO();

  io.to(`customer:${customerId}`).emit("order_status_update", payload);
};