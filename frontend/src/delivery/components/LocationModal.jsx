const LocationModal = ({
  show,
  locationForm,
  setLocationForm,
  updateLocation,
  close,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      {/* Modal */}
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h5 className="text-lg font-semibold">
            📍 Update Delivery Location
          </h5>

          <button
            onClick={close}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">

          <input
            type="number"
            placeholder="Latitude"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={locationForm.latitude}
            onChange={(e) =>
              setLocationForm((prev) => ({
                ...prev,
                latitude: parseFloat(e.target.value),
              }))
            }
          />

          <input
            type="number"
            placeholder="Longitude"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={locationForm.longitude}
            onChange={(e) =>
              setLocationForm((prev) => ({
                ...prev,
                longitude: parseFloat(e.target.value),
              }))
            }
          />

          <input
            type="text"
            placeholder="Address"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={locationForm.address}
            onChange={(e) =>
              setLocationForm((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
          />

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t px-5 py-3">

          <button
            onClick={close}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={updateLocation}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Update Location
          </button>

        </div>

      </div>
    </div>
  );
};

export default LocationModal;