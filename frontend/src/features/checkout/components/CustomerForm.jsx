import { Mail, Phone, MapPin, User } from "lucide-react";

const CustomerForm = ({
  customer,
  onChange,
  onSubmit,
  disabled = false,
  submitting = false,
}) => (
  <>
    <h2 className="text-xl font-semibold mb-5">Customer Information</h2>

    <form onSubmit={onSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Full Name *
        </label>

        <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-500 transition">
          <User className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />

          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={onChange}
            placeholder="Enter your full name"
            className="w-full outline-none bg-transparent"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Email *</label>

        <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-500 transition">
          <Mail className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />

          <input
            type="email"
            name="email"
            value={customer.email}
            onChange={onChange}
            placeholder="Enter your email"
            className="w-full outline-none bg-transparent"
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Phone *</label>

        <div className="flex items-center border rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-500 transition">
          <Phone className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />

          <input
            type="tel"
            name="phone"
            value={customer.phone}
            onChange={onChange}
            placeholder="Enter your phone number"
            className="w-full outline-none bg-transparent"
            required
          />
        </div>
      </div>

      {/* Delivery Address */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Delivery Address *
        </label>

        <div className="flex items-start border rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-500 transition">
          <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0" />

          <textarea
            name="address"
            value={customer.address}
            onChange={onChange}
            placeholder="Enter your delivery address"
            className="w-full outline-none bg-transparent resize-none"
            rows="3"
            required
          />
        </div>
      </div>

      {/* Special Instructions */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Special Instructions
        </label>

        <textarea
          name="specialInstructions"
          value={customer.specialInstructions}
          onChange={onChange}
          placeholder="Any special delivery instructions?"
          className="w-full border rounded-lg p-3 resize-none outline-none focus:ring-2 focus:ring-green-500 transition"
          rows="2"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={disabled || submitting}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {submitting ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  </>
);

export default CustomerForm;
