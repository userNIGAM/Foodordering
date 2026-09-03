const OrderItems = ({ items = [] }) => {
  return (
    <div className="bg-black/30 rounded-lg p-4 max-h-32 overflow-y-auto mb-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex justify-between border-b border-white/10 py-2 text-sm"
        >
          <span>{item.name}</span>

          <span className="text-cyan-400 font-semibold">x{item.quantity}</span>
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
