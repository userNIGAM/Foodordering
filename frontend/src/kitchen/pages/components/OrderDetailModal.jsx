import React from 'react';
import StatusBadge from './StatusBadge';
import { getTimeAgo } from '../../utils/timeAgo';

const OrderDetailModal = ({ order, onClose, onStartPreparing, onMarkPrepared, actionLoading }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Order #{order.orderId || order._id.slice(-8)}
              </h2>
              <p className="text-sm text-slate-600 mt-1">{getTimeAgo(order.createdAt)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Customer Info */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Name</p>
                <p className="font-semibold text-slate-900 mt-1">{order.customer?.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Phone</p>
                <p className="font-semibold text-slate-900 mt-1">{order.customer?.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-bold uppercase text-slate-500">Address</p>
                <p className="font-semibold text-slate-900 mt-1">{order.customer?.address}</p>
              </div>
              {order.customer?.specialInstructions && (
                <div className="col-span-2">
                  <p className="text-xs font-bold uppercase text-slate-500">Special Instructions</p>
                  <p className="font-semibold text-slate-900 mt-1">{order.customer?.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Order Items</h3>
            <div className="space-y-2">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-slate-900">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-slate-200 flex justify-between items-center">
              <p className="font-bold text-slate-900 text-lg">Total</p>
              <p className="text-2xl font-bold text-orange-600">Rs. {order.total?.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {order.status === 'confirmed' && (
              <button
                onClick={() => {
                  onStartPreparing(order._id);
                  onClose();
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-bold disabled:opacity-50 transition-colors"
              >
                Start Preparing
              </button>
            )}
            {order.status === 'preparing' && (
              <button
                onClick={() => {
                  onMarkPrepared(order._id);
                  onClose();
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold disabled:opacity-50 transition-colors"
              >
                Mark as Prepared
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-300 text-slate-800 rounded-lg hover:bg-slate-400 font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;