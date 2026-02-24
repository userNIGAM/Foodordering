import { useEffect, useState } from "react";

const KitchenManagement = () => {
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingKitchen, setEditingKitchen] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    maxCapacity: 10,
  });

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchKitchens();
  }, [token, apiUrl]);

  const fetchKitchens = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/kitchen`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setKitchens(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching kitchens:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (kitchen = null) => {
    if (kitchen) {
      setEditingKitchen(kitchen);
      setFormData({
        name: kitchen.name,
        location: kitchen.location,
        address: kitchen.address,
        maxCapacity: kitchen.maxCapacity,
      });
    } else {
      setEditingKitchen(null);
      setFormData({
        name: "",
        location: "",
        address: "",
        maxCapacity: 10,
      });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxCapacity" ? parseInt(value) : value,
    }));
  };

  const saveKitchen = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingKitchen) {
        response = await fetch(`${apiUrl}/api/kitchen/${editingKitchen._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(`${apiUrl}/api/kitchen`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        await fetchKitchens();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving kitchen:", error);
    }
  };

  const deleteKitchen = async (kitchenId) => {
    if (window.confirm("Are you sure you want to delete this kitchen?")) {
      try {
        const response = await fetch(`${apiUrl}/api/kitchen/${kitchenId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          await fetchKitchens();
        }
      } catch (error) {
        console.error("Error deleting kitchen:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">🏪 Kitchen Management</h1>
            <p className="text-gray-500">
              Manage restaurant kitchens and chef assignments
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            + Create Kitchen
          </button>
        </div>

        {/* Kitchens */}
        {kitchens.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
            No kitchens created yet. Click "Create Kitchen" to add one.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kitchens.map((kitchen) => (
              <div
                key={kitchen._id}
                className="bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-2 transition duration-300 flex flex-col"
              >
                <div className="p-4 border-b">
                  <h5 className="font-semibold text-lg">{kitchen.name}</h5>
                </div>

                <div className="p-4 flex-1">
                  <p className="mb-2">
                    <span className="font-medium">📍 Location:</span>{" "}
                    {kitchen.location}
                  </p>

                  <p className="mb-2">
                    <span className="font-medium">🏠 Address:</span>{" "}
                    {kitchen.address}
                  </p>

                  <p className="mb-2">
                    <span className="font-medium">👨‍🍳 Chefs:</span>{" "}
                    {kitchen.chefs?.length || 0}
                  </p>

                  <p className="mb-3">
                    <span className="font-medium">📊 Capacity:</span>
                    <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                      {kitchen.currentLoad || 0}/{kitchen.maxCapacity}
                    </span>
                  </p>

                  {kitchen.chefs && kitchen.chefs.length > 0 && (
                    <div className="mb-3">
                      <small className="text-gray-500">
                        Assigned Chefs:
                      </small>
                      <div className="mt-2 flex flex-wrap">
                        {kitchen.chefs.map((chef, idx) => (
                          <div
                            key={idx}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                          >
                            👨‍🍳 {chef.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p>
                    <span className="text-gray-500 text-sm">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        kitchen.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {kitchen.status || "active"}
                    </span>
                  </p>
                </div>

                <div className="p-4 border-t flex gap-2">
                  <button
                    onClick={() => openModal(kitchen)}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => deleteKitchen(kitchen._id)}
                    className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h5 className="font-semibold text-lg">
                {editingKitchen ? "✏️ Edit Kitchen" : "➕ Create Kitchen"}
              </h5>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveKitchen}>
              <div className="p-4 space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Kitchen Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <textarea
                  name="address"
                  placeholder="Address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <input
                  type="number"
                  name="maxCapacity"
                  min="1"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 p-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  {editingKitchen ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenManagement;