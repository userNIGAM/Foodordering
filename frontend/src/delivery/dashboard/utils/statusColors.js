export const getStatusColor = (status) => {

  const colors = {
    assigned_to_delivery: "badge-warning",
    picked_up: "badge-info",
    out_for_delivery: "badge-primary",
    delivered: "badge-success",
  };

  return colors[status] || "badge-secondary";
};