import React, { useEffect, useState } from "react";
import api from "../../../services/api";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/admin/inventory");

      if (res.data.success) {
        setInventory(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Inventory Management
      </h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 text-left text-sm uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Low Level</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Value</th>
            </tr>
          </thead>

          <tbody>

            {inventory.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500"
                >
                  No inventory items found
                </td>
              </tr>
            )}

            {inventory.map((item) => {
              const menuItem = item.menuItem || item.menuItemId;

              const totalValue =
                (item.currentStock || 0) *
                (item.costPerUnit || 0);

              return (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {menuItem?.name || "Unknown"}
                  </td>

                  <td className="px-4 py-3">
                    {menuItem?.category || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {item.currentStock}
                  </td>

                  <td className="px-4 py-3">
                    {item.lowStockThreshold}
                  </td>

                  <td className="px-4 py-3">
                    Rs {item.costPerUnit?.toFixed(2)}
                  </td>

                  <td className="px-4 py-3">
                    Rs {totalValue.toFixed(2)}
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Inventory;