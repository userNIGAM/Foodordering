import React from 'react';
import { EyeIcon, AlertCircle, ChefHat } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { getTimeAgo } from '../../utils/timeAgo';

const OrdersTable = ({
  orders,
  actionLoading,
  onViewDetails,
  onStartPreparing,
  onMarkPrepared,
  onReportIssue,
}) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <ChefHat size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500 text-lg">No orders to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Items</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Time</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900">#{order.orderId || order._id.slice(-8)}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{order.customer?.name}</p>
                    <p className="text-sm text-slate-600">{order.customer?.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{getTimeAgo(order.createdAt)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                      <EyeIcon size={16} />
                      View
                    </button>
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => onStartPreparing(order._id)}
                        disabled={actionLoading}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm font-medium disabled:opacity-50 transition-colors"
                      >
                        Prepare
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => onMarkPrepared(order._id)}
                        disabled={actionLoading}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium disabled:opacity-50 transition-colors"
                      >
                        Done
                      </button>
                    )}
                    {(order.status === 'confirmed' || order.status === 'preparing') && (
                      <button
                        onClick={() => onReportIssue(order)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium flex items-center gap-1 transition-colors"
                      >
                        <AlertCircle size={16} />
                        Issue
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;