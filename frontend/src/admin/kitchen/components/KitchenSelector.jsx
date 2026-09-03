const KitchenSelector = ({ kitchens, selectedKitchen, setSelectedKitchen }) => {
  return (
    <div className="bg-black/20 border-b border-cyan-400/40 p-4">
      <select
        value={selectedKitchen || ""}
        onChange={(e) => setSelectedKitchen(e.target.value)}
        className="w-full md:w-96 bg-[#2a2a3e] border-2 border-cyan-400 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        <option value="">Select Kitchen</option>

        {kitchens.map((kitchen) => (
          <option key={kitchen._id} value={kitchen._id}>
            {kitchen.name} - {kitchen.location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default KitchenSelector;
