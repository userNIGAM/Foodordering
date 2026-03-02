import { useState } from "react";
import api from "../../../services/api";

export default function CreateStaff() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "chef",
    phoneNumber: "",
    location: "",
    deliveryZone: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  // ---------------------
  // Form Validation
  // ---------------------
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number required";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location required";
    }

    if (form.role === "delivery_person" && !form.deliveryZone.trim()) {
      newErrors.deliveryZone = "Delivery zone required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ---------------------
  // Submit
  // ---------------------
  const submitHandler = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await api.post("/api/admin/create-staff", form);

      setMessage(res.data.message);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "chef",
        phoneNumber: "",
        location: "",
        deliveryZone: ""
      });

    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">

      <h2 className="text-xl font-semibold mb-4">
        Create Staff Account
      </h2>

      {message && (
        <div className="mb-3 text-sm text-blue-600">{message}</div>
      )}

      <form onSubmit={submitHandler} className="space-y-3">

        {/* Name */}
        <div>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Role */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="chef">Chef</option>
          <option value="delivery_person">Delivery Person</option>
        </select>

        {/* Phone */}
        <div>
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>

        {/* Delivery Zone */}
        {form.role === "delivery_person" && (
          <div>
            <input
              name="deliveryZone"
              placeholder="Delivery Zone"
              value={form.deliveryZone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.deliveryZone && (
              <p className="text-red-500 text-sm">{errors.deliveryZone}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create Staff"}
        </button>

      </form>
    </div>
  );
}