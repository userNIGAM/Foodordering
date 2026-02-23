import { useEffect, useState } from "react";
import "./KitchenManagement.css";

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

  // Fetch kitchens
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

  // Open create/edit modal
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

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxCapacity" ? parseInt(value) : value,
    }));
  };

  // Save kitchen
  const saveKitchen = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (editingKitchen) {
        // Update
        response = await fetch(`${apiUrl}/api/kitchen/${editingKitchen._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create
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
        alert(editingKitchen ? "✅ Kitchen updated!" : "✅ Kitchen created!");
      }
    } catch (error) {
      console.error("Error saving kitchen:", error);
      alert("❌ Failed to save kitchen");
    }
  };

  // Delete kitchen
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
          alert("✅ Kitchen deleted!");
        }
      } catch (error) {
        console.error("Error deleting kitchen:", error);
        alert("❌ Failed to delete kitchen");
      }
    }
  };

  if (loading) {
    return (
      <div className="kitchen-management">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kitchen-management">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <h1 className="mb-0">🏪 Kitchen Management</h1>
            <p className="text-muted mb-0">Manage restaurant kitchens and chef assignments</p>
          </div>
          <div className="col-auto">
            <button
              className="btn btn-primary"
              onClick={() => openModal()}
            >
              + Create Kitchen
            </button>
          </div>
        </div>

        {/* Kitchens Grid */}
        {kitchens.length === 0 ? (
          <div className="alert alert-info">
            <p className="mb-0">No kitchens created yet. Click "Create Kitchen" to add one.</p>
          </div>
        ) : (
          <div className="row g-3">
            {kitchens.map((kitchen) => (
              <div key={kitchen._id} className="col-md-6 col-lg-4">
                <div className="card kitchen-card">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">{kitchen.name}</h5>
                  </div>
                  <div className="card-body">
                    <p className="mb-2">
                      <strong>📍 Location:</strong> {kitchen.location}
                    </p>
                    <p className="mb-2">
                      <strong>🏠 Address:</strong> {kitchen.address}
                    </p>
                    <p className="mb-2">
                      <strong>👨‍🍳 Chefs:</strong> {kitchen.chefs?.length || 0}
                    </p>
                    <p className="mb-3">
                      <strong>📊 Capacity:</strong>
                      <span className="badge bg-info ms-2">
                        {kitchen.currentLoad || 0}/{kitchen.maxCapacity}
                      </span>
                    </p>

                    {/* Chef List */}
                    {kitchen.chefs && kitchen.chefs.length > 0 && (
                      <div className="mb-3">
                        <small className="text-muted">Assigned Chefs:</small>
                        <div className="mt-2">
                          {kitchen.chefs.map((chef, idx) => (
                            <div key={idx} className="chef-badge">
                              👨‍🍳 {chef.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <p className="mb-0">
                      <small className="text-muted">Status:</small>
                      <span className={`badge ms-2 ${kitchen.status === "active" ? "bg-success" : "bg-warning"}`}>
                        {kitchen.status || "active"}
                      </span>
                    </p>
                  </div>
                  <div className="card-footer bg-light">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => openModal(kitchen)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteKitchen(kitchen._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingKitchen ? "✏️ Edit Kitchen" : "➕ Create Kitchen"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={saveKitchen}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Kitchen Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      rows="2"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Max Capacity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="maxCapacity"
                      value={formData.maxCapacity}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingKitchen ? "Update Kitchen" : "Create Kitchen"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenManagement;
