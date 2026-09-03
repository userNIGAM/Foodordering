const PendingPickups = ({ deliveries = [] }) => {
  const pickups = deliveries;
  return (
    <section className="mb-6 bg-white rounded-xl shadow-sm border p-5">
      <h2 className="text-lg font-semibold mb-4">Pending Pickups</h2>
      {pickups.length === 0 ? <p className="text-gray-500">No pending pickups at the moment.</p> : pickups.map((delivery) => (
        <div key={delivery._id} className="flex items-center justify-between border-b last:border-0 py-3">
          <span>{delivery.orderId || delivery._id}</span>
          <span className="text-sm text-gray-500">Awaiting assignment</span>
        </div>
      ))}
    </section>
  );
};

export default PendingPickups