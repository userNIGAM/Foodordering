// import React, { useState, useEffect } from "react";
// import {
//   Package,
//   Plus,
//   Download,
//   Filter,
//   Search,
//   AlertTriangle,
//   BarChart3,
// } from "lucide-react";
// import api from "../../../services/api";

// const InventoryContent = () => {
//   const [inventory, setInventory] = useState([]);
//   const [filteredInventory, setFilteredInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showLowStock, setShowLowStock] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [categories, setCategories] = useState([]);
//   const [showReport, setShowReport] = useState(false);
//   const [reportData, setReportData] = useState(null);

//   useEffect(() => {
//     fetchInventory();
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     filterInventory();
//   }, [inventory, showLowStock, searchTerm, selectedCategory]);

//   const fetchInventory = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (showLowStock) params.append("lowStockOnly", "true");
//       if (selectedCategory !== "all")
//         params.append("category", selectedCategory);

//       const res = await api.get(`/api/admin/inventory?${params}`);
//       if (res.data.success) {
//         setInventory(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching inventory:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await api.get("/api/menu-items/categories/all");
//       if (res.data.success) {
//         setCategories(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchInventoryReport = async () => {
//     try {
//       const res = await api.get("/api/admin/inventory/report");
//       if (res.data.success) {
//         setReportData(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching report:", error);
//     }
//   };

//   const filterInventory = () => {
//     let filtered = inventory;
//     if (searchTerm) {
//       filtered = filtered.filter((item) =>
//         item.menuItemId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     setFilteredInventory(filtered);
//   };

//   const handleStockUpdate = async (id, newStock) => {
//     try {
//       const res = await api.put(`/api/admin/inventory/${id}`, {
//         currentStock: parseInt(newStock),
//       });
//       if (res.data.success) {
//         setInventory(
//           inventory.map((item) => (item._id === id ? res.data.data : item))
//         );
//       }
//     } catch (error) {
//       console.error("Error updating stock:", error);
//     }
//   };

//   const handleRestock = async (id, quantity) => {
//     try {
//       const res = await api.post(`/api/admin/inventory/${id}/restock`, {
//         quantity: parseInt(quantity),
//       });
//       if (res.data.success) {
//         setInventory(
//           inventory.map((item) => (item._id === id ? res.data.data : item))
//         );
//       }
//     } catch (error) {
//       console.error("Error restocking:", error);
//     }
//   };

//   const getStockStatus = (item) => {
//     if (item.currentStock === 0) return "out-of-stock";
//     if (item.currentStock <= item.lowStockThreshold) return "low-stock";
//     return "in-stock";
//   };

//   const getStockStatusColor = (status) => {
//     switch (status) {
//       case "out-of-stock":
//         return "bg-red-100 text-red-800";
//       case "low-stock":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-green-100 text-green-800";
//     }
//   };

//   const getStockStatusText = (status) => {
//     switch (status) {
//       case "out-of-stock":
//         return "Out of Stock";
//       case "low-stock":
//         return "Low Stock";
//       default:
//         return "In Stock";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-48 sm:h-64">
//         <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
//         <span className="ml-2 sm:ml-3 text-gray-600">Loading inventory...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 px-4 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
//             Inventory Management
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600">
//             Manage stock levels and track inventory
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-2 sm:gap-3">
//           <button
//             onClick={() => {
//               setShowReport(!showReport);
//               if (!reportData) fetchInventoryReport();
//             }}
//             className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           >
//             <BarChart3 className="w-4 h-4 mr-2" />
//             {showReport ? "Hide Report" : "View Report"}
//           </button>
//           <button className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//             <Download className="w-4 h-4 mr-2" />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Report */}
//       {showReport && reportData && (
//         <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-x-auto">
//           <h3 className="text-base sm:text-lg font-semibold mb-4">
//             Inventory Summary Report
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <h4 className="text-blue-800 font-semibold text-sm sm:text-base">
//                 Total Inventory Value
//               </h4>
//               <p className="text-xl sm:text-2xl font-bold text-blue-600">
//                 ${reportData.totalValue.toFixed(2)}
//               </p>
//             </div>
//             <div className="bg-yellow-50 p-4 rounded-lg">
//               <h4 className="text-yellow-800 font-semibold text-sm sm:text-base">
//                 Low Stock Items
//               </h4>
//               <p className="text-xl sm:text-2xl font-bold text-yellow-600">
//                 {reportData.report.reduce(
//                   (sum, cat) => sum + cat.lowStockItems,
//                   0
//                 )}
//               </p>
//             </div>
//             <div className="bg-red-50 p-4 rounded-lg">
//               <h4 className="text-red-800 font-semibold text-sm sm:text-base">
//                 Out of Stock
//               </h4>
//               <p className="text-xl sm:text-2xl font-bold text-red-600">
//                 {reportData.report.reduce(
//                   (sum, cat) => sum + cat.outOfStockItems,
//                   0
//                 )}
//               </p>
//             </div>
//           </div>

