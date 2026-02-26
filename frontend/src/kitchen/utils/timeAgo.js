export const getTimeAgo = (date) => {
  const now = new Date();
  const orderDate = new Date(date);
  const minutes = Math.floor((now - orderDate) / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return orderDate.toLocaleDateString();
};