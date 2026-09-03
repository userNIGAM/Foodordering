import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const IssueModal = ({ order, onClose, onSubmit, actionLoading }) => {
  const [issueDescription, setIssueDescription] = useState('');

  const handleSubmit = () => {
    if (issueDescription.trim()) {
      onSubmit(order._id, issueDescription);
    }
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle size={28} className="text-red-600" />
            <h2 className="text-2xl font-bold text-slate-900">Report Issue</h2>
          </div>

          <p className="text-slate-700 mb-4 font-semibold">
            Order #{order.orderId || order._id.slice(-8)}
          </p>

          <textarea
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full p-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 mb-4 font-medium"
            rows={4}
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={actionLoading || !issueDescription.trim()}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold disabled:opacity-50 transition-colors"
            >
              Report Issue
            </button>
            <button
              onClick={() => {
                setIssueDescription('');
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-slate-300 text-slate-800 rounded-lg hover:bg-slate-400 font-bold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;