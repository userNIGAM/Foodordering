const ChefHeader = ({ chef, isConnected }) => {
  return (
    <div className="row mb-4">
      <div className="col">
        <h1 className="mb-0">👨‍🍳 Chef Dashboard</h1>

        {chef && <p className="text-muted mb-0">Welcome, {chef.name}</p>}
      </div>

      <div className="col-auto">
        <span className={`badge ${isConnected ? "bg-success" : "bg-danger"}`}>
          {isConnected ? "🟢 Live" : "🔴 Offline"}
        </span>
      </div>
    </div>
  );
};

export default ChefHeader;
