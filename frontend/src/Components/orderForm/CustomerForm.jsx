import React from "react";

const CustomerForm = ({ customer, onChange, onSubmit, disabled, submitting }) => (
  <>
    <h2 className="text-xl font-semibold mb-4">Customer Information</h2>

    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Full Name *</label>
        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={onChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email *</label>
        <input
          type="email"
          name="email"
          value={customer.email}
          onChange={onChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Phone *</label>
        <input
          type="tel"
          name="phone"
          value={customer.phone}
          onChange={onChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Delivery Address *</label>
        <textarea
          name="address"
          value={customer.address}
          onChange={onChange}
          className="w-full p-2 border rounded-md"
          rows="3"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">
          Special Instructions
        </label>
        <textarea
          name="specialInstructions"
          value={customer.specialInstructions}
          onChange={onChange}
          className="w-full p-2 border rounded-md"
          rows="2"
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:bg-gray-400"
      >
        {submitting ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  </>
);

export default CustomerForm;
