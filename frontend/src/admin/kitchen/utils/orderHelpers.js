export const getRemainingTime = (createdAt, estimatedPrepTime = 30) => {
  const created = new Date(createdAt);

  const elapsed = Math.floor((Date.now() - created) / 60000);

  return Math.max(0, estimatedPrepTime - elapsed);
};

export const getOrderStatusLabel = (status) => {
  switch (status) {
    case "assigned_to_kitchen":
      return "📋 New";

    case "confirmed":
      return "✓ Confirmed";

    case "preparing":
      return "🍳 Preparing";

    case "prepared":
      return "✅ Ready";

    default:
      return status;
  }
};
