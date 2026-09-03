export const getOrderStyles = (status) => {
  switch (status) {
    case "assigned_to_kitchen":
      return "border-orange-500 shadow-[0_0_20px_rgba(255,152,0,0.4)]";

    case "confirmed":
      return "border-blue-500 shadow-[0_0_20px_rgba(33,150,243,0.4)]";

    case "preparing":
      return "border-red-500 shadow-[0_0_25px_rgba(255,87,34,0.6)] animate-pulse";

    case "prepared":
      return "border-green-500 shadow-[0_0_20px_rgba(76,175,80,0.4)]";

    default:
      return "border-cyan-400";
  }
};
