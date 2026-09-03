import React from 'react';
import { Clock, CheckCircle, AlertCircle, ChefHat } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={16} />;
      case 'preparing': return <ChefHat size={16} />;
      case 'prepared': return <CheckCircle size={16} />;
      case 'issue': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const baseStyles = 'px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-2';
  const statusStyles = {
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-yellow-100 text-yellow-800',
    prepared: 'bg-green-100 text-green-800',
    issue: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`${baseStyles} ${statusStyles[status] || statusStyles.default}`}>
      {getStatusIcon()}
      {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;