//           <table className="w-full min-w-[600px]">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Category
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Total Items
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Low Stock
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Out of Stock
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Total Value
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {reportData.report.map((category) => (
//                 <tr key={category._id}>
//                   <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">
//                     {category._id}
//                   </td>
//                   <td className="px-4 sm:px-6 py-3">{category.totalItems}</td>
//                   <td className="px-4 sm:px-6 py-3">
//                     <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
//                       {category.lowStockItems}
//                     </span>
//                   </td>
//                   <td className="px-4 sm:px-6 py-3">
//                     <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
//                       {category.outOfStockItems}
//                     </span>
//                   </td>
//                   <td className="px-4 sm:px-6 py-3 font-semibold">
//                     Rs.{(category.totalStockValue || 0).toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
//         <div className="flex flex-col md:flex-row md:items-center gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search inventory..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>

//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="all">All Categories</option>
//             {categories.map((category) => (
//               <option key={category} value={category}>
//                 {category.charAt(0).toUpperCase() + category.slice(1)}
//               </option>
//             ))}
//           </select>

//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={showLowStock}
//               onChange={(e) => setShowLowStock(e.target.checked)}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <span className="text-sm sm:text-base text-gray-700">
//               Show low stock only
//             </span>
//           </label>
//         </div>
//       </div>

//       {/* Inventory Table */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[800px]">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Product
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Category
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Current Stock
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Low Stock Level
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Status
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Cost/Unit
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Total Value
//                 </th>
//                 <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredInventory.map((item) => {
//                 const status = getStockStatus(item);
//                 const statusColor = getStockStatusColor(status);
//                 const statusText = getStockStatusText(status);
//                 const totalValue = item.currentStock * item.costPerUnit;

//                 return (
//                   <tr
//                     key={item._id}
//                     className={
//                       status === "out-of-stock"
//                         ? "bg-red-50"
//                         : status === "low-stock"
//                         ? "bg-yellow-50"
//                         : ""
//                     }
//                   >
//                     <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {item.menuItemId?.image ? (
//                           <img
//                             src={item.menuItemId.image}
//                             alt={item.menuItemId.name}
//                             className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover mr-2 sm:mr-3"
//                           />
//                         ) : (
//                           <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mr-2 sm:mr-3" />
//                         )}
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {item.menuItemId?.name || "Unknown Item"}
//                           </div>
//                           <div className="text-xs sm:text-sm text-gray-500">
//                             {item.unit}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
//                       {item.menuItemId?.category || "N/A"}
//                     </td>
//                     <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
//                       <input
//                         type="number"
//                         min="0"
//                         value={item.currentStock}
//                         onChange={(e) =>
//                           handleStockUpdate(item._id, e.target.value)
//                         }
//                         className="w-16 sm:w-20 px-2 py-1 border border-gray-300 rounded text-sm"
//                       />
//                     </td>
//                     <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-900">
//                       <input
//                         type="number"
//                         min="0"
//                         value={item.lowStockThreshold}
//                         onChange={(e) =>
//                           handleStockUpdate(
//                             item._id,
//                             item.currentStock,
//                             e.target.value
//                           )
//                         }
//                         className="w-16 sm:w-20 px-2 py-1 border border-gray-300 rounded text-sm"
//                       />
//                     </td>
//                     <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
//                       <span
//                         className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}
//                       >
//                         {statusText}
//                       </span>
//                     </td>
//                     <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-900">
//                       ${item.costPerUnit?.toFixed(2) || "0.00"}
//                     </td>
//                     <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
//                       ${totalValue.toFixed(2)}
//                     </td>
//                     <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm font-medium">
//                       <button
//                         onClick={() => {
//                           const quantity = prompt(
//                             "Enter quantity to add:",
//                             "10"
//                           );
//                           if (quantity && !isNaN(quantity)) {
//                             handleRestock(item._id, quantity);
//                           }
//                         }}
//                         className="text-blue-600 hover:text-blue-900 mr-2 sm:mr-4"
//                       >
//                         Restock
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {filteredInventory.length === 0 && (
//           <div className="text-center py-10 sm:py-12">
//             <Package className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
//             <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
//               No inventory items
//             </h3>
//             <p className="mt-1 text-xs sm:text-sm text-gray-500">
//               {showLowStock
//                 ? "No items are low on stock."
//                 : "Get started by adding inventory items."}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Stock Alerts */}
//       {inventory.filter(
//         (item) =>
//           getStockStatus(item) === "low-stock" ||
//           getStockStatus(item) === "out-of-stock"
//       ).length > 0 && (
//         <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
//           <AlertTriangle className="h-5 w-5 text-yellow-400" />
//           <div>
//             <h3 className="text-sm font-medium text-yellow-800">
//               Stock Alerts
//             </h3>
//             <p className="text-xs sm:text-sm text-yellow-700 mt-1">
//               Some items are running low or are out of stock. Please restock to
//               avoid disruptions.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InventoryContent;
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
