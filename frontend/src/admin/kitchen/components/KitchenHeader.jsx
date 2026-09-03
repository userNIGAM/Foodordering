const KitchenHeader = ({ isConnected }) => {
  return (
    <header className="bg-black/30 border-b-4 border-cyan-400 shadow-lg py-6 px-6 flex justify-between items-center">
      <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
        🍳 Kitchen Display System
      </h1>

      <span
        className={`px-4 py-2 rounded-full font-semibold text-sm ${
          isConnected
            ? "bg-green-600 shadow-green-500/50 shadow-lg"
            : "bg-red-600 shadow-red-500/50 shadow-lg"
        }`}
      >
        {isConnected ? "🟢 LIVE" : "🔴 OFFLINE"}
      </span>
    </header>
  );
};

export default KitchenHeader;
