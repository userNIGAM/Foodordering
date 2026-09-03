export const getStatusColor = (status) => {
  switch (status) {
    case "assigned_to_kitchen":
      return "badge-warning";

    case "confirmed":
      return "badge-info";

    case "preparing":
      return "badge-primary";

    case "prepared":
      return "badge-success";

    case "issue":
      return "badge-danger";

    default:
      return "badge-secondary";
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case "assigned_to_kitchen":
      return "Assigned";

    case "confirmed":
      return "Confirmed";

    case "preparing":
      return "Preparing";

    case "prepared":
      return "Prepared";

    case "issue":
      return "Issue";

    default:
      return status || "Unknown";
  }
};
