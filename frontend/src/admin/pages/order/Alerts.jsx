import React from "react";

const Alerts = ({ error, success, setError, setSuccess }) => {
  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")}>×</button>
        </div>
      )}
    </>
  );
};

export default Alerts;
