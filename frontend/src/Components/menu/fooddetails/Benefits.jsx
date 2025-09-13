import React from "react";
import { Truck, Shield, Clock } from "lucide-react";

export default function Benefits({ preparationTime }) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="font-semibold text-gray-900 mb-4">Why order with us?</h3>
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
            <Truck size={20} />
          </div>
          <div>
            <p className="font-medium text-gray-900">Free Delivery</p>
            <p className="text-sm text-gray-600">On orders over $25</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
            <Shield size={20} />
          </div>
          <div>
            <p className="font-medium text-gray-900">Quality Guaranteed</p>
            <p className="text-sm text-gray-600">Fresh ingredients daily</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
            <Clock size={20} />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              Ready in {preparationTime}
            </p>
            <p className="text-sm text-gray-600">Hot and fresh</p>
          </div>
        </div>
      </div>
    </div>
  );
}
