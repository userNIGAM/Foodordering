import React from "react";
import { Mail, Phone, MapPin, User } from "lucide-react";

const CustomerForm = ({ customerInfo, onChange }) => (
  <>
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        Full Name *
      </label>
      <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 ring-green-500 transition">
        <User className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          name="name"
          value={customerInfo.name}
          onChange={onChange}
          className="w-full outline-none"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Email *</label>
      <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 ring-green-500 transition">
        <Mail className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="email"
          name="email"
          value={customerInfo.email}
          onChange={onChange}
          className="w-full outline-none"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Phone *</label>
      <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 ring-green-500 transition">
        <Phone className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="tel"
          name="phone"
          value={customerInfo.phone}
          onChange={onChange}
          className="w-full outline-none"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">
        Delivery Address *
      </label>
      <div className="flex items-start border rounded-lg p-3 focus-within:ring-2 ring-green-500 transition">
        <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1" />
        <textarea
          name="address"
          value={customerInfo.address}
          onChange={onChange}
          className="w-full outline-none resize-none"
          rows="3"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">
        Special Instructions
      </label>
      <textarea
        name="specialInstructions"
        value={customerInfo.specialInstructions}
        onChange={onChange}
        className="w-full border rounded-lg p-3 resize-none focus:ring-2 ring-green-500 transition"
        rows="2"
      />
    </div>
  </>
);

export default CustomerForm;
