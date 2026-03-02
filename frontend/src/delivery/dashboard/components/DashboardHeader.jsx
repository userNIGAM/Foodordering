const DashboardHeader = ({ deliveryPerson, isConnected }) => {
  return (
    <div className="flex items-center justify-between mb-6">

      {/* Left Section */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🚗 Delivery Dashboard
        </h1>

        {deliveryPerson && (
          <p className="text-gray-500 mt-1">
            Welcome, {deliveryPerson.name}
          </p>
        )}
      </div>

      {/* Connection Status */}
      <div>
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            isConnected
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isConnected ? "🟢 Live" : "🔴 Offline"}
        </span>
      </div>

    </div>
  );
};

export default DashboardHeader;