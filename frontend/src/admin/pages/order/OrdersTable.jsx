import React from "react";
import OrderRow from "./OrderRow";

const OrdersTable = ({ orders, totalOrders, filter, searchTerm, updateStatus }) => {
  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Order ID","Customer","Date","Total","Status","Action"].map(h=>(
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y">
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderRow key={order._id} order={order} updateStatus={updateStatus} />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm || filter !== "all"
                    ? "No orders match your search criteria"
                    : "No orders found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {orders.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {orders.length} of {totalOrders} orders
        </div>
      )}
    </>
  );
};

export default OrdersTable;
