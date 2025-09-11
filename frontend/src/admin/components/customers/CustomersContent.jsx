import React from "react";
import { Users } from "lucide-react";

const CustomersContent = () => {
  return (
    <div className="text-center py-16">
      <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Customer Management
      </h3>
      <p className="text-gray-500">
        Customer management functionality coming soon...
      </p>
    </div>
  );
};

export default CustomersContent;
