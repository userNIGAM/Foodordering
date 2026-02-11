import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import InventoryHeader from "./InventoryHeader";
import InventoryReport from "./InventoryReport";
import InventoryFilters from "./InventoryFilters";
import InventoryTable from "./InventoryTable";
import StockAlert from "./StockAlert";
import Loader from "./Loader";

const InventoryContent = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLowStock, setShowLowStock] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, showLowStock, searchTerm, selectedCategory]);

  const fetchInventory = async () => {
    try {
      const params = new URLSearchParams();
      if (showLowStock) params.append("lowStockOnly", "true");
      if (selectedCategory !== "all") params.append("category", selectedCategory);

      const res = await api.get(`/api/admin/inventory?${params}`);
      if (res.data.success) setInventory(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/menu-items/categories/all");
      if (res.data.success) setCategories(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInventoryReport = async () => {
    try {
      const res = await api.get("/api/admin/inventory/report");
      if (res.data.success) setReportData(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.menuItemId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredInventory(filtered);
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      const res = await api.put(`/api/admin/inventory/${id}`, {
        currentStock: parseInt(newStock),
      });
      if (res.data.success) {
        setInventory(
          inventory.map((item) => (item._id === id ? res.data.data : item))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestock = async (id, quantity) => {
    try {
      const res = await api.post(`/api/admin/inventory/${id}/restock`, {
        quantity: parseInt(quantity),
      });
      if (res.data.success) {
        setInventory(
          inventory.map((item) => (item._id === id ? res.data.data : item))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <InventoryHeader
        showReport={showReport}
        setShowReport={setShowReport}
        reportData={reportData}
        fetchInventoryReport={fetchInventoryReport}
      />

      {showReport && reportData && <InventoryReport reportData={reportData} />}

      <InventoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        showLowStock={showLowStock}
        setShowLowStock={setShowLowStock}
      />

      <InventoryTable
        inventory={filteredInventory}
        handleStockUpdate={handleStockUpdate}
        handleRestock={handleRestock}
      />

      <StockAlert inventory={inventory} />
    </div>
  );
};

export default InventoryContent;